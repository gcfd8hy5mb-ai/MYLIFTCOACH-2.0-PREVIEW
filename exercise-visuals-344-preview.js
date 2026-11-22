(()=>{'use strict';
const root='https://raw.githubusercontent.com/gcfd8hy5mb-ai/MYLIFTCOACH-2.0/ee61b73185cb76b5d02c77502f7a4737050b3d82/';
const placeholder=root+'assets/image-coming-approved.webp';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catalog=window.MLC2_EXERCISE_CATALOG, manifest=window.MLC2_APPROVED_VISUALS;
if(!Array.isArray(catalog)||!Array.isArray(manifest)){
 $('status').textContent='Unable to load the GitHub exercise catalog. Try reloading this page.';
 return;
}
const index=new Map(manifest.map(m=>[m.id,m]));
const ids=new Set(catalog.map(x=>x.id));
if(catalog.length!==344||ids.size!==344||manifest.length!==263||index.size!==263||manifest.some(x=>!ids.has(x.id))){
 $('status').textContent='Image counts or mappings did not match the approved 344-exercise release. Preview stopped for safety.';
 return;
}
const exercises=catalog.map(e=>({...e,visual:index.get(e.id)||null}));
let current='all', search='';
$('status').textContent='Showing the uploaded GitHub artwork. Tap any thumbnail to inspect it.';
const display=(e)=>e.visual?root+e.visual.thumbnail:placeholder;
function render(){
 const matches=exercises.filter(e=>(current==='all'||(current==='approved'&&e.visual)||(current==='coming'&&!e.visual))&& (e.name+' '+e.group).toLowerCase().includes(search));
 $('count').textContent=matches.length+' exercises shown';
 $('grid').innerHTML=matches.map(e=>'<button type="button" class="exercise" data-id="'+esc(e.id)+'"><span class="photo"><img loading="lazy" alt="'+esc(e.visual?'Approved '+e.name+' demonstration':e.name+' image coming')+'" src="'+esc(display(e))+'"><span class="chip">'+(e.visual?'APPROVED':'IMAGE COMING')+'</span></span><span class="exercise-info"><strong>'+esc(e.name)+'</strong><small>'+esc(e.group)+'</small></span></button>').join('')||'<p>No exercises match your search.</p>';
 $('grid').querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{
   img.replaceWith(Object.assign(document.createElement('span'),{className:'missing',textContent:'Image could not be loaded'}));
 },{once:true}));
}
$('search').addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();render()});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
 current=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();
}));
$('grid').addEventListener('click',e=>{
 const button=e.target.closest('[data-id]');if(!button)return;
 const item=exercises.find(x=>x.id===button.dataset.id);if(!item)return;
 $('viewer-title').textContent=item.name;
 $('viewer-note').textContent=item.visual?'Approved full-size demonstration':'Approved IMAGE COMING placeholder';
 $('viewer-img').src=item.visual?root+item.visual.image:placeholder;
 $('viewer-img').alt=item.name;
 $('viewer').hidden=false;
});
function close(){$('viewer').hidden=true;$('viewer-img').removeAttribute('src')}
$('close').addEventListener('click',close);
$('viewer').addEventListener('click',e=>{if(e.target===$('viewer'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
render();
})();