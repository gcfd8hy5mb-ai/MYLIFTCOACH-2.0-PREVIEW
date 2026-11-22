(()=>{'use strict';
const $=id=>document.getElementById(id);
const catalog=window.MLC2_EXERCISE_CATALOG, manifest=window.MLC2_APPROVED_VISUALS;
const root='https://raw.githubusercontent.com/gcfd8hy5mb-ai/MYLIFTCOACH-2.0/ee61b73185cb76b5d02c77502f7a4737050b3d82/';
const placeholder=root+'assets/image-coming-approved.webp';
if(!Array.isArray(catalog)||catalog.length!==344||!Array.isArray(manifest)||manifest.length!==263){$('progress').textContent='Exercise metadata unavailable. Refresh to try again.';return;}
const byId=new Map(catalog.map(e=>[e.id,e])), images=new Map(manifest.map(e=>[e.id,e]));
const choices=['machine-chest-press','pec-deck','triceps-pushdown','lat-pulldown','seated-row','preacher-curl','leg-press','shoulder-press','db-bench-press'].filter(id=>byId.has(id));
if(choices.length<2){choices.splice(0,choices.length,...catalog.slice(0,8).map(x=>x.id));}
const select=$('exercise');select.replaceChildren();
choices.forEach(id=>{const opt=document.createElement('option');opt.value=id;opt.textContent=byId.get(id).name;select.appendChild(opt)});
let count=0,id=choices[0];
function applyImage(node,url,isPlaceholder){node.src=url;node.classList.toggle('placeholder',isPlaceholder)}
function items(target,arr){const node=$(target);node.replaceChildren();const entries=Array.isArray(arr)&&arr.length?arr:['No additional notes provided for this exercise.'];entries.forEach(t=>{const li=document.createElement('li');li.textContent=t;node.appendChild(li)})}
function update(){
 id=select.value;const e=byId.get(id);if(!e)return;const v=images.get(id);
 const src=v?root+v.thumbnail:placeholder;
 applyImage($('thumb'),src,!v);applyImage($('quickImage'),src,!v);
 $('name').textContent=e.name;$('group').textContent=e.group+' · '+(e.equipment||'Exercise');
 $('sets').textContent=e.sets||3;$('reps').textContent=e.reps||'8–12';
 $('position').textContent=(choices.indexOf(id)+1)+' of '+choices.length;
 $('quickHow').textContent=e.how||e.cue||'Instructions are not available.';
 $('quickMuscles').textContent=e.muscle||e.group;
 $('quickTip').textContent=(e.tips&&e.tips[0])||e.cue||'Use controlled movement.';
 $('guideTitle').textContent=e.name;
 $('guideMeta').textContent=e.group+' · '+(e.equipment||'Exercise');
 $('how').textContent=e.how||e.cue||'Instructions are not available.';
 $('muscles').textContent='Primary area: '+(e.muscle||e.group);
 $('equipment').textContent='Equipment: '+(e.equipment||'Not specified');
 items('tips',e.tips);items('mistakes',e.mistakes);
 applyImage($('fullImage'),v?root+v.image:placeholder,!v);
 $('demoCaption').textContent=v?'Approved complete demonstration showing both positions':'Approved IMAGE COMING dumbbell placeholder';
 count=0;$('progress').textContent='0 practice sets logged';
}
select.addEventListener('change',update);
$('expand').addEventListener('click',()=>{const open=$('quick').hidden;$('quick').hidden=!open;$('expand').setAttribute('aria-expanded',String(open));$('arrow').textContent=open?'⌃':'⌄'});
$('log').addEventListener('click',()=>{const weight=Number($('weight').value),reps=Number($('repsInput').value);if(!Number.isFinite(weight)||weight<0||!Number.isInteger(reps)||reps<1||reps>100){$('progress').textContent='Enter a valid weight and repetitions.';return;}count++;$('progress').textContent=count+' practice set'+(count===1?'':'s')+' logged · '+weight+' lb × '+reps+' reps (not saved)'});
function open(){ $('overlay').hidden=false;document.body.style.overflow='hidden';$('back').focus() }
function close(){ $('overlay').hidden=true;document.body.style.overflow='' ;$('full').focus()}
$('full').addEventListener('click',open);$('back').addEventListener('click',close);$('return').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('overlay').hidden)close()});
update();
})();