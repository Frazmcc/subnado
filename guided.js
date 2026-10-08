'use strict';
// Guided one-at-a-time publisher signups. Subnado never submits email addresses itself.
(() => {
  const KEY='subnado-progress-v1';
  const pick=()=>newsletters.filter(n=>document.querySelector('.newsletter[value="'+n.id+'"]')?.checked);
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{return {};}};
  const panel=document.createElement('section');
  panel.id='guided-flow';panel.className='results';panel.hidden=true;
  panel.innerHTML='<h3>Guided signup</h3><p class="muted">Work through your selected publishers one at a time. Use Copy address to paste your email on each official signup page. Subnado cannot submit registrations or verify confirmation emails for you.</p><p id="guided-count" aria-live="polite"></p><div id="guided-details"></div><div class="actions" style="flex-wrap:wrap;margin-top:16px"><button id="guided-next" type="button">Open next signup ↗</button><button id="guided-pending" class="secondary" type="button">Awaiting confirmation</button><button id="guided-done" class="secondary" type="button">Confirmed by me</button><button id="guided-skip" class="secondary" type="button">Skip</button></div>';
  document.querySelector('.panel').append(panel);
  let entries=[];let index=0;
  const valid=new Set(['opened','pending','confirmed','failed','not_started']);
  function setStatus(id,status){if(!valid.has(status))return;const p=get();p[id]=status;try{localStorage.setItem(KEY,JSON.stringify(p));}catch{}}
  function advance(){const status=get();while(index<entries.length && (status[entries[index].id]==='confirmed'||status[entries[index].id]==='pending'))index++;render();}
  function render(){
    const item=entries[index],details=document.getElementById('guided-details');
    document.getElementById('guided-count').textContent=item?'Newsletter '+(index+1)+' of '+entries.length:'All selected newsletters reviewed';
    details.replaceChildren();
    const title=document.createElement('strong');title.textContent=item?item.name:'You have reached the end of your list.';
    details.append(title);
    document.getElementById('guided-next').disabled=!item;
    document.getElementById('guided-pending').disabled=!item;
    document.getElementById('guided-done').disabled=!item;
    document.getElementById('guided-skip').disabled=!item;
  }
  document.getElementById('go').addEventListener('click',()=>{
    if(document.getElementById('results').hidden)return;
    entries=pick();index=0;panel.hidden=false;advance();
  });
  document.getElementById('guided-next').addEventListener('click',()=>{
    const item=entries[index];if(!item)return;
    // A single window.open from a user click to avoid popup blocking and opening many tabs.
    const tab=window.open('about:blank','_blank');
    if(tab){tab.opener=null;tab.location.replace(item.url);setStatus(item.id,'opened');}
    else alert('Your browser blocked the new tab. Please allow popups for Subnado or use the official signup link below.');
  });
  document.getElementById('guided-pending').addEventListener('click',()=>{
    const item=entries[index];if(!item)return;setStatus(item.id,'pending');index++;advance();
  });
  document.getElementById('guided-done').addEventListener('click',()=>{
    const item=entries[index];if(!item)return;setStatus(item.id,'confirmed');index++;advance();
  });
  document.getElementById('guided-skip').addEventListener('click',()=>{index++;advance();});
})();