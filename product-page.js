(() => {
  "use strict";
  const root=document.querySelector("[data-app]");
  if(!root)return;
  const appId=root.dataset.app;
  const esc=value=>String(value==null?"":value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const date=value=>{
    if(!value)return "No release yet";
    const d=new Date(value); if(Number.isNaN(d.getTime()))return "Date unavailable";
    return new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Kolkata"}).format(d);
  };
  const size=value=>{
    if(!value)return "";
    return value<1048576?(value/1024).toFixed(0)+" KB":(value/1048576).toFixed(1)+" MB";
  };
  const repoLink=app=>app.repo||"#";
  const releaseLink=app=>app.releaseUrl||app.repo||"#";
  const primaryButton=(app)=>{
    if(app.assetUrl&&app.assetName){
      const label=app.prerelease?"Download preview APK":"Download latest APK";
      return '<a class="button primary" id="productDownload" href="'+esc(app.assetUrl)+'" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 17v3h14v-3"/></svg><span>'+label+'</span></a>';
    }
    return '<span class="download-unavailable" id="productDownload">No APK currently attached</span>';
  };
  function heroArtwork(app){
    const visual=app.heroImage
      ? '<img class="product-hero-image" src="'+esc(app.heroImage)+'" alt="'+esc(app.title)+' interface preview" onerror="this.hidden=true">'
      : '<div class="product-art '+(app.heroArt==="liquid"?"liquid":"")+'"><div class="product-art-symbol">'+esc(app.icon||"m.")+'</div><div class="product-art-label"><span>MANGOLOADS</span><span>'+esc(app.id.toUpperCase())+'</span></div></div>';
    return '<div class="product-hero-media"><div class="product-halo"></div>'+visual+'<div class="product-hero-foot">PROJECT PREVIEW · '+esc(app.title.toUpperCase())+'</div></div>';
  }
  function featureVisual(section,index,app){
    const art=section.image
      ? '<img src="'+esc(section.image)+'" alt="'+esc(section.title)+'" loading="lazy" onerror="this.hidden=true">'
      : '<div class="story-art-symbol">'+esc(app.icon||"m.")+'</div>';
    return '<div class="story-media" aria-label="'+esc(section.title)+' visual">'+art+'<div class="story-art-label"><span>'+esc(app.title.toUpperCase())+'</span><span>'+String(index+1).padStart(2,"0")+' / '+String(app.features.length).padStart(2,"0")+'</span></div></div>';
  }
  function render(app,build){
    document.title=app.title+" — MangoLoads";
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content=app.subtitle+" "+app.description;
    document.querySelectorAll("[data-product-title]").forEach(el=>el.textContent=app.title);
    const statusClass=app.type==="community"?"community":(build.prerelease?"preview":"");
    const statusText=build.assetUrl?(build.prerelease?"Preview / pre-release build":"Release build"): "No APK attached";
    const hero=document.getElementById("productHero");
    hero.innerHTML=
      '<div class="product-hero-copy fade-up visible">'+
        '<div class="product-kicker">'+esc(app.kicker)+'</div>'+
        '<h1><span class="gradient-text">'+esc(app.title)+'</span></h1>'+
        '<p class="product-subtitle">'+esc(app.subtitle)+'</p>'+
        '<p class="product-intro">'+esc(app.intro)+'</p>'+
        '<div class="product-status-row"><span class="product-status '+statusClass+'">'+esc(statusText)+'</span><span class="product-status">'+esc(app.type==="original"?"Original project":"Upstream / community project")+'</span></div>'+
        '<div class="product-hero-actions">'+primaryButton(build)+'<a class="button" href="'+esc(repoLink(app))+'" target="_blank" rel="noopener noreferrer">View source ↗</a></div>'+
        '<div class="product-build-note" id="productBuildNote">'+
          (build.assetUrl
            ? '<span>Latest available: <strong>'+esc(build.releaseTag||"Release")+'</strong></span><span>'+esc(date(build.publishedAt))+'</span><span>'+esc(size(build.assetBytes))+'</span>'
            : '<span>No APK asset found in the repository releases.</span>')+
        '</div>'+
      '</div>'+heroArtwork(app);

    const strip=document.getElementById("productStrip");
    strip.innerHTML=
      '<span>PROJECT <b>'+esc(app.type==="original"?"Original":"Community / fork")+'</b></span>'+
      '<span>STATUS <b>'+esc(app.status)+'</b></span>'+
      '<span>PLATFORM <b>'+esc(app.tags.slice(0,2).join(" · "))+'</b></span>';

    const features=document.getElementById("productFeatures");
    features.innerHTML=app.features.map((section,index)=>{
      const points=(section.points||[]).map(point=>'<div class="story-point"><i>✓</i><span>'+esc(point)+'</span></div>').join("");
      return '<section class="product-story fade-up"><div class="story-copy"><div class="kicker">'+esc(section.eyebrow)+'</div><h2>'+esc(section.title)+'</h2><p>'+esc(section.body)+'</p><div class="story-points">'+points+'</div></div>'+featureVisual(section,index,app)+'</section>';
    }).join("");

    const final=document.getElementById("productFinal");
    final.innerHTML=
      '<div class="kicker">Take a closer look</div>'+
      '<h2>'+esc(app.assetUrl?"Ready to give it a try?":"Explore the project.")+'</h2>'+
      '<p>'+esc(app.assetUrl?"The latest published build is hosted by GitHub. Open the release notes for full build details.":"No APK is currently attached to this project's GitHub Releases. You can still inspect the source and follow its development.")+'</p>'+
      '<div class="product-hero-actions">'+primaryButton(build)+'<a class="button" href="'+esc(releaseLink(build))+'" target="_blank" rel="noopener noreferrer">Release notes ↗</a></div>'+
      (app.caveat?'<p class="product-caveat">'+esc(app.caveat)+'</p>':"");

    const more=document.getElementById("productMore");
    more.innerHTML=
      '<a href="../../downloads.html">← All applications</a>'+
      '<span>Source and release history remain on GitHub.</span>'+
      '<a href="'+esc(repoLink(app))+'" target="_blank" rel="noopener noreferrer">Open repository ↗</a>';

    document.querySelectorAll(".product-story").forEach((el,i)=>{
      el.style.setProperty("--story-index",String(i));
    });
    const storyNodes=document.querySelectorAll(".product-story.fade-up");
    if("IntersectionObserver" in window){
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
        });
      },{threshold:0.12,rootMargin:"0px 0px -34px 0px"});
      storyNodes.forEach(node=>observer.observe(node));
    }else{
      storyNodes.forEach(node=>node.classList.add("visible"));
    }
  }

  async function fetchLatest(app){
    const response=await fetch("https://api.github.com/repos/Batmancpu/"+encodeURIComponent(app.repository)+"/releases?per_page=100",{
      headers:{"Accept":"application/vnd.github+json"},cache:"no-store"
    });
    if(!response.ok)throw new Error("GitHub API "+response.status);
    const releases=await response.json();
    const candidates=[];
    releases.filter(r=>r&&!r.draft&&Array.isArray(r.assets)).forEach(release=>{
      const apk=release.assets.filter(a=>a&&a.browser_download_url&&/\.apk$/i.test(a.name||""));
      if(apk.length){
        apk.sort((a,b)=>(b.size||0)-(a.size||0));
        candidates.push({release,asset:apk[0]});
      }
    });
    candidates.sort((a,b)=>(Date.parse(b.release.published_at||b.release.created_at||"")||0)-(Date.parse(a.release.published_at||a.release.created_at||"")||0));
    if(!candidates.length)return Object.assign({},app,{assetUrl:"",assetName:"",assetBytes:0,publishedAt:"",releaseTag:"",releaseUrl:app.releaseUrl||app.repositoryUrl});
    const x=candidates[0];
    return Object.assign({},app,{
      assetUrl:x.asset.browser_download_url,assetName:x.asset.name,assetBytes:x.asset.size||0,
      publishedAt:x.release.published_at||x.release.created_at||app.publishedAt,
      releaseTag:x.release.tag_name||app.releaseTag,releaseTitle:x.release.name||app.releaseTitle,
      releaseUrl:x.release.html_url||app.releaseUrl,prerelease:Boolean(x.release.prerelease)
    });
  }

  Promise.all([
    fetch("../../products.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("products.json");return r.json();}),
    fetch("../../downloads.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("downloads.json");return r.json();})
  ]).then(async ([catalog,manifest])=>{
    const app=(catalog.apps||[]).find(x=>x.id===appId);
    const fallback=(manifest.apps||[]).find(x=>x.id===appId);
    if(!app||!fallback)throw new Error("Application not found");
    const combined=Object.assign({},app,fallback,{
      repository: fallback.repository,repositoryUrl:fallback.repositoryUrl,
      assetUrl:fallback.assetUrl,assetName:fallback.assetName,assetBytes:fallback.assetBytes,
      releaseTag:fallback.releaseTag,releaseTitle:fallback.releaseTitle,
      publishedAt:fallback.publishedAt,prerelease:fallback.prerelease,releaseUrl:fallback.releaseUrl
    });
    render(app,combined);
    try{
      const live=await fetchLatest(combined);
      render(app,live);
      const stamp=new Date().toISOString();
      try{localStorage.setItem("mangoloads.releases.v3",JSON.stringify({savedAt:Date.now(),checkedAt:stamp,apps:manifest.apps.map(x=>x.id===appId?Object.assign({},x,live):x)}));}catch(_){}
    }catch(error){
      const note=document.getElementById("productBuildNote");
      if(note)note.insertAdjacentHTML("beforeend",'<span class="api-note">Showing last verified release data · live check unavailable</span>');
    }
  }).catch(error=>{
    const hero=document.getElementById("productHero");
    if(hero)hero.innerHTML='<div class="product-copy-error"><h1>Application details unavailable.</h1><p>Open the project catalogue and try again.</p><a class="button primary" href="../../downloads.html">Back to applications</a></div>';
  });
})();