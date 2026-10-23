'use strict';
const serviceDetails = {
  invest: {tag:'MUTUAL FUNDS & SIPS',title:['A habit today.','A possibility tomorrow.'],body:'From your first SIP to your next milestone, explore mutual fund choices around your goals, timeline and comfort with risk.',points:['Goal-based SIP conversations','Risk profiling & scheme selection','Ongoing portfolio reviews'],cta:'Discuss my investment goals',interest:'Mutual funds / SIPs',note:'Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.',art:'THE LONG VIEW / ILLUSTRATIVE'},
  protect: {tag:'LIFE & HEALTH INSURANCE',title:['For the life you love.','And the people in it.'],body:'A considered conversation about protection: existing cover, family responsibilities, future needs and the terms that deserve a closer look.',points:['Life & term cover through Kotak Life','A review of health protection needs','Support with policy and claim paperwork'],cta:'Discuss my family’s protection',interest:'Life / health insurance',note:'Insurance is the subject matter of solicitation. Benefits, exclusions, underwriting and claim decisions are governed by the insurer and policy terms.',art:'PROTECTION WITH PURPOSE / ILLUSTRATIVE'},
  nri: {tag:'THE NRI DESK',title:['A world of possibility.','A familiar connection.'],body:'Your goals may span countries. Keep a personal point of contact in India for eligible mutual fund options and family protection needs.',points:['A conversation around your time zone','NRI KYC & documentation guidance','Country and provider eligibility checks'],cta:'Discuss my NRI requirements',interest:'NRI support',note:'Product access depends on country of residence, provider acceptance and applicable requirements. Tax advice is outside the scope of this website.',art:'ONE CONNECTION / MANY TIME ZONES'}
};
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.service, item=serviceDetails[key];
  document.querySelectorAll('[data-service]').forEach(control=>{const active=control===button;control.classList.toggle('active',active);control.setAttribute('aria-pressed',String(active));});
  $('#service-tag').textContent=item.tag;
  const title=$('#service-title');title.replaceChildren(document.createTextNode(item.title[0]),document.createElement('br'),document.createTextNode(item.title[1]));
  $('#service-description').textContent=item.body;
  $('#service-points').replaceChildren(...item.points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  $('#service-cta').replaceChildren(document.createTextNode(item.cta+' '),Object.assign(document.createElement('span'),{textContent:'↗'}));
  $('#service-cta').dataset.interest=item.interest;
  $('#service-disclaimer').textContent=item.note;
  $('.service-art').dataset.mode=key;$('#service-art-label').textContent=item.art;
  const panel=$('.service-content');panel.classList.remove('is-changing');void panel.offsetWidth;panel.classList.add('is-changing');
}));
function selectPlanningGoal(key){
  const button=document.querySelector('[data-goal="'+key+'"]');if(button)button.click();
}
document.querySelectorAll('[data-plan-goal]').forEach(link=>link.addEventListener('click',()=>selectPlanningGoal(link.dataset.planGoal)));
const consultationInterests=['Mutual funds / SIPs','Life / health insurance','NRI support','Review my financial goals'];
function openConsultation(interest='Review my financial goals',includePlan=false){
  dialog.classList.add('consult-dialog');
  openDialog('<div class="eyebrow">PERSONALLY, GULSHAN KOHLI</div><h2 id="dialog-title">Let’s start with<br><span class="serif italic dialog-title-name">your story.</span></h2><p>A few starting points for a useful first conversation. You’ll review the message on WhatsApp before sending it.</p>'+(includePlan?'<div class="consult-context">Your illustration: '+money(plan.target)+' target today · '+plan.years+' years · '+plan.rate+'% assumed annual return · approximately '+money(Math.ceil(plan.monthly/100)*100)+'/month'+(plan.inflation?' · 5% inflation included':'')+'.</div>':'')+'<div class="dialog-fields"><label class="field">Your name (optional)<input id="consult-name" type="text" autocomplete="given-name" maxlength="80" placeholder="What should Gulshan call you?"></label><label class="field">I’d like to discuss<select id="consult-interest">'+consultationInterests.map(value=>'<option>'+value+'</option>').join('')+'</select></label><label class="field">Where are you based?<select id="consult-residence"><option>India</option><option>Outside India / NRI</option><option>I’ll share in our conversation</option></select></label><label class="field">Preferred way to connect<select id="consult-format"><option>A phone call</option><option>A video call</option><option>WhatsApp first</option></select></label></div><label class="field full-field">Anything on your mind? (optional)<textarea id="consult-note" maxlength="600" placeholder="Your goal, timeline, or a convenient time and time zone. Please don’t include account numbers or sensitive documents."></textarea></label><div class="consult-actions"><a id="consult-whatsapp" class="button dark" target="_blank" rel="noopener noreferrer">Continue on WhatsApp <span>↗</span></a><a href="tel:+919136792367">Or call directly ↗</a></div><p class="consult-note">This prepares a WhatsApp message; it does not book a confirmed appointment. Gulshan will confirm a suitable time personally. Form entries stay on this page until you choose to open WhatsApp; WhatsApp then handles the prepared message under its own privacy terms.</p>');
  $('#consult-interest').value=consultationInterests.includes(interest)?interest:consultationInterests[3];
  if(interest==='NRI support')$('#consult-residence').value='Outside India / NRI';
  const updateMessage=()=>{
    const name=$('#consult-name').value.trim(), note=$('#consult-note').value.trim();
    const message=['Namaste Gulshan ji, I visited Moneytec.'+(name?' My name is '+name+'.':''),'I’d like to discuss: '+$('#consult-interest').value+'.','Based in: '+$('#consult-residence').value+'.','Preferred connection: '+$('#consult-format').value+'.',includePlan?'My planner illustration: '+plan.goal+'; target today '+money(plan.target)+'; '+plan.years+' years; '+plan.rate+'% assumed annual return; '+(plan.inflation?'5% annual inflation included':'inflation not applied')+'; future target '+money(plan.future)+'; approximately '+money(Math.ceil(plan.monthly/100)*100)+'/month. This is an illustration, not a guaranteed outcome.':'',note?'A little context: '+note:'','Please suggest a convenient time for a conversation.'].filter(Boolean).join('\n');
    $('#consult-whatsapp').href='https://wa.me/919136792367?text='+encodeURIComponent(message);
  };
  dialog.querySelectorAll('input,select,textarea').forEach(input=>input.addEventListener('input',updateMessage));updateMessage();
}
document.querySelectorAll('[data-consult]').forEach(button=>button.addEventListener('click',()=>{button.focus({preventScroll:true});openConsultation(button.dataset.interest);}));
$('#discuss-plan').addEventListener('click',()=>{$('#discuss-plan').focus({preventScroll:true});openConsultation('Mutual funds / SIPs',true);});
dialog.addEventListener('close',()=>dialog.classList.remove('consult-dialog'));
function updateTimezones(){
  const now=new Date();document.querySelectorAll('[data-timezone]').forEach(clock=>{clock.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:clock.dataset.timezone,hour:'2-digit',minute:'2-digit',hour12:false}).format(now);clock.dateTime=now.toISOString();});
}
updateTimezones();setInterval(()=>{if(!document.hidden)updateTimezones();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateTimezones();});
let progressQueued=false;
function updateReadingProgress(){
  const total=document.documentElement.scrollHeight-window.innerHeight;
  $('.reading-progress span').style.transform='scaleX('+(total>0?Math.min(1,Math.max(0,window.scrollY/total)):0)+')';progressQueued=false;
}
window.addEventListener('scroll',()=>{if(!progressQueued){progressQueued=true;requestAnimationFrame(updateReadingProgress);}},{passive:true});window.addEventListener('resize',updateReadingProgress);updateReadingProgress();
if('IntersectionObserver' in window){
  const extraTargets=document.querySelectorAll('.expertise-heading,.service-experience,.manifesto-inner,.life-goal-grid>a,.founder-grid,.nri-copy,.nri-world,.trust-grid,.contact-main');
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){extraTargets.forEach(item=>item.setAttribute('data-reveal',''));const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.04});extraTargets.forEach(item=>revealObserver.observe(item));}
  const portrait=document.querySelector('.portrait-orbits');const portraitObserver=new IntersectionObserver(entries=>{portrait.style.animationPlayState=entries[0].isIntersecting?'running':'paused';});portraitObserver.observe(portrait);
}

if ('IntersectionObserver' in window) {
  let heroVisible = true, contactVisible = false;
  const contactControl = document.querySelector('.floating-contact');
  const contactVisibility = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.target.matches('.hero')) heroVisible = entry.isIntersecting; else contactVisible = entry.isIntersecting; });
    contactControl.classList.toggle('is-available', !heroVisible && !contactVisible);
  });
  contactVisibility.observe(document.querySelector('.hero'));
  contactVisibility.observe(document.querySelector('#contact'));
} else { document.querySelector('.floating-contact').classList.add('is-available'); }
