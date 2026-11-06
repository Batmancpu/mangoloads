(() => {
 "use strict";
 const body=document.querySelector("body[data-app]");if(!body)return;
 const appId=body.dataset.app;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const date=v=>{if(!v)return"No release yet";const d=new Date(v);return Number.isNaN(d.getTime())?"Date unavailable":new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Kolkata"}).format(d);};
 const size=v=>!v?"":v<1048576?Math.round(v/1024)+" KB":(v/1048576).toFixed(1)+" MB";
 const accents={mint:["#718a75","#e1e9dc"],blue:["#7289ac","#e0e6ef"],amber:["#aa8050","#eee2d2"],violet:["#847ba6","#e7e3ef"],pink:["#a57583","#efe0e2"],orange:["#a96f4e","#eee0d6"],slate:["#6f8585","#e1e8e7"]};

 function art(type,icon,index=0){
  if(type==="keyboard"||type==="keyboard-simple"){
   const rows=[["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["⇧","Z","X","C","V","B","N","M","⌫"]];
   return '<div class="keyboard-board"><div class="key-row">'+["hello","there","Mango"].map(x=>'<i class="key-word">'+x+'</i>').join("")+'</div>'+rows.map(row=>'<div class="key-row">'+row.map(()=>'<i></i>').join("")+'</div>').join("")+'</div>';
  }
  if(type==="liquid")return '<div class="lens-art"></div>';
  if(type==="music")return '<div class="album-art"></div>';
  if(type==="dictate")return '<div class="voice-art">◖</div><div class="art-wave">'+Array.from({length:15},(_,i)=>'<i style="--h:'+([20,42,68,32,84,47,94,35][i%8])+'px"></i>').join("")+'</div>';
  if(type==="archive")return '<div class="library-art"><span>YOUR LIBRARY</span><i></i><i></i><i></i><i></i></div>';
  if(type==="news")return '<div class="library-art"><span>'+(index%2?"READING LIST":"THE DAILY BRIEF")+'</span><i></i><i></i><i></i><i></i></div>';
  return '<div class="art-mark">'+esc(icon||"m.")+'</div>';
 }

 function heroVisual(app){
  const fallback='<div class="product-art '+esc(app.heroArt||"")+'"><div class="product-art-visual">'+art(app.heroArt,app.icon,0)+'</div><div class="product-art-label"><span>MANGOLOADS</span><span>'+esc(app.id.toUpperCase())+'</span></div></div>';
  if(!app.heroImage)return fallback;
  const wide=app.id==="bitchord"||app.id==="dictate"||/Banner\.png|banner_\d+/i.test(app.heroImage);
  return '<div class="hero-image-wrap">'+fallback+'<img class="product-hero-image '+(wide?"wide":"")+'" src="'+esc(app.heroImage)+'" alt="'+esc(app.title+" interface preview")+'" loading="eager" onerror="this.remove()"></div>';
 }

 function featureVisual(app,feature,index){
  if(feature.image){
   const wide=/Banner\.png|banner_\d+/i.test(feature.image)||app.id==="bitchord";
   return '<div class="story-media"><img class="'+(wide?"wide":"")+'" src="'+esc(feature.image)+'" alt="'+esc(app.title+" — "+feature.title)+'" loading="lazy" onerror="this.remove()"></div>';
  }
  return '<div class="story-media">'+art(app.heroArt,app.icon,index)+'</div>';
 }

 function latest(releases){
  if(!Array.isArray(releases))return null;const list=[];
  releases.forEach(release=>{
   if(!release||release.draft||!Array.isArray(release.assets))return;
   release.assets.filter(asset=>asset&&asset.browser_download_url&&/\.apk$/i.test(asset.name||"")).forEach(asset=>list.push({release,asset}));
  });
  list.sort((a,b)=>(Date.parse(b.release.published_at||b.release.created_at||"")||0)-(Date.parse(a.release.published_at||a.release.created_at||"")||0));
  return list[0]||null;
 }

 async function liveBuild(app,fallback){
  const repository=(app.repo||"").replace("https://github.com/","");
  if(!repository.startsWith("Batmancpu/"))return fallback;
  try{
   const response=await fetch("https://api.github.com/repos/"+repository+"/releases?per_page=100",{headers:{"Accept":"application/vnd.github+json"},cache:"no-store"});
   if(!response.ok)throw new Error("GitHub API unavailable");
   const found=latest(await response.json());
   if(!found)return Object.assign({},fallback,{assetUrl:"",assetName:"",assetBytes:0,releaseTag:"",publishedAt:"",releaseUrl:app.repo});
   return {assetUrl:found.asset.browser_download_url,assetName:found.asset.name,assetBytes:found.asset.size||0,releaseTag:found.release.tag_name||"",publishedAt:found.release.published_at||found.release.created_at||"",prerelease:Boolean(found.release.prerelease),releaseUrl:found.release.html_url||app.repo};
  }catch(_){return fallback;}
 }

 function render(app,build){
  document.title=app.title+" — MangoLoads";
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=app.subtitle+" "+app.description;
  const tone=accents[app.accent]||accents.mint;body.style.setProperty("--product-accent",tone[0]);body.style.setProperty("--product-wash",tone[1]);
  const status=build.assetUrl?(build.prerelease?"Preview / test build":"Release build"):"No APK published";
  const buildMeta=build.assetUrl
   ?'<span>BUILD <strong>'+esc(build.releaseTag||"Latest")+'</strong></span><span>DATE <strong>'+esc(date(build.publishedAt))+'</strong></span><span>FILE <strong>'+esc(size(build.assetBytes))+'</strong></span>'
   :'<span>No APK release asset is currently attached to this repository.</span>';
  const primary=build.assetUrl
   ?'<a class="button primary" href="'+esc(build.assetUrl)+'" target="_blank" rel="noopener noreferrer">Download latest APK ↓</a>'
   :'<span class="button" aria-disabled="true">No APK available</span>';

  document.getElementById("productHero").innerHTML=
   '<div class="product-hero-copy fade-up visible"><div class="product-kicker">'+esc(app.kicker||app.tags?.slice(0,2).join(" · ")||"APPLICATION")+'</div>'+
   '<h1>'+esc(app.title)+'</h1><p class="product-subtitle">'+esc(app.subtitle)+'</p><p class="product-intro">'+esc(app.description)+'</p>'+
   '<div class="product-status-row"><span class="product-status '+(build.prerelease?"preview":"")+'">'+esc(status)+'</span><span class="product-status">'+esc(app.type==="original"?"Original project":"Fork / upstream project")+'</span></div>'+
   '<div class="product-hero-actions">'+primary+'<a class="button" href="'+esc(app.repo||"#")+'" target="_blank" rel="noopener noreferrer">View source ↗</a></div>'+
   '<div class="product-build-note">'+buildMeta+'</div></div><div class="product-hero-media">'+heroVisual(app)+'<div class="product-hero-foot">MANGOLOADS · '+esc(app.title.toUpperCase())+'</div></div>';

  document.getElementById("productStrip").innerHTML=
   '<span>PROJECT <b>'+esc(app.type==="original"?"Original":"Fork / community")+'</b></span>'+
   '<span>STATUS <b>'+esc(app.status||"In progress")+'</b></span>'+
   '<span>PLATFORM <b>'+esc((app.tags||[]).slice(0,2).join(" · "))+'</b></span>';

  document.getElementById("productIntro").innerHTML=
   '<div class="kicker">A closer look</div><h2>'+esc(app.subtitle||app.description||"")+'</h2><p>'+esc(app.description||"")+'</p>';

  document.getElementById("productFeatures").innerHTML=(app.features||[]).map((feature,index)=>{
   const points=(feature.points||[]).map(point=>'<div class="story-point"><i>✓</i><span>'+esc(point)+'</span></div>').join("");
   return '<section class="container product-story fade-up"><div class="story-copy"><div class="kicker">'+esc(feature.eyebrow||("FEATURE / "+String(index+1).padStart(2,"0")))+'</div><h2>'+esc(feature.title)+'</h2><p>'+esc(feature.body)+'</p><div class="story-points">'+points+'</div></div>'+featureVisual(app,feature,index)+'</section>';
  }).join("");

  const images=[app.screenshot,...(app.features||[]).map(feature=>feature.image)].filter((url,index,all)=>url&&all.indexOf(url)===index);
  const gallery=document.getElementById("productGallery");
  if(images.length>1){
   gallery.hidden=false;
   gallery.innerHTML='<div class="kicker">A closer look</div><h2>See it in context.</h2><div class="gallery-track">'+images.map((url,index)=>'<img src="'+esc(url)+'" alt="'+esc(app.title+" screenshot "+(index+1))+'" loading="lazy">').join("")+'</div>';
  }else gallery.hidden=true;

  document.getElementById("productDetails").innerHTML=
   '<div class="kicker">At a glance</div><h2>What it brings together.</h2><div class="feature-list">'+(app.tags||[]).map(tag=>'<span class="feature-pill">'+esc(tag)+'</span>').join("")+'</div>'+
   (app.caveat?'<div class="product-caveat">'+esc(app.caveat)+'</div>':"");

  const final=document.getElementById("productFinal");
  const copy=build.assetUrl?"The latest published APK is hosted on GitHub. Check the version and release notes before installing.":"There is no APK attached to the GitHub Releases list right now. The source repository remains available.";
  const get=build.assetUrl
   ?'<a class="button primary" href="'+esc(build.assetUrl)+'" target="_blank" rel="noopener noreferrer">Download latest APK ↓</a>'
   :'<a class="button primary" href="'+esc(app.repo||"#")+'" target="_blank" rel="noopener noreferrer">Open repository ↗</a>';
  final.innerHTML='<div class="kicker">Take it further</div><h2>'+(build.assetUrl?"Ready when you are.":"Explore the project.")+'</h2><p>'+copy+'</p><div class="product-final-actions">'+get+
   (build.releaseUrl?'<a class="button" href="'+esc(build.releaseUrl)+'" target="_blank" rel="noopener noreferrer">Release notes ↗</a>':"")+
   (app.upstream?'<a class="button" href="'+esc(app.upstream)+'" target="_blank" rel="noopener noreferrer">Upstream project ↗</a>':"")+
   '<a class="button" href="'+esc(app.repo||"#")+'" target="_blank" rel="noopener noreferrer">Source code ↗</a><a class="button" href="../../downloads.html">All applications ↗</a></div>';

  const reveal=document.querySelectorAll("#productIntro.fade-up,#productFeatures .fade-up,#productGallery.fade-up,#productDetails.fade-up,#productFinal.fade-up");
  if("IntersectionObserver"in window){
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
   }),{threshold:.1,rootMargin:"0px 0px -24px 0px"});
   reveal.forEach(element=>observer.observe(element));
  }else reveal.forEach(element=>element.classList.add("visible"));
 }

 Promise.all([
  fetch("../../products.json",{cache:"no-cache"}).then(response=>{if(!response.ok)throw new Error("catalogue");return response.json();}),
  fetch("../../downloads.json",{cache:"no-cache"}).then(response=>response.ok?response.json():{apps:[]}).catch(()=>({apps:[]}))
 ]).then(async([catalogue,downloadData])=>{
  const app=(catalogue.apps||[]).find(item=>item.id===appId);if(!app)throw new Error("Application not found");
  const saved=(downloadData.apps||[]).find(item=>item.id===appId)||{};
  const fallback={assetUrl:saved.assetUrl||"",assetName:saved.assetName||"",assetBytes:saved.assetBytes||0,releaseTag:saved.releaseTag||"",publishedAt:saved.publishedAt||"",prerelease:Boolean(saved.prerelease),releaseUrl:saved.releaseUrl||""};
  render(app,await liveBuild(app,fallback));
 }).catch(()=>{
  const hero=document.getElementById("productHero");
  if(hero)hero.innerHTML='<div class="product-hero-copy"><div class="product-kicker">MANGOLOADS</div><h1>Application unavailable.</h1><p class="product-intro">Return to the applications page to open another project.</p><a class="button primary" href="../../downloads.html">All applications ↗</a></div>';
 });
})();