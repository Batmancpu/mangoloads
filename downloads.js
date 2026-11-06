(() => {
  "use strict";
  const list=document.getElementById("downloadList");
  const status=document.getElementById("releaseStatus");
  const empty=document.getElementById("noDownloads");
  const search=document.getElementById("downloadSearch");
  const cacheKey="mangoloads.release-catalogue.v5";
  const cacheAge=20*60*1000;
  let applications=[];
  let activeFilter="all";

  const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const bytes=value=>!value?"":value<1048576?Math.round(value/1024)+" KB":(value/1048576).toFixed(1)+" MB";
  const date=value=>{
    if(!value)return "No release yet";
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return "Date unavailable";
    return new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"}).format(d);
  };
  const detailUrl=app=>"apps/"+encodeURIComponent(app.id)+"/";
  const category=app=>app.id==="liquidlab"?"experiments":(app.category||app.type||"community");

  function render(){
    if(!list)return;
    const query=search?search.value.trim().toLowerCase():"";
    const visible=applications.filter(app=>{
      const matchCategory=activeFilter==="all"||category(app)===activeFilter;
      const words=[app.title,app.subtitle,app.description,app.kicker,app.tags?.join(" "),app.releaseTag].join(" ").toLowerCase();
      return matchCategory&&words.includes(query);
    });
    list.innerHTML=visible.map(app=>{
      const build=app.build||{};
      const available=Boolean(build.assetUrl&&build.assetName);
      const preview=available&&Boolean(build.prerelease);
      const icon=app.iconUrl
        ? '<img src="'+esc(app.iconUrl)+'" alt="" loading="lazy" onerror="this.remove()">'
        : "";
      const fallback='<span class="fallback-icon" '+(app.iconUrl?'hidden':'')+'>'+esc(app.icon||app.initial||"m.")+'</span>';
      const download=available
        ? '<a class="button primary" href="'+esc(build.assetUrl)+'" target="_blank" rel="noopener noreferrer" aria-label="Download the latest '+esc(app.title)+' APK">↓ Download APK</a>'
        : '<a class="button" href="'+detailUrl(app)+'">View availability ↗</a>';
      const statusLabel=available?(preview?"Preview / test build":"Release build"):"No APK published";
      const size=bytes(build.assetBytes);
      const version=build.releaseTag||"No release";
      const metaDate=date(build.publishedAt);
      const repoName=(app.repo||"").replace("https://github.com/","");
      return '<article class="download-row fade-up visible" data-category="'+esc(category(app))+'">'+
        '<a class="download-art" href="'+detailUrl(app)+'" aria-label="View '+esc(app.title)+'"><span class="fallback-icon" '+(app.iconUrl?'':'')+'>'+esc(app.icon||app.initial||"m.")+'</span>'+icon+'</a>'+
        '<div class="download-main"><div class="download-eyebrow">'+esc(app.kicker||app.tags?.slice(0,2).join(" · ")||"APPLICATION")+'</div>'+
        '<h2><a href="'+detailUrl(app)+'">'+esc(app.title)+'</a></h2>'+
        '<p>'+esc(app.description||app.subtitle||"")+'</p>'+
        '<div class="download-meta"><span>Build <strong>'+esc(version)+'</strong></span><span>Published <strong>'+esc(metaDate)+'</strong></span>'+(size?'<span>File <strong>'+esc(size)+'</strong></span>':'')+'</div>'+
        '<span class="download-status '+(preview?"preview":"")+'">'+statusLabel+'</span></div>'+
        '<div class="download-actions">'+download+'<a class="detail-link" href="'+detailUrl(app)+'">Explore application ↗</a></div>'+
      '</article>';
    }).join("");
    if(empty)empty.style.display=visible.length?"none":"block";
  }

  function newestApk(releases){
    if(!Array.isArray(releases))return null;
    const candidates=[];
    releases.forEach(release=>{
      if(!release||release.draft||!Array.isArray(release.assets))return;
      release.assets.filter(asset=>asset&&asset.browser_download_url&&/\.apk$/i.test(asset.name||""))
        .forEach(asset=>candidates.push({release,asset}));
    });
    candidates.sort((a,b)=>(Date.parse(b.release.published_at||b.release.created_at||"")||0)-(Date.parse(a.release.published_at||a.release.created_at||"")||0));
    return candidates[0]||null;
  }

  async function updateBuilds(){
    if(!applications.length)return;
    let cached=null;
    try{cached=JSON.parse(localStorage.getItem(cacheKey)||"null");}catch(_){}
    if(cached&&cached.savedAt&&Date.now()-cached.savedAt<cacheAge&&Array.isArray(cached.apps)){
      applications=cached.apps;render();
      if(status)status.textContent="Release details checked "+new Date(cached.checkedAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})+" · cached";
      return;
    }
    if(status)status.textContent="Checking GitHub for the newest available APKs…";
    const results=await Promise.allSettled(applications.map(async app=>{
      const repo=(app.repo||"").replace("https://github.com/","");
      if(!repo.startsWith("Batmancpu/"))return app;
      const response=await fetch("https://api.github.com/repos/"+repo+"/releases?per_page=100",{headers:{"Accept":"application/vnd.github+json"},cache:"no-store"});
      if(!response.ok)throw new Error("GitHub API "+response.status);
      const release=newestApk(await response.json());
      if(!release)return Object.assign({},app,{build:{assetUrl:"",assetName:"",assetBytes:0,releaseTag:"",publishedAt:"",prerelease:false}});
      return Object.assign({},app,{build:{
        assetUrl:release.asset.browser_download_url,assetName:release.asset.name,assetBytes:release.asset.size||0,
        releaseTag:release.release.tag_name||"",publishedAt:release.release.published_at||release.release.created_at||"",
        prerelease:Boolean(release.release.prerelease),releaseUrl:release.release.html_url||""
      }});
    }));
    let success=0;
    applications=applications.map((app,index)=>{
      if(results[index].status==="fulfilled"){success++;return results[index].value;}
      return app;
    });
    render();
    const checkedAt=new Date().toISOString();
    if(success){
      try{localStorage.setItem(cacheKey,JSON.stringify({savedAt:Date.now(),checkedAt,apps:applications}));}catch(_){}
      if(status)status.textContent="Latest release assets checked "+new Date(checkedAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})+" · live from GitHub";
    }else if(status)status.textContent="Showing the last verified release details · GitHub could not be reached";
  }

  document.querySelectorAll("[data-filter]").forEach(button=>{
    button.addEventListener("click",()=>{
      activeFilter=button.dataset.filter||"all";
      document.querySelectorAll("[data-filter]").forEach(item=>{
        const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));
      });
      render();
    });
  });
  if(search)search.addEventListener("input",render);

  Promise.all([
    fetch("products.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("products");return r.json();}),
    fetch("downloads.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("downloads");return r.json();})
  ]).then(([productData,buildData])=>{
    const byId=new Map((buildData.apps||[]).map(app=>[app.id,app]));
    applications=(productData.apps||[]).map(app=>{
      const release=byId.get(app.id)||{};
      return Object.assign({},app,{build:{
        assetUrl:release.assetUrl||"",assetName:release.assetName||"",assetBytes:release.assetBytes||0,
        releaseTag:release.releaseTag||"",publishedAt:release.publishedAt||"",prerelease:Boolean(release.prerelease),
        releaseUrl:release.releaseUrl||""
      }});
    });
    render();
    updateBuilds();
  }).catch(()=>{
    if(status)status.textContent="The application catalogue could not be loaded. Open GitHub to see all projects.";
    if(empty)empty.style.display="block";
  });
})();