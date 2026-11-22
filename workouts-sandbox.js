'use strict';
(function(){
 const $=id=>document.getElementById(id);
 const days=['MON','TUE','WED','THU','FRI','SAT','SUN'];
 const state={
   routines:[
     {id:'custom-upper',name:'Upper Body Strength',exercises:['Chest Press','Lat Pulldown','Seated Row','Shoulder Press','Biceps Curl','Triceps Pushdown'],sets:3,custom:true},
     {id:'custom-lower',name:'Lower Body Day',exercises:['Leg Press','Leg Curl','Leg Extension','Calf Raise','Hip Abduction'],sets:3,custom:true},
     {id:'preset-full',name:'Full Body Foundation',exercises:['Squat','Chest Press','Lat Pulldown'],sets:3,custom:false}
   ],
   selected:'custom-upper',schedule:['custom-upper','custom-lower',null,'custom-upper','custom-lower',null,null],
   session:null,editing:null,completed:0,seed:0
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const find=id=>state.routines.find(r=>r.id===id);
 const todayDay=()=> (new Date().getDay()+6)%7;
 const todayId=()=> state.selected || state.schedule[todayDay()];
 const show=id=>{
   document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===id;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});
   document.querySelectorAll('.panelview').forEach(p=>p.hidden=p.id!=='panel-'+id);
   $('feedback').textContent='';
 };
 const notify=text=>{$('feedback').textContent=text};
 const btn=(action,label,id,cls='secondary')=>'<button type="button" class="'+cls+'" data-action="'+action+'" data-id="'+esc(id||'')+'">'+esc(label)+'</button>';
 function renderToday(){
   const r=find(todayId());
   const markup=r?'<article class="card hero"><p class="eyebrow">TODAY\'S WORKOUT</p><h2>'+esc(r.name)+'</h2><p>'+r.exercises.length+' exercises · '+r.exercises.length*r.sets+' sets</p><p class="gold-note">'+(state.selected?'Selected routine takes priority over schedule':'Weekly schedule selection')+'</p><div class="buttons">'+btn('start','Start Workout',r.id,'primary')+btn('change','Change Workout',r.id)+'</div></article>':
   '<article class="card"><h2>Rest day</h2><p>No workout is selected for today.</p>'+btn('change','Choose workout')+'</article>';
   $('today-content').innerHTML=markup+'<p class="subnote">Custom workout selection takes priority over scheduled presets.</p>';
   renderSession();
 }
 function renderSession(){
   const s=state.session;
   if(!s){$('active-session').innerHTML=state.completed?'<article class="card"><p class="gold-note">Sandbox workouts completed: '+state.completed+'</p></article>':'';return}
   const exerciseRows=s.exercises.map((name,index)=>'<label class="set-check"><input type="checkbox" data-set="'+index+'" '+(s.checked[index]?'checked':'')+'><span>'+esc(name)+' — '+s.sets+' sets</span></label>').join('');
   $('active-session').innerHTML='<article class="card"><p class="eyebrow">ACTIVE SESSION</p><h2>'+esc(s.name)+'</h2><p>Check exercises as you complete them.</p><div class="set-list">'+exerciseRows+'</div><p class="gold-note">'+s.checked.filter(Boolean).length+' / '+s.exercises.length+' exercises done</p><div class="buttons">'+btn('finish','Complete session',s.id,'primary')+btn('discard','Discard test session',s.id)+'</div></article>';
 }
 function renderRoutines(){
   $('routine-content').innerHTML=state.routines.map(r=>'<article class="card routine"><span class="eyebrow">'+(r.custom?'CUSTOM WORKOUT':'PRESET WORKOUT')+'</span><h3>'+esc(r.name)+'</h3><p>'+r.exercises.length+' exercises · '+r.exercises.length*r.sets+' sets</p>'+(state.selected===r.id?'<span class="selected">Selected</span>':'')+'<div class="buttons">'+btn('select','Use for Today',r.id,state.selected===r.id?'primary':'secondary')+btn('start','Start',r.id,'secondary')+(r.custom?btn('edit','Edit',r.id)+btn('delete','Delete',r.id):'')+'</div></article>').join('')+
   '<div class="buttons">'+btn('clear-selection','Use weekly schedule instead',null)+'</div>';
 }
 function renderSchedule(){
   $('schedule-content').innerHTML=days.map((day,i)=>'<label class="schedule-row"><span>'+day+'</span><select data-day="'+i+'" aria-label="'+day+' workout"><option value="">Rest day</option>'+state.routines.map(r=>'<option value="'+esc(r.id)+'"'+(state.schedule[i]===r.id?' selected':'')+'>'+esc(r.name)+'</option>').join('')+'</select></label>').join('');
 }
 function render(){renderToday();renderRoutines();renderSchedule()}
 function edit(id){
   const r=find(id);state.editing=r?.custom?r.id:null;
   $('editor-heading').textContent=r?'Edit custom workout':'Create custom workout';
   $('routine-name').value=r?.name||'';
   $('routine-exercises').value=r?.exercises.join('\n')||'';
   $('routine-sets').value=r?.sets||3;
   $('routine-editor').hidden=false;
   show('routines');$('routine-name').focus();
 }
 function start(id){
   const r=find(id);if(!r)return;
   state.session={id:r.id,name:r.name,sets:r.sets,exercises:[...r.exercises],checked:r.exercises.map(()=>false)};
   show('today');renderToday();notify('Sandbox session started. No account data changed.');
 }
 document.addEventListener('click',e=>{
   const tab=e.target.closest('[data-tab]');if(tab){show(tab.dataset.tab);return}
   const el=e.target.closest('[data-action]');if(!el)return;
   const action=el.dataset.action,id=el.dataset.id;
   if(action==='change'){show('routines');return}
   if(action==='create'){edit(null);return}
   if(action==='cancel-edit'){$('routine-editor').hidden=true;state.editing=null;return}
   if(action==='edit'){edit(id);return}
   if(action==='start'){start(id);return}
   if(action==='select'){state.selected=id;render();notify('Selected custom workout for Today.');return}
   if(action==='clear-selection'){state.selected=null;render();notify('Today now follows the weekly schedule.');return}
   if(action==='delete'){
     const r=find(id);if(!r?.custom)return;
     state.routines=state.routines.filter(r=>r.id!==id);
     state.schedule=state.schedule.map(s=>s===id?null:s);
     if(state.selected===id)state.selected=null;
     if(state.editing===id){state.editing=null;$('routine-editor').hidden=true}
     render();notify('Test workout deleted from sandbox only.');return;
   }
   if(action==='discard'){state.session=null;renderToday();notify('Test session discarded.');return}
   if(action==='finish'){
     if(!state.session)return;
     state.completed++;state.session=null;renderToday();notify('Test workout completed. No cloud or account data was changed.');
   }
 });
 $('routine-editor').addEventListener('submit',e=>{
   e.preventDefault();
   const name=$('routine-name').value.trim(),raw=$('routine-exercises').value;
   const exercises=raw.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
   const sets=Number($('routine-sets').value);
   if(!name||exercises.length===0||exercises.length>30||exercises.some(v=>v.length>90)||!Number.isInteger(sets)||sets<1||sets>10){notify('Enter a name, 1–30 exercises, and 1–10 sets per exercise.');return}
   const id=state.editing||'custom-demo-'+(++state.seed);
   const item={id,name,exercises,sets,custom:true};
   const index=state.routines.findIndex(r=>r.id===id);
   if(index>=0)state.routines[index]=item;else state.routines.push(item);
   state.selected=id;state.editing=null;$('routine-editor').hidden=true;
   render();show('routines');notify('Test workout saved in this page only; refresh resets it.');
 });
 $('schedule-content').addEventListener('change',e=>{
   const field=e.target.closest('[data-day]');if(!field)return;
   const day=Number(field.dataset.day);
   if(day<0||day>6)return;
   state.schedule[day]=find(field.value)?field.value:null;renderToday();
   notify(days[day]+' test schedule updated.');
 });
 $('active-session').addEventListener('change',e=>{
   const checkbox=e.target.closest('[data-set]');
   if(!checkbox||!state.session)return;
   const i=Number(checkbox.dataset.set);
   if(i>=0&&i<state.session.checked.length){state.session.checked[i]=checkbox.checked;renderSession()}
 });
 document.querySelector('.tabs').addEventListener('keydown',e=>{
   if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();
   const buttons=[...document.querySelectorAll('[data-tab]')],index=buttons.findIndex(b=>b.getAttribute('aria-selected')==='true');
   const next=e.key==='Home'?0:e.key==='End'?2:(index+(e.key==='ArrowRight'?1:2))%3;
   show(buttons[next].dataset.tab);buttons[next].focus();
 });
 render();
})();
