(function(){
var $=function(i){return document.getElementById(i)};
var mb=$('mb'),nv=$('nv');
if(mb)mb.addEventListener('click',function(){var o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
if($('dq')){var g=function(n){return document.querySelector('input[name='+n+']:checked').value};
var dd=function(){$('d1').textContent=g('a');$('d2').textContent=g('b');$('d3').textContent=g('c');
$('dw').href='https://wa.me/254703545010?text='+encodeURIComponent('Hello DeedCode. I would like a free Fix Plan. Organisation: '+g('b')+'. I need: '+g('a')+'. Timeline: '+g('c')+'.')};
$('dq').addEventListener('change',dd);dd()}
if($('f')){var msg=function(){var v=function(i){return $(i).value.trim()};
var s='Hello DeedCode, I am '+(v('n')||'(name)')+'. Contact: '+(v('c')||'(email or WhatsApp)')+'. Looking for: '+v('t')+'. The problem: '+v('m');
$('wa').href='https://wa.me/254703545010?text='+encodeURIComponent(s);
$('em').href='mailto:hello@deedcode.com?subject='+encodeURIComponent('New enquiry: '+v('t'))+'&body='+encodeURIComponent(s)};
$('f').addEventListener('input',msg);$('f').addEventListener('submit',function(e){e.preventDefault()});msg()}
if($('wl')){$('wl').addEventListener('submit',function(e){e.preventDefault();var m=$('wm').value.trim();
location.href='mailto:hello@deedcode.com?subject='+encodeURIComponent('Notify me when tools launch')+'&body='+encodeURIComponent('Please notify me when the first DeedCode tools launch. My email: '+m)})}
})();
(function(){var all=function(){document.querySelectorAll('.dm.open').forEach(function(d){d.classList.remove('open');d.querySelector('.ddb').setAttribute('aria-expanded','false')})};
document.querySelectorAll('.ddb').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();var d=b.parentNode,o=!d.classList.contains('open');all();if(o){d.classList.add('open');b.setAttribute('aria-expanded','true')}})});
document.addEventListener('click',function(e){if(!e.target.closest('.dm'))all()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')all()});
window.addEventListener('hashchange',function(){all();var n=document.getElementById('nv');if(n)n.classList.remove('open')})})();

(function(){
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var sp=document.createElement('div');sp.className='sp';sp.setAttribute('aria-hidden','true');document.body.appendChild(sp);
var hd=document.querySelector('header'),tk=false;
function upd(){tk=false;var y=window.scrollY||0,m=document.documentElement.scrollHeight-innerHeight;
sp.style.transform='scaleX('+(m>0?Math.min(y/m,1):0)+')';if(hd)hd.classList.toggle('scrolled',y>8);
if(!rm)document.querySelectorAll('.shot').forEach(function(s){var r=s.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
var py=((r.top+r.height/2)-innerHeight/2)*-.05;py=Math.max(-18,Math.min(18,py));s.style.setProperty('--py',py.toFixed(1)+'px')})}
function req(){if(!tk){tk=true;requestAnimationFrame(upd)}}
window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);
window.addEventListener('hashchange',function(){setTimeout(req,80)});upd();
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.card,.pan');if(!c)return;var r=c.getBoundingClientRect();
c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')},{passive:true});
if(!('IntersectionObserver' in window)||rm)return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var t=e.target;t.classList.add('in');io.unobserve(t);
setTimeout(function(){t.classList.remove('rv','rv2','in');t.style.transitionDelay=''},1600)}})},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
document.querySelectorAll('.head,.card,.pan,.stack,.strip,.vs,.row,.steps li,.tool,.fd,details,.shot').forEach(function(el,i){
el.classList.add(el.classList.contains('shot')?'rv2':'rv');el.style.transitionDelay=((i%4)*80)+'ms';io.observe(el)})
})();
