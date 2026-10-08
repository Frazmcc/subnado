'use strict';
// This module enhances the link-only prototype with an actionable signup checklist.
// Statuses are USER-REPORTED; no publisher subscription is asserted automatically.
(() => {
  const KEY='subnado-progress-v1';
  let progress={};
  try { const parsed=JSON.parse(localStorage.getItem(KEY)||'{}'); if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))progress=parsed; } catch {}
  const results=document.getElementById('results');
  const links=document.getElementById('links');
  const state=document.createElement('section');
  state.id='tracker';
  state.setAttribute('aria-label','Signup progress');
  state.innerHTML='<h3>Signup checklist</h3><p class="muted">Open each publisher page, complete its form, then record the outcome below. Statuses are recorded by you, not verified by Subnado. Your selections stay in this browser only.</p><p id="tracker-summary" aria-live="polite"></p><div id="tracker-entries"></div><div class="actions" style="margin-top:16px;flex-wrap:wrap"><button type="button" class="secondary" id="export-progress">Export CSV</button><button type="button" class="secondary" id="reset-progress">Clear progress</button></div>';
  results.append(state);
  function save(){try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{}}
  function draw(){
    const chosen=new Set([...document.querySelectorAll('.newsletter:checked')].map(el=>el.value));
    const entries=rawNewsletters.filter(x=>chosen.has(x.id));
    const view=document.getElementById('tracker-entries');view.replaceChildren();
    const counts={not_started:0,opened:0,pending:0,confirmed:0,failed:0};
    for(const entry of entries){
      const status=progress[entry.id]||'not_started';counts[status]=(counts[status]||0)+1;
      const row=document.createElement('div');row.className='result';
      const name=document.createElement('strong');name.textContent=entry.name;
      const select=document.createElement('select');select.setAttribute('aria-label','Status for '+entry.name);
      select.style.cssText='background:#0a1430;color:white;border:1px solid #5375a9;border-radius:10px;padding:10px;max-width:100%';
      const options=[['not_started','Not started'],['opened','Signup page opened'],['pending','Awaiting confirmation'],['confirmed','Confirmed by me'],['failed','Could not subscribe']];
      for(const [value,label] of options){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}
      select.value=status;select.addEventListener('change',()=>{progress[entry.id]=select.value;save();draw();});
      row.append(name,select);view.append(row);
    }
    document.getElementById('tracker-summary').textContent=counts.confirmed+' marked confirmed · '+counts.pending+' awaiting email confirmation · '+counts.opened+' opened · '+counts.failed+' unsuccessful · '+counts.not_started+' not started';
  }
  document.getElementById('go').addEventListener('click',()=>{if(!results.hidden)draw();});
  links.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link)return;
    const entry=rawNewsletters.find(x=>x.url===link.href);
    if(entry&&(!progress[entry.id]||progress[entry.id]==='not_started')){progress[entry.id]='opened';save();draw();}
  });
  document.getElementById('export-progress').addEventListener('click',()=>{
    const quote=s=>'"'+String(s).replaceAll('"','""')+'"';
    const csv=['Newsletter,Signup URL,Reported status',...rawNewsletters.map(x=>[x.name,x.url,progress[x.id]||'not_started'].map(quote).join(','))].join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='subnado-progress.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  document.getElementById('reset-progress').addEventListener('click',()=>{
    if(!confirm('Clear all locally saved newsletter progress?'))return;
    progress={};save();draw();
  });
})();