'use strict';(function(){
 const exercises=[
 {id:'machine-chest-press',name:'Machine Chest Press',muscle:'Chest',how:'Adjust the seat so the handles align with the middle of your chest. Keep your back on the pad, press forward smoothly, then return under control.'},
 {id:'pec-deck',name:'Pec Deck',muscle:'Chest',how:'Keep your back against the seat. Bring the handles together without shrugging, and return slowly.'},
 {id:'triceps-pushdown',name:'Triceps Pushdown',muscle:'Arms',how:'Keep elbows near your sides. Press the cable attachment down and return without swinging.'},
 {id:'lat-pulldown',name:'Lat Pulldown',muscle:'Back',how:'Anchor your thighs and bring the bar toward your upper chest. Return slowly without throwing your torso back.'},
 {id:'seated-row',name:'Seated Row',muscle:'Back',how:'Keep your torso stable, pull the handle toward your midsection, and extend your arms with control.'},
 {id:'shoulder-press',name:'Shoulder Press',muscle:'Shoulders',how:'Keep your back supported and press overhead along a comfortable path. Lower slowly.'},
 {id:'leg-press',name:'Leg Press',muscle:'Legs',how:'Keep your back against the pad. Press through your feet without locking knees; lower to a controlled depth.'},
 {id:'leg-extension',name:'Leg Extension',muscle:'Legs',how:'Align knees with the machine pivot. Straighten your legs without kicking, then lower gently.'},
 {id:'seated-leg-curl',name:'Seated Leg Curl',muscle:'Legs',how:'Adjust the thigh and ankle pads. Curl your lower legs down without lifting your hips.'},
 {id:'calf-raise',name:'Calf Raise',muscle:'Legs',how:'Press through the balls of your feet to raise your heels. Pause briefly and lower with control.'},
 {id:'biceps-curl',name:'Biceps Curl',muscle:'Arms',how:'Keep upper arms near your sides. Curl without swinging your shoulders or torso.'},
 {id:'preacher-curl',name:'Preacher Curl',muscle:'Arms',how:'Support your upper arms on the pad. Curl smoothly and avoid locking elbows at the bottom.'},
 {id:'lateral-raise',name:'Lateral Raise',muscle:'Shoulders',how:'Raise arms outward with a soft elbow bend, then lower without swinging.'},
 {id:'triceps-extension',name:'Triceps Extension',muscle:'Arms',how:'Keep your upper arms steady as elbows extend. Return gradually within a comfortable range.'}
 ];
 const list=document.getElementById('exercise-list'),search=document.getElementById('exercise-search'),filters=document.getElementById('exercise-filters'),count=document.getElementById('photo-count');
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let group='All';
 function update(){
  const q=search.value.toLowerCase().trim();
  const matches=exercises.filter(x=>(group==='All'||x.muscle===group)&&(!q||(x.name+' '+x.muscle).toLowerCase().includes(q)));
  filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.group===group)));
  list.innerHTML=matches.map(x=>'<article class="card exercise-photo-card"><img loading="lazy" src="./images/'+esc(x.id)+'.png" alt="'+esc(x.name)+' exercise photograph"><div class="photo-info"><span class="eyebrow">'+esc(x.muscle)+'</span><h2>'+esc(x.name)+'</h2><details><summary>See image & technique notes</summary><p>'+esc(x.how)+'</p><p class="small-notice">Reference image only. Follow machine instructions and use controlled movement.</p></details></div></article>').join('')||'<p class="empty">No exercises match this search.</p>';
  count.textContent=matches.length+' of '+exercises.length+' available photos';
 }
 filters.innerHTML=['All','Chest','Back','Shoulders','Legs','Arms'].map(g=>'<button type="button" data-group="'+g+'" aria-pressed="'+String(g==='All')+'">'+g+'</button>').join('');
 filters.addEventListener('click',e=>{const b=e.target.closest('[data-group]');if(!b)return;group=b.dataset.group;update()});
 search.addEventListener('input',update);update();
})();