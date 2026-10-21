const fs=require('fs');
let js=fs.readFileSync('js/page.js','utf8');
js=js.replace('function show(index, announce = false) {\n      current', 'function show(index, announce = false) {\n      const previous = current;\n      const direction = index > previous ? 1 : -1;\n      current');
const marker="      dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));";
js=js.replace(marker,`      // Move only the incoming and outgoing frames; all other frames stay hidden.
      slides.forEach(slide => { slide.slideAnimation?.cancel(); });
      if (previous !== current && !reducedMotion?.matches && slides[current].animate) {
        const options = { duration: 650, easing: 'cubic-bezier(.22,.61,.36,1)' };
        slides[previous].slideAnimation = slides[previous].animate([
          { transform: 'translateX(0)', visibility: 'visible' },
          { transform: 'translateX(' + (-direction * 100) + '%)', visibility: 'visible' }
        ], options);
        slides[current].slideAnimation = slides[current].animate([
          { transform: 'translateX(' + (direction * 100) + '%)', visibility: 'visible' },
          { transform: 'translateX(0)', visibility: 'visible' }
        ], options);
      }
${marker}`);
fs.writeFileSync('js/page.js',js);
let css=fs.readFileSync('css/site.css','utf8');
css=css.replace('.slide{position:absolute;inset:0;margin:0;opacity:0;visibility:hidden;transition:opacity .7s,visibility .7s}.slide.active{opacity:1;visibility:visible;z-index:1}', '.slide{position:absolute;inset:0;margin:0;visibility:hidden;transform:translateX(100%);will-change:transform}.slide.active{visibility:visible;transform:translateX(0);z-index:1}');
fs.writeFileSync('css/site.css',css);
let build=fs.readFileSync('build-site.cjs','utf8').replace('css/site.css"','css/site.css?v=20261021-3"').replace('page.js?v=20261021-2','page.js?v=20261021-3');
fs.writeFileSync('build-site.cjs',build);
let tests=fs.readFileSync('verify-site.cjs','utf8');
tests=tests.replace("function element(){return {handlers:","function element(){return {animate(frames){this.animationFrames=frames;return {cancel(){}}},handlers:");
tests=tests.replace('assert.equal(active(),0);assert(tick);tick();assert.equal(active(),1);','assert.equal(active(),0);assert(tick);tick();assert.equal(active(),1);\nassert.equal(slides[1].animationFrames[0].transform,\'translateX(100%)\');\nassert.equal(slides[0].animationFrames[1].transform,\'translateX(-100%)\');');
tests=tests.replace('previous.handlers.click();assert.equal(active(),0);previous.handlers.click();assert.equal(active(),4);','previous.handlers.click();assert.equal(active(),0);\nassert.equal(slides[0].animationFrames[0].transform,\'translateX(-100%)\');\nassert.equal(slides[1].animationFrames[1].transform,\'translateX(100%)\');\nprevious.handlers.click();assert.equal(active(),4);');
fs.writeFileSync('verify-site.cjs',tests);
