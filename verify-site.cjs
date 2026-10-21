const fs = require('fs');
const assert = require('assert/strict');
const vm = require('vm');
const pages = ['index','about','history','office-bearers','committee','gallery','events','contact'];
for (const page of pages) {
 const html = fs.readFileSync(`${page}.html`,'utf8');
 for (const match of html.matchAll(/(?:src|href|action)="([^"#]+)"/g)) {
   const path = match[1].split(/[?#]/)[0];
   if (!/^(https?:|tel:|mailto:)/.test(path)) assert(fs.existsSync(path),`${page}: missing ${path}`);
 }
 assert(html.includes('aria-current="page"'),`${page}: active navigation missing`);
 for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
   const bytes=fs.readFileSync(match[1]);
   assert((bytes[0]===255&&bytes[1]===216)||(bytes[0]===137&&bytes[1]===80),`${page}: invalid image ${match[1]}`);
 }
}
function element(){return {animate(frames){this.animationFrames=frames;return {cancel(){}}},handlers:{},attrs:{},textContent:'',dataset:{},classList:{state:new Set(),toggle(c,value){const v=value??!this.state.has(c);v?this.state.add(c):this.state.delete(c);return v;},contains(c){return this.state.has(c)},remove(c){this.state.delete(c)}},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,v){this.handlers[k]=v},focus(){}};}
const toggle=element(), navigation=element(), slider=element(), pause=element(), previous=element(), next=element(), status=element();
const slides=Array.from({length:5},element),dots=Array.from({length:5},element);
slider.querySelectorAll=s=>s==='.slide'?slides:dots;
slider.querySelector=s=>({'.pause':pause,'.prev':previous,'.next':next,'.slide-status':status}[s]);
slider.contains=value=>[pause,previous,next,...dots].includes(value);
const document=element();document.hidden=false;
document.querySelector=s=>({'.menu-toggle':toggle,'#navigation':navigation,'.slideshow':slider}[s]||null);
document.querySelectorAll=()=>[];
let tick=null;const motion=element();motion.matches=false;
vm.runInNewContext(fs.readFileSync('js/page.js','utf8'),{document,window:{matchMedia:()=>motion},setInterval:callback=>{tick=callback;return 1},clearInterval:()=>{tick=null}});
const active=()=>slides.findIndex(slide=>slide.classList.contains('active'));
assert.equal(active(),0);assert(tick);tick();assert.equal(active(),1);
assert.equal(slides[1].animationFrames[0].transform,'translateX(100%)');
assert.equal(slides[0].animationFrames[1].transform,'translateX(-100%)');
previous.handlers.click();assert.equal(active(),0);
assert.equal(slides[0].animationFrames[0].transform,'translateX(-100%)');
assert.equal(slides[1].animationFrames[1].transform,'translateX(100%)');
previous.handlers.click();assert.equal(active(),4);
next.handlers.click();assert.equal(active(),0);dots[3].handlers.click();assert.equal(active(),3);
slider.handlers.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(active(),4);
slider.handlers.touchstart({changedTouches:[{clientX:200,clientY:10}]});slider.handlers.touchend({changedTouches:[{clientX:70,clientY:20}]});assert.equal(active(),0);
pause.handlers.click();assert.equal(tick,null);assert.equal(pause.textContent,'Play');pause.handlers.click();assert(tick);
document.hidden=true;document.handlers.visibilitychange();assert.equal(tick,null);document.hidden=false;document.handlers.visibilitychange();assert(tick);
motion.handlers.change({matches:true});assert.equal(tick,null);
toggle.handlers.click();assert.equal(toggle.attrs['aria-expanded'],'true');document.handlers.keydown({key:'Escape'});assert.equal(toggle.attrs['aria-expanded'],'false');
const filters=[element(),element()];filters[0].dataset.filter='all';filters[1].dataset.filter='community';
const photos=[element(),element()];photos[0].dataset={category:'community',image:'img/slides/1.jpg'};photos[1].dataset={category:'invitation',image:'img/causes/inv.jpg'};
photos.forEach(photo=>photo.querySelector=()=>({alt:'Photograph'}));
const dialog=element(), image=element(), caption=element(), close=element(), count=element();
dialog.querySelector=s=>({'img':image,'p':caption,'.lightbox-close':close}[s]);dialog.showModal=()=>dialog.open=true;dialog.close=()=>dialog.open=false;
const galleryDocument=element();galleryDocument.querySelector=s=>({'.menu-toggle':toggle,'#navigation':navigation,'.lightbox':dialog,'.gallery-count':count}[s]||null);galleryDocument.querySelectorAll=s=>s==='.photo'?photos:s==='.filter-button'?filters:[];
vm.runInNewContext(fs.readFileSync('js/page.js','utf8'),{document:galleryDocument});
filters[1].handlers.click();assert.equal(photos[0].hidden,false);assert.equal(photos[1].hidden,true);assert.equal(count.textContent,'1 photographs');
filters[0].handlers.click();assert(photos.every(photo=>!photo.hidden));photos[0].handlers.click();assert(dialog.open);assert.equal(image.src,'img/slides/1.jpg');close.handlers.click();assert.equal(dialog.open,false);
console.log('PASS: eight pages, local links and image signatures; slideshow autoplay, wraparound, arrows, dots, keyboard, swipe, pause, visibility, reduced motion; mobile menu; gallery filters and photo dialog; shared script on pages without slideshow.');
