(()=>{
 const audit=document.getElementById('view-audit'),data=document.getElementById('view-data');
 const buttons=[...document.querySelectorAll('[data-view]')];
 function setView(view,scroll=true){
  const isData=view==='data';audit.hidden=isData;data.hidden=!isData;
  buttons.forEach(b=>{if(b.closest('.view-switch'))b.setAttribute('aria-pressed',String(b.dataset.view===view));});
  if(scroll)document.querySelector('.view-switch').scrollIntoView({block:'start',behavior:'instant'});
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{setView(b.dataset.view);history.replaceState(null,'',b.dataset.view==='data'?'#analytics-overview':'#overview');}));
 addEventListener('hashchange',()=>{setView(location.hash==='#analytics-overview'?'data':'audit',false);});
 if(location.hash==='#analytics-overview')setView('data',false);
 document.getElementById('search-results').addEventListener('click',e=>{let a=e.target.closest('a');if(a)setView(a.hash==='#analytics-overview'?'data':'audit',false);});
})();
