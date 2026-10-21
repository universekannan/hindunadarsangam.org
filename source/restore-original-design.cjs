const fs=require('fs');
let build=fs.readFileSync('build-site.cjs','utf8');
const old="const write = (file,title,content)=>fs.writeFileSync(file,shell(title,content,file));";
const replacement=`const write = (file,title,content)=>{
 if(file==='index.html') {
   const start=original.indexOf('<section class="event-feature');
   const end=original.indexOf('<section class="footer-bottom');
   let restored=original.slice(start,end).replaceAll('<pstyle=', '<p style=');
   restored=restored.replace(/READ MORE/g, '<a href="history.html">READ MORE</a>');
   restored=restored.replace('class="full-width" alt="" src="img/causes/inv.jpg"','class="full-width" alt="Kamarajar Academy opening ceremony invitation" src="img/causes/inv.jpg"');
   content=content.slice(0,content.indexOf('<section class="section cream">'))+restored;
 }
 let html=shell(title,content,file);
 html=html.replace('<link rel="stylesheet" href="css/site.css?v=20261021-3">','<link rel="stylesheet" href="css/style.css"><link rel="stylesheet" href="css/responsive.css"><link rel="stylesheet" href="css/site.css?v=20261021-4"><link rel="stylesheet" href="css/original-design.css?v=20261021-4">');
 html=html.replace('page.js?v=20261021-3','page.js?v=20261021-4');
 const top=original.match(/<section class="top-bar">[\\s\\S]*?<\\/section>/)[0];
 html=html.replace(/<div class="topbar">[\\s\\S]*?<\\/div><\\/div>/,top);
 html=html.replace(/<footer>[\\s\\S]*?<\\/footer>/,'<footer class="footer-bottom"><div class="container text-center"><p>Website Developed By <a href="http://galaxy-ts.co/">Galaxy Technologies Solutions Pvt Ltd</a></p></div></footer>');
 fs.writeFileSync(file,html);
};`;
if(!build.includes(old))throw Error('Write template not found');
fs.writeFileSync('build-site.cjs',build.replace(old,replacement));
