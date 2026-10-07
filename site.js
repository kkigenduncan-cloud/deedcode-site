(function(){
var $=function(i){return document.getElementById(i)};
var mb=$('mb'),nv=$('nv');
if(mb&&!window.__menuBound)mb.addEventListener('click',function(){var o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
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

/* DeedCode motion layer: quiet reveals, photo parallax, header polish */
(function(){
var d=document,de=d.documentElement,w=window;
var rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var hd=d.querySelector('header'),sp=d.createElement('div');
sp.className='sp';sp.setAttribute('aria-hidden','true');d.body.appendChild(sp);
var shots=[].slice.call(d.querySelectorAll('.shot')),tick=false;
function upd(){tick=false;
var y=w.pageYOffset||de.scrollTop,h=de.scrollHeight-de.clientHeight;
if(hd)hd.classList.toggle('scrolled',y>8);
sp.style.transform='scaleX('+(h>0?Math.min(1,Math.max(0,y/h)):0)+')';
if(rm)return;
var vh=w.innerHeight;
shots.forEach(function(s){var im=s.querySelector('img');if(!im)return;
var r=s.getBoundingClientRect();if(r.bottom<-60||r.top>vh+60)return;
var p=((r.top+r.height/2)-vh/2)/(vh/2+r.height/2);p=Math.max(-1,Math.min(1,p));
im.style.setProperty('--py',(-p*10).toFixed(2)+'px')})}
function req(){if(!tick){tick=true;w.requestAnimationFrame(upd)}}
w.addEventListener('scroll',req,{passive:true});w.addEventListener('resize',req);upd();

if(rm||!('IntersectionObserver' in w))return;

var BLOCKS='.head,.card,.pan,.stack>div,.strip>div,.vs,.steps li,details,.con,.tags,.fd,.cols>form,.cols>ul.ck,.cols>div>ol.ck,.cols>div>.lead,.cols>div>h2,.cols>div>h3,.cols>div>.btn,.cols>div>.direct,.cols>div>.cta,.sec>.w>.lead,.sec>.w>.cta,.cta2 .w>*';
var HERO='.hero>div:first-child>*,.phx>div:first-child>*,.ph:not(.phx)>*';
var io=new IntersectionObserver(function(es){es.forEach(function(e){
if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
requestAnimationFrame(function(){el.classList.add('in')});
if(el.classList.contains('rv')){
var done=function(){el.classList.remove('rv','in');el.style.transitionDelay=''};
var fin=false,go=function(){if(fin)return;fin=true;done()};
el.addEventListener('transitionend',function(ev){if(ev.target===el&&ev.propertyName==='opacity')go()});
setTimeout(go,3200)}
})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});

function add(el,base,cls){
if(el.classList.contains('rv')||el.classList.contains('rv2'))return;
var p=el.parentElement;if(p&&p.closest('.rv,.rv2'))return;
var n=p._rc=(p._rc||0)+1;
el.classList.add(cls);
el.style.transitionDelay=(base+Math.min(n-1,5)*0.09).toFixed(2)+'s';
io.observe(el)}
[].forEach.call(d.querySelectorAll(HERO),function(el){add(el,.12,'rv')});
[].forEach.call(d.querySelectorAll(BLOCKS),function(el){add(el,0,'rv')});
[].forEach.call(d.querySelectorAll('.shot'),function(el){
if(el.classList.contains('rv'))return;
el.classList.add('rv2');el.style.transitionDelay='.1s';io.observe(el)});

if(w.matchMedia('(hover: hover)').matches){
d.addEventListener('mousemove',function(e){
var c=e.target.closest&&e.target.closest('.card,.pan');if(!c)return;
var r=c.getBoundingClientRect();
c.style.setProperty('--mx',(e.clientX-r.left)+'px');
c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true})}
})();
