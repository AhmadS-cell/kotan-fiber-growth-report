const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const normalize=s=>s.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/[\u064B-\u065F]/g,'');
const dialog=$('#image-dialog');let previousFocus;
$$('[data-image]').forEach(button=>button.addEventListener('click',()=>{previousFocus=document.activeElement;$('#image-full').src=button.dataset.image;$('#image-full').alt=button.dataset.caption;$('#image-title').textContent=button.dataset.caption;$('#image-original').href=button.dataset.image;dialog.showModal();dialog.scrollTop=0;}));
$('#image-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>previousFocus?.focus());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
function closeNav(){document.body.classList.remove('nav-open');$('#nav-toggle').setAttribute('aria-expanded','false');}
$('#nav-toggle').addEventListener('click',()=>{const open=document.body.classList.toggle('nav-open');$('#nav-toggle').setAttribute('aria-expanded',String(open));});
$('#sidebar').addEventListener('click',event=>{if(event.target.closest('a'))closeNav();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeNav();});
const sections=$$('main section[data-title]'),findings=$$('.finding');let activeFilter='all';
function filterFindings(){const query=normalize($('#finding-search').value.trim());let count=0;findings.forEach(f=>{const show=(activeFilter==='all'||f.dataset.priority===activeFilter)&&normalize(f.textContent).includes(query);f.hidden=!show;if(show)count++;});$('#finding-count').textContent=count+' ملاحظة';$('#no-findings').hidden=count!==0;}
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterFindings();}));
$('#finding-search').addEventListener('input',filterFindings);filterFindings();
function revealHash(){const el=document.getElementById(location.hash.slice(1));if(el?.classList.contains('finding')){activeFilter='all';$('#finding-search').value='';$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));filterFindings();requestAnimationFrame(()=>el.scrollIntoView({block:'start',behavior:'instant'}));}}
addEventListener('hashchange',revealHash);revealHash();
const initialHash=location.hash;let userMoved=false;
['wheel','touchstart','keydown'].forEach(type=>addEventListener(type,()=>{userMoved=true;},{once:true,passive:true}));
if(initialHash)Promise.all([document.fonts.ready,new Promise(resolve=>{if(document.readyState==='complete')resolve();else addEventListener('load',resolve,{once:true});})]).then(()=>{if(!userMoved&&location.hash===initialHash){const el=document.getElementById(initialHash.slice(1));if(el)requestAnimationFrame(()=>el.scrollIntoView({block:'start',behavior:'instant'}));}});
let scheduled=false;
function markSection(){scheduled=false;let current=sections[0];for(const s of sections){if(s.closest('[hidden]'))continue;if(s.getBoundingClientRect().top<=180)current=s;else break;}$$('#sidebar nav a').forEach(a=>{const active=a.hash==='#'+current.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(markSection);}},{passive:true});markSection();
const searchable=[...sections.map(s=>({id:s.id,title:s.dataset.title,text:normalize(s.textContent)})),...findings.map(f=>({id:f.id,title:'ملاحظة '+f.dataset.number+' · '+f.querySelector('h3').textContent,text:normalize(f.textContent)}))];
$('#search').addEventListener('input',()=>{const q=normalize($('#search').value.trim()),results=$('#search-results');results.replaceChildren();if(!q)return;const matches=searchable.filter(x=>x.text.includes(q)).slice(0,12);const count=document.createElement('p');count.textContent=matches.length?'نتائج البحث':'لا توجد نتائج بهذا البحث';results.append(count);matches.forEach(item=>{const a=document.createElement('a');a.href='#'+item.id;a.textContent=item.title;results.append(a);});});
const tasks=$$('[data-task]'),taskKey='website-audit-report:'+document.body.dataset.reportId+':tasks';let checked={};
try{const saved=JSON.parse(localStorage.getItem(taskKey)||'{}');if(saved&&typeof saved==='object')checked=saved;}catch{}
function updateTasks(save=true){tasks.forEach(t=>{t.checked=!!checked[t.dataset.task];t.closest('label').classList.toggle('done',t.checked);});$('#task-progress').textContent=tasks.filter(t=>t.checked).length+' من '+tasks.length+' بندًا عليه علامة';if(save){try{localStorage.setItem(taskKey,JSON.stringify(checked));}catch{}}}
tasks.forEach(t=>t.addEventListener('change',()=>{checked[t.dataset.task]=t.checked;updateTasks();}));updateTasks(false);
$('#reset-tasks').addEventListener('click',()=>{checked={};updateTasks();});
let printState=[],hiddenBefore=[];
addEventListener('beforeprint',()=>{printState=$$('details').map(d=>[d,d.open]);printState.forEach(([d])=>d.open=true);hiddenBefore=findings.filter(f=>f.hidden);hiddenBefore.forEach(f=>f.hidden=false);});
addEventListener('afterprint',()=>{printState.forEach(([d,o])=>d.open=o);hiddenBefore.forEach(f=>f.hidden=true);});
$('#print').addEventListener('click',()=>window.print());
