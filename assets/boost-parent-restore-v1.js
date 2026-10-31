(function(){
'use strict';
if(window===window.top)return;
const allowed=new Set(['https://pinal.boostpathways.org','https://pinalworkforce1-del.github.io']);
const key='pinal_boost_career_exploration_v1';
function request(){window.parent.postMessage({type:'pinal-boost-module-restore-request',module:'module4'},'*')}
window.addEventListener('message',function(e){
 if(e.source!==window.parent||!allowed.has(e.origin)||e.data?.type!=='pinal-boost-module-restore'||e.data.module!=='module4')return;
 const payload=e.data.state;if(!payload||!Array.isArray(payload.module1?.selected)||!payload.module1.selected.length)return;
 try{
  const prior=JSON.parse(localStorage.getItem(key)||'{}')||{};
  const next={...prior,module1:{...(prior.module1||{}),...payload.module1},
    module2:{...(prior.module2||{}),...(payload.module2||{})},
    module3:{...(prior.module3||{}),...(payload.module3||{})},
    module4:{...(prior.module4||{}),...(payload.module4||{})}};
  const signature=JSON.stringify([next.module1,next.module2,next.module3,next.module4]);
  const marker='boost_parent_hydration_module4';
  if(sessionStorage.getItem(marker)===signature)return;
  localStorage.setItem(key,JSON.stringify(next));
  sessionStorage.setItem(marker,signature);
  location.reload();
 }catch(err){console.warn('BOOST module state restore unavailable',err)}
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',request,{once:true});else request();
})();