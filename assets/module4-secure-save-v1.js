(function(){
'use strict';
if(window===window.top)return;
const allowed=new Set(['https://pinal.boostpathways.org','https://pinalworkforce1-del.github.io']);
const key='pinal_boost_career_exploration_v1';
const receiptKey='pinal_boost_module4_verified_receipt_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')||{}}catch(_){return{}}};
const signature=m=>JSON.stringify([String(m.selectedSoc||''),String(m.route||''),m.answers||{}]);
function status(message,isError){
 const note=document.getElementById('completionNote');
 if(note){note.textContent=message;note.style.color=isError?'#962e25':'#156249'}
}
window.addEventListener('message',function(event){
 if(event.source!==window.parent||!allowed.has(event.origin))return;
 const type=event.data?.type||'';
 if(type==='pinal-boost-module4-collect'){
  const requestId=event.data.requestId;
  if(typeof requestId!=='string'||requestId.length>120)return;
  const data=read().module4||{};
  const live=window.BOOST_MODULE4||{};
  const complete=document.getElementById('result')?.classList.contains('show')===true;
  const soc=String(data.selectedSoc||data.career?.soc||'');
  const route=String(data.route||'').toUpperCase();
  const answers=data.answers||{};
  const valid=complete&&soc&&data.careerTitle&&['READY','BRIDGE','BUILD','RECONSIDER'].includes(route)
   &&Object.keys(answers).length>=5
   &&String(live.career?.soc||'')===soc&&String(live.route||'').toUpperCase()===route;
  if(!valid){
   window.parent.postMessage({type:'pinal-boost-module4-current',requestId,error:'Decision evidence is not complete or does not match the displayed result.'},event.origin);
   return;
  }
  const evidence={...data,source:'pinal_module4_verified_handoff',completionReady:true,
   completedAt:data.completedAt||new Date().toISOString()};
  window.parent.postMessage({type:'pinal-boost-module4-current',requestId,module4:evidence},event.origin);
 }else if(type==='pinal-boost-module4-save-status'){
  if(event.data.status==='saving')status('Saving and verifying your Career Decision with BOOST…',false);
  if(event.data.status==='error')status(event.data.message||'Cloud save was not confirmed. Keep this page open and try again.',true);
  if(event.data.status==='saved'){
   const current=read().module4||{};
   if(current.selectedSoc&&current.route&&Object.keys(current.answers||{}).length>=5){
    localStorage.setItem(receiptKey,signature(current));
    const open=document.getElementById('openReport');
    if(open)open.disabled=false;
   }
   status('Module 4 is saved to your BOOST account. Your Career Decision Report is available.',false);
  }
 }
});
window.BOOST_MODULE4_RECEIPT={valid:()=>{
 const m=read().module4||{};
 if(!m.selectedSoc||!m.route||Object.keys(m.answers||{}).length<5)return false;
 if(m.verifiedByPortal===true&&m.completedAt)return true;
 return localStorage.getItem(receiptKey)===signature(m);
}};
})();