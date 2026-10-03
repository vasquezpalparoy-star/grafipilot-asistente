const widget=document.getElementById('gp-assistant-widget');
const panel=widget.querySelector('#gp-assistant-panel');
const toggle=widget.querySelector('#gp-assistant-toggle');
const close=widget.querySelector('#gp-assistant-close');
const frame=widget.querySelector('#gp-assistant-frame');
function setOpen(open){
  if(open&&!frame.getAttribute('src'))frame.setAttribute('src',frame.dataset.src);
  panel.hidden=!open;
  toggle.setAttribute('aria-expanded',String(open));
  if(open)close.focus();else toggle.focus();
}
toggle.addEventListener('click',()=>setOpen(panel.hidden));
close.addEventListener('click',()=>setOpen(false));
widget.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)setOpen(false)});
