(() => {
 "use strict";
 const body=document.querySelector("body[data-app]");if(!body)return;
 const appId=body.dataset.app;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const date=v=>{if(!v)return"No release yet";const d=new Date(v);return Number.isNaN(d.getTime())?"Date unavailable":new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Kolkata"}).format(d);};
 const size=v=>!v?"":v<1048576?Math.round(v/1024)+" KB":(v/1048576).toFixed(1)+" MB";
 const accents={mint:["#718a75","#e1e9dc"],blue:["#7289ac","#e0e6ef"],amber:["#aa8050","#eee2d2"],violet:["#847ba6","#e7e3ef"],pink:["#a57583","#efe0e2"],orange:["#a96f4e","#eee0d6"],slate:["#6f8585","#e1e8e7"]};

 function brrBoardKeyboard(suggestion){
  const rows=[["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["⇧","Z","X","C","V","B","N","M","⌫"]];
  return '<div class="bb-keyboard"><div class="bb-suggestion">'+esc(suggestion)+'</div>'+
   rows.map((row,index)=>'<div class="bb-key-row">'+row.map((letter,i)=>'<span class="bb-key '+((index===2&&(i===0||i===row.length-1))?'alt':'')+'">'+esc(letter)+'</span>').join("")+'</div>').join("")+
   '<div class="bb-key-row"><span class="bb-key alt">123</span><span class="bb-key">☻</span><span class="bb-key space">space</span><span class="bb-key action">Go</span></div></div>';
 }

 function brrBoardFeatureVisual(index){
  let content="";
  if(index===0)content=brrBoardKeyboard("hello　　 there　　 world");
  else if(index===1)content=brrBoardKeyboard("happy　　 birthday　　 today");
  else if(index===2)content='<div class="bb-cards"><div class="bb-card"><span class="bb-card-icon">◈</span><strong>Clipboard</strong><small>Find what you chose to save. Stored on device.</small></div><div class="bb-card"><span class="bb-card-icon">☺</span><strong>Emoji</strong><small>Search by description and revisit favourites.</small></div></div>';
  else content='<div class="bb-voice-legend">OFFLINE SPEECH</div><div class="bb-voice-symbol"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="23" y="8" width="18" height="33" rx="9"/><path d="M15 31c0 11 6 18 17 18s17-7 17-18M32 49v9m-10 0h20"/></svg></div>';
  return '<div class="story-media"><div class="bb-visual">'+content+'<span class="bb-visual-caption">Illustration of the feature · not a device screenshot</span></div></div>';
 }

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
  if(app.id==="brrrboard")return '<div class="bb-stage"><img src="../../assets/visuals/brrboard-brand.webp" width="700" height="700" alt="Official brrBoard keyboard-and-mango MangoLoads logo"><span class="bb-stage-caption">Official identity artwork · not a keyboard screenshot</span></div>';
  const fallback='<div class="product-art '+esc(app.heroArt||"")+'"><div class="product-art-visual">'+art(app.heroArt,app.icon,0)+'</div><div class="product-art-label"><span>MANGOLOADS</span><span>'+esc(app.id.toUpperCase())+'</span></div></div>';
  if(!app.heroImage)return fallback;
  const wide=app.id==="bitchord"||app.id==="dictate"||/Banner\.png|banner_\d+/i.test(app.heroImage);
  return '<div class="hero-image-wrap">'+fallback+'<img class="product-hero-image '+(wide?"wide":"")+'" src="'+esc(app.heroImage)+'" alt="'+esc(app.title+" interface preview")+'" loading="eager" onerror="this.remove()"></div>';
 }

 function featureVisual(app,feature,index){
  if(app.id==="brrrboard")return brrBoardFeatureVisual(index);
  if(feature.image){
   const wide=/Banner\.png|banner_\d+/i.test(feature.image)||app.id==="bitchord";
   return '<div class="story-media"><img class="'+(wide?"wide":"")+'" src="'+esc(feature.image)+'" alt="'+esc(app.title+" — "+feature.title)+'" loading="lazy" onerror="this.remove()"></div>';
  }
  return '<div class="story-media">'+art(app.heroArt,app.icon,index)+'</div>';
 }

 function latest(releases,app){
  if(!Array.isArray(releases))return null;const list=[];
  releases.forEach(release=>{
   if(!release||release.draft||!Array.isArray(release.assets))return;
   if(app.id==="brrrboard"&&(release.prerelease||!/^v1\.0\.\d+$/.test(release.tag_name||"")))return;
   release.assets.filter(asset=>asset&&asset.browser_download_url&&(app.id==="brrrboard"?asset.name==="brrBoard.apk":/\.apk$/i.test(asset.name||""))).forEach(asset=>list.push({release,asset}));
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
   const releases=await response.json();
   const found=latest(releases,app);
   if(!found)return Object.assign({},fallback,{assetUrl:"",assetName:"",assetBytes:0,releaseTag:"",publishedAt:"",releaseUrl:app.repo});
   return {assetUrl:found.asset.browser_download_url,assetName:found.asset.name,assetBytes:found.asset.size||0,releaseTag:found.release.tag_name||"",publishedAt:found.release.published_at||found.release.created_at||"",prerelease:Boolean(found.release.prerelease),releaseUrl:found.release.html_url||app.repo,history:app.id==="brrrboard"?releases.filter(release=>release&&!release.draft&&!release.prerelease&&/^v1\.0\.\d+$/.test(release.tag_name||"")&&Array.isArray(release.assets)&&release.assets.some(asset=>asset.name==="brrBoard.apk")).sort((a,b)=>(Date.parse(b.published_at||"")||0)-(Date.parse(a.published_at||"")||0)).slice(0,8):[]};
  }catch(_){return fallback;}
 }

 function renderBrrBoardHistory(build){
  let section=document.getElementById("bbReleaseHistory");
  if(!section){section=document.createElement("section");section.id="bbReleaseHistory";section.className="container bb-release-history";document.getElementById("productFinal").before(section);}
  const history=Array.isArray(build.history)&&build.history.length?build.history:[{tag_name:build.releaseTag,published_at:build.publishedAt,html_url:build.releaseUrl,body:"See GitHub for this release's exact source commit, attached APK and checksum."}].filter(release=>release.tag_name);
  const time=value=>{const d=new Date(value||"");return Number.isNaN(d.getTime())?"Date unavailable":new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:true,timeZone:"Asia/Kolkata"}).format(d)+" IST";};
  section.innerHTML='<div class="kicker">Build by build</div><h2>Every version has a story.</h2><p class="bb-release-intro">The latest published APKs, straight from GitHub. Open a version to see its published note and exact release page. The app is still being tested on real devices; a published build is not a guarantee that every visual issue is resolved.</p>'+
   '<div class="bb-release-list">'+history.map((release,index)=>{
    const body=String(release.body||"").trim().slice(0,900)||"This release has no detailed public notes yet. The exact source and downloadable files are on GitHub.";
    return '<details'+(index===0?' open':'')+'><summary><strong>'+esc(release.tag_name||"Release")+(index===0?' · Latest':'')+'</strong><small>'+esc(time(release.published_at||release.created_at))+'</small></summary><div class="bb-release-body"><p>'+esc(body)+'</p><a href="'+esc(release.html_url||build.releaseUrl||"https://github.com/Batmancpu/brrrBoard/releases")+'" target="_blank" rel="noopener noreferrer">View this release on GitHub</a></div></details>';
   }).join("")+'</div><p class="bb-release-note">Times are displayed in India Standard Time. A version without detailed notes links to its original GitHub record.</p>';
 }

 function render(app,build){
  if(app.id==="brrrboard")body.classList.add("brrboard-page");
  document.title=app.title+" — MangoLoads";
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=app.subtitle+" "+app.description;
  const tone=accents[app.accent]||accents.mint;body.style.setProperty("--product-accent",tone[0]);body.style.setProperty("--product-wash",tone[1]);
  const status=build.assetUrl?(build.prerelease?"Preview / test build":"Release build"):"No APK published";
  const buildMeta=build.assetUrl
   ?'<span>BUILD <strong>'+esc(build.releaseTag||"Latest")+'</strong></span><span>DATE <strong>'+esc(date(build.publishedAt))+'</strong></span><span>FILE <strong>'+esc(size(build.assetBytes))+'</strong></span>'
   :'<span>No APK release asset is currently attached to this repository.</span>';
  const primary=build.assetUrl
   ?'<a class="button primary" href="'+esc(build.assetUrl)+'" target="_blank" rel="noopener noreferrer">Download latest APK</a>'
   :'<span class="button" aria-disabled="true">No APK available</span>';

  document.getElementById("productHero").innerHTML=
   '<div class="product-hero-copy fade-up visible"><div class="product-kicker">'+esc(app.kicker||app.tags?.slice(0,2).join(" · ")||"APPLICATION")+'</div>'+
   '<h1>'+esc(app.title)+'</h1><p class="product-subtitle">'+esc(app.subtitle)+'</p><p class="product-intro">'+esc(app.description)+'</p>'+
   '<div class="product-status-row"><span class="product-status '+(build.prerelease?"preview":"")+'">'+esc(status)+'</span><span class="product-status">'+esc(app.type==="original"?"Original project":"Fork / upstream project")+'</span></div>'+
   '<div class="product-hero-actions">'+primary+'<a class="button" href="'+esc(app.repo||"#")+'" target="_blank" rel="noopener noreferrer">View source</a></div>'+
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
   (app.caveat?'<div class="product-caveat">'+esc(app.caveat)+'</div>':"")+
   (app.id==="brrrboard"?'<div class="bb-install-guide"><h3>Before you install</h3><div><p><b>New installation.</b> The regular update APK does not include the large offline voice model. Voice needs a separate, original-signed model-inclusive bootstrap release.</p><p><b>Updating an older app.</b> The current Android package is <code>com.mangoloads.board</code>. The former package cannot update in place; export and restore your settings first.</p><p><b>Swipe input.</b> Compatible offline gesture libraries are imported separately. The standard APK does not silently ship one.</p></div><a href="https://github.com/Batmancpu/brrrBoard/blob/main/README.md" target="_blank" rel="noopener noreferrer">Read the full setup guide</a><a href="https://github.com/Batmancpu/brrrBoard/blob/main/PRIVACY_POLICY.md" target="_blank" rel="noopener noreferrer">Privacy details</a></div>':"");
  if(app.id==="brrrboard")renderBrrBoardHistory(build);

  const final=document.getElementById("productFinal");
  const copy=build.assetUrl?"The latest published APK is hosted on GitHub. Check the version and release notes before installing.":"There is no APK attached to the GitHub Releases list right now. The source repository remains available.";
  const get=build.assetUrl
   ?'<a class="button primary" href="'+esc(build.assetUrl)+'" target="_blank" rel="noopener noreferrer">Download latest APK</a>'
   :'<a class="button primary" href="'+esc(app.repo||"#")+'" target="_blank" rel="noopener noreferrer">Open repository</a>';
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
  render(app,fallback);
  const live=await liveBuild(app,fallback);
  if(live!==fallback)render(app,live);
 }).catch(()=>{
  const hero=document.getElementById("productHero");
  if(hero)hero.innerHTML='<div class="product-hero-copy"><div class="product-kicker">MANGOLOADS</div><h1>Application unavailable.</h1><p class="product-intro">Return to the applications page to open another project.</p><a class="button primary" href="../../downloads.html">All applications ↗</a></div>';
 });
})();
