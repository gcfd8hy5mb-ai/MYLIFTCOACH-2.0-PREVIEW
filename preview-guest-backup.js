/* Preview-only guest backup. Never reads auth/account tokens or network.
   Gives iPhone Safari an explicit way to recover test data if its site storage
   is cleared, without touching original or production MYLIFTCOACH records. */
(()=>{
'use strict';
if(!location.pathname.includes('/integrated-workout/'))return;
const KEYS=['mlc2-demo-workouts-v1','mlc2-custom-plans-v1','mlc2-selected-workout-v1','mlc2-weekly-schedule-v1'];
const STORE=window.localStorage;
const parse=(s,fallback)=>{try{return JSON.parse(s)}catch{return fallback}};
const fileStamp=()=>new Date().toISOString().slice(0,10);
function init(){
 const banner=document.getElementById('mlc-preview-persistence');
 if(!banner)return;
 const btn=label=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='padding:8px 10px;border-radius:10px;border:1px solid #c9a670;background:#04252d;color:#f2d498;font:700 12px system-ui;min-height:36px';return b};
 const note=document.createElement('div');
 note.textContent='For repeat testing, open this URL directly in Safari (not the ChatGPT in-app viewer). Demo data stays only in that browser; cloud sync is disabled.';
 note.style.cssText='font:500 12px/1.5 system-ui;color:#f5dfb5;max-width:660px;margin:auto';
 const bar=document.createElement('div');bar.style.cssText='display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin:8px 0 0';
 const exportButton=btn('Save demo backup');
 const importButton=btn('Restore demo backup');
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.hidden=true;
 const state=document.createElement('p');state.setAttribute('role','status');state.style.cssText='margin:6px 0 0;font:500 11px system-ui;color:#e1eade';
 function status(msg){state.textContent=msg}
 function getGuest(){
  const sessions=parse(STORE.getItem(KEYS[0])||'[]',[]);
  return Array.isArray(sessions)?sessions.filter(e=>e&&typeof e.id==='string'&&!e.ownerId&&Array.isArray(e.sets)):[];
 }
 exportButton.addEventListener('click',()=>{
  try{
   const payload={format:'myliftcoach-preview-guest-v1',created:new Date().toISOString(),keys:{}};
   payload.keys[KEYS[0]]=JSON.stringify(getGuest());
   for(const key of KEYS.slice(1)){const value=STORE.getItem(key);if(value!==null)payload.keys[key]=value}
   const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);
   const a=document.createElement('a');a.href=url;a.download='MYLIFTCOACH-demo-backup-'+fileStamp()+'.json';document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),2000);
   status('Backup created. Keep it in Files on your iPhone for restore if preview storage resets.');
  }catch(err){status('Unable to export demo data: '+String(err.message||err).slice(0,110))}
 });
 importButton.addEventListener('click',()=>input.click());
 input.addEventListener('change',async()=>{
  const file=input.files?.[0];input.value='';
  if(!file)return;
  try{
   if(file.size>2_500_000)throw Error('Backup too large');
   const payload=JSON.parse(await file.text());
   if(payload?.format!=='myliftcoach-preview-guest-v1'||!payload.keys||typeof payload.keys!=='object')throw Error('Not a MYLIFTCOACH demo backup');
   const incoming=parse(payload.keys[KEYS[0]]||'[]',null);
   if(!Array.isArray(incoming)||incoming.length>500||incoming.some(e=>!e||typeof e.id!=='string'||e.ownerId||!Array.isArray(e.sets)||e.sets.length>250))throw Error('Invalid guest workout data');
   const prior=getGuest(),priorIds=new Set(prior.map(e=>e.id));
   const unique=incoming.filter(e=>!priorIds.has(e.id));const combined=[...prior,...unique];
   if(combined.length>500)throw Error('Combined history exceeds guest limit');
   // Validate using the actual guest-store parser; never overwrite signed-in records.
   const accountStore=window.MLC2AccountWorkouts;
   if(!accountStore)throw Error('Guest workout module unavailable');
   accountStore.read({getItem:()=>JSON.stringify(combined)},null);
   if(!confirm('Restore '+unique.length+' missing demo workouts? Existing sessions are preserved. Reload to show restored progress.'))return;
   accountStore.save(STORE,null,combined);
   let additional=0;
   for(const key of KEYS.slice(1)){
    const value=payload.keys[key];
    if(typeof value==='string'&&value.length<150_000&&STORE.getItem(key)===null){STORE.setItem(key,value);additional++}
   }
   status('Restored '+unique.length+' guest workouts and '+additional+' missing demo settings. Reloading…');
   location.reload();
  }catch(err){status('Backup not restored: '+String(err.message||err).slice(0,125))}
 });
 bar.append(exportButton,importButton,input);banner.append(note,bar,state);
 const count=document.createElement('div');count.style.cssText='font:500 11px system-ui;color:#f3dcaa;margin-top:6px';
 try{count.textContent='Saved guest workouts in this browser: '+getGuest().length}catch{count.textContent='Browser storage unavailable'}
 banner.append(count);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
