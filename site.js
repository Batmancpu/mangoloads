(() => {
 "use strict";
 const year=document.querySelector("[data-year]");if(year)year.textContent=String(new Date().getFullYear());
 const themeButton=document.querySelector("[data-theme-toggle]"),themeKey="mangoloads.appearance.v1";
 let theme="light";try{theme=localStorage.getItem(themeKey)||"light";}catch(_){}
 if(theme==="dark")document.body.classList.add("dark");
 const sync=()=>{if(!themeButton)return;const dark=document.body.classList.contains("dark");themeButton.textContent=dark?"☼":"◐";themeButton.setAttribute("aria-label",dark?"Switch to light appearance":"Switch to dark appearance");};
 sync();themeButton?.addEventListener("click",()=>{document.body.classList.toggle("dark");try{localStorage.setItem(themeKey,document.body.classList.contains("dark")?"dark":"light");}catch(_){}sync();});
 const reveal=document.querySelectorAll(".fade-up");
 if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:"0px 0px -24px 0px"});reveal.forEach(el=>observer.observe(el));}else reveal.forEach(el=>el.classList.add("visible"));
 const track=document.getElementById("projectCarousel");
 if(track){
  const slides=[...track.querySelectorAll("[data-slide]")],prev=document.getElementById("slidePrev"),next=document.getElementById("slideNext"),current=document.getElementById("slideCurrent"),total=document.getElementById("slideTotal"),dots=document.getElementById("carouselDots");
  let active=0,frame=0;if(total)total.textContent=String(slides.length).padStart(2,"0");
  if(dots)dots.innerHTML=slides.map((_,i)=>'<button type="button" aria-label="Go to project '+(i+1)+'" aria-current="'+(i===0?"true":"false")+'"></button>').join("");
  const dotButtons=dots?[...dots.querySelectorAll("button")]:[];
  const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const centre=track.getBoundingClientRect().left+track.clientWidth/2;let nearest=0,distance=Infinity;slides.forEach((slide,index)=>{const box=slide.getBoundingClientRect(),d=Math.abs(box.left+box.width/2-centre);if(d<distance){distance=d;nearest=index;}});active=nearest;if(current)current.textContent=String(active+1).padStart(2,"0");dotButtons.forEach((button,index)=>button.setAttribute("aria-current",index===active?"true":"false"));});};
  const goTo=index=>{const target=Math.max(0,Math.min(slides.length-1,index));slides[target]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"});};
  prev?.addEventListener("click",()=>goTo(active-1));next?.addEventListener("click",()=>goTo(active+1));dotButtons.forEach((button,index)=>button.addEventListener("click",()=>goTo(index)));
  track.addEventListener("scroll",update,{passive:true});track.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();goTo(active+1);}else if(e.key==="ArrowLeft"){e.preventDefault();goTo(active-1);}});
  window.addEventListener("resize",update,{passive:true});update();
 }
})();