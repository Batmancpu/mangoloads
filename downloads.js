(() => {
  "use strict";
  const grid=document.getElementById("downloadGrid");
  const status=document.getElementById("releaseStatus");
  const empty=document.getElementById("noDownloads");
  const search=document.getElementById("downloadSearch");
  const cacheKey="mangoloads.releases.v3";
  const cacheAge=25*60*1000;
  let apps=[];
  let filter="all";

  const esc=value=>String(value==null?"":value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const bytes=value=>{
    if(!value||value<1)return "";
    return value<1048576?(value/1024).toFixed(0)+" KB":(value/1048576).toFixed(1)+" MB";
  };
  const date=value=>{
    if(!value)return "No release yet";
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return "Date unavailable";
    return new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"}).format(d);
  };
  const pageUrl=app=>"apps/"+encodeURIComponent(app.id)+"/";

  function render(){
    if(!grid)return;
    const query=search?search.value.trim().toLowerCase():"";
    const visible=apps.filter(app=>{
      const category=app.category||app.kind||"community";
      const matchFilter=filter==="all"||category===filter;
      const terms=[app.title,app.subtitle,app.description,app.repository,app.releaseTag,app.note].join(" ").toLowerCase();
      return matchFilter&&terms.includes(query);
    });
    grid.innerHTML=visible.map(app=>{
      const category=app.category||app.kind||"community";
      const image=app.iconUrl?'<img src="'+esc(app.iconUrl)+'" alt="" loading="lazy" onerror="this.remove()">':"";
      const statusLabel=app.assetUrl?(app.prerelease?"Preview build":"Release build"):"No APK yet";
      const preview=app.assetUrl&&app.prerelease;
      const detail=pageUrl(app);
      const build=app.assetUrl?"Latest build · "+bytes(app.assetBytes)+" · "+date(app.publishedAt):"Release archive · No attached APK";
      return '<a class="download-tile fade-up visible" href="'+detail+'" aria-label="Open '+esc(app.title)+' details">'+
        '<div class="download-tile-top"><div class="download-tile-icon">'+image+'<span>'+esc(app.initial||"m.")+'</span></div>'+
        '<div class="download-tile-heading"><h2>'+esc(app.title)+'</h2><p>'+esc(app.subtitle||"")+'</p></div>'+
        '<span class="download-tile-badge '+(preview?"preview":"")+'">'+esc(statusLabel)+'</span></div>'+
        '<p class="download-tile-description">'+esc(app.description||"")+'</p>'+
        '<div class="download-tile-bottom"><span>'+esc(build)+'</span><strong>View application <span class="download-tile-arrow">↗</span></strong></div>'+
      '</a>';
    }).join("");
    if(empty)empty.style.display=visible.length?"none":"block";
  }

  function latestApk(releases){
    if(!Array.isArray(releases))return null;
    const candidates=[];
    releases.forEach(release=>{
      if(!release||release.draft||!Array.isArray(release.assets))return;
      const assets=release.assets.filter(a=>a&&a.browser_download_url&&/\.apk$/i.test(a.name||""));
      if(!assets.length)return;
      assets.sort((a,b)=>(b.size||0)-(a.size||0));
      candidates.push({release,asset:assets[0]});
    });
    candidates.sort((a,b)=>(Date.parse(b.release.published_at||b.release.created_at||"")||0)-(Date.parse(a.release.published_at||a.release.created_at||"")||0));
    return candidates[0]||null;
  }

  async function refresh(){
    if(!apps.length)return;
    let cached=null;
    try{cached=JSON.parse(localStorage.getItem(cacheKey)||"null");}catch(_){}
    if(cached&&cached.savedAt&&Date.now()-cached.savedAt<cacheAge&&Array.isArray(cached.apps)){
      apps=cached.apps;render();
      if(status)status.textContent="Release data checked "+new Date(cached.checkedAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Kolkata"})+" IST · cached";
      return;
    }
    if(status)status.textContent="Checking published GitHub builds…";
    const results=await Promise.allSettled(apps.map(async app=>{
      if(!app.repository)return app;
      const url="https://api.github.com/repos/Batmancpu/"+encodeURIComponent(app.repository)+"/releases?per_page=100";
      const response=await fetch(url,{headers:{"Accept":"application/vnd.github+json"},cache:"no-store"});
      if(!response.ok)throw new Error("GitHub API "+response.status);
      const releases=await response.json();
      const found=latestApk(releases);
      if(!found){
        if(Array.isArray(releases)&&releases.length===0){
          return Object.assign({},app,{releaseTag:"",releaseTitle:"No GitHub Release found",publishedAt:"",assetName:"",assetUrl:"",assetBytes:0});
        }
        return app;
      }
      return Object.assign({},app,{
        releaseTag:found.release.tag_name||app.releaseTag,
        releaseTitle:found.release.name||found.release.tag_name||app.releaseTitle,
        publishedAt:found.release.published_at||found.release.created_at||app.publishedAt,
        prerelease:Boolean(found.release.prerelease),
        assetName:found.asset.name,assetUrl:found.asset.browser_download_url,assetBytes:found.asset.size||0,
        releaseUrl:found.release.html_url||app.releaseUrl
      });
    }));
    let success=0;
    apps=apps.map((app,i)=>{
      if(results[i].status==="fulfilled"){success++;return results[i].value;}
      return app;
    });
    render();
    const checkedAt=new Date().toISOString();
    if(success){
      try{localStorage.setItem(cacheKey,JSON.stringify({savedAt:Date.now(),checkedAt,apps}));}catch(_){}
      if(status)status.textContent="Updated "+new Date(checkedAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Kolkata"})+" IST · live GitHub release data";
    }else if(status){
      status.textContent="Showing the last verified release list · GitHub is temporarily unavailable";
    }
  }

  document.querySelectorAll("[data-download-filter]").forEach(button=>{
    button.addEventListener("click",()=>{
      filter=button.dataset.downloadFilter||"all";
      document.querySelectorAll("[data-download-filter]").forEach(b=>b.classList.toggle("active",b===button));
      render();
    });
  });
  if(search)search.addEventListener("input",render);

  fetch("downloads.json",{cache:"no-cache"})
    .then(response=>{if(!response.ok)throw new Error("Download manifest unavailable");return response.json();})
    .then(manifest=>{
      apps=Array.isArray(manifest.apps)?manifest.apps:[];
      render();
      refresh();
    })
    .catch(()=>{
      if(status)status.textContent="The project catalogue could not be loaded.";
      if(empty){empty.style.display="block";empty.textContent="Please reload this page or open the GitHub repository.";}
    });
})();