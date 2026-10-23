'use strict';
const $ = selector => document.querySelector(selector);
const money = value => '₹' + Math.round(value).toLocaleString('en-IN');
const shortMoney = value => value >= 1e7 ? '₹' + (value / 1e7).toFixed(2).replace(/0$/, '') + ' crore' : value >= 1e5 ? '₹' + (value / 1e5).toFixed(1).replace(/\.0$/, '') + ' lakh' : money(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const goals = {
  home: {title:'A home of my own',amount:2500000,years:10,progress:64},
  freedom: {title:'More choice. More freedom.',amount:5000000,years:15,progress:42},
  education: {title:'A world of possibilities',amount:2000000,years:12,progress:78},
  personal: {title:'My next chapter',amount:1000000,years:7}
};
let selectedGoal = 'home';
let plan = {};
let toastTimeout;
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('#toast').classList.remove('show'), 3500); }
function updateRange(input) { const fill = ((Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min))) * 100; input.style.setProperty('--fill', fill + '%'); }
function updatePlanner() {
  const target = Number($('#target').value);
  const years = Number($('#years').value);
  const rate = clamp(Number($('#return-rate').value), 0, 20);
  const inflation = $('#inflation').checked;
  const future = target * (inflation ? Math.pow(1.05, years) : 1);
  const months = years * 12;
  const monthlyRate = rate / 1200;
  const factor = monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  const monthly = future / factor;
  const invested = monthly * months;
  plan = {goal:goals[selectedGoal].title,target,years,rate,inflation,future,monthly,invested,growth:future - invested};
  $('#target-output').textContent = money(target);
  $('#years-output').textContent = years + (years === 1 ? ' year' : ' years');
  $('#monthly-result').textContent = money(Math.ceil(monthly / 100) * 100);
  $('#result-description').textContent = 'could work towards a ' + shortMoney(future) + ' goal in ' + years + (years === 1 ? ' year.' : ' years.');
  $('#invested-result').textContent = shortMoney(invested);
  $('#growth-result').textContent = shortMoney(Math.max(0, future - invested));
  $('#future-target').textContent = shortMoney(future);
  const points = [];
  const contributions = [];
  for (let n = 0; n <= 36; n++) {
    const m = months * n / 36;
    const value = monthlyRate === 0 ? monthly * m : monthly * (Math.pow(1 + monthlyRate, m) - 1) / monthlyRate;
    const x = 6 + n / 36 * 488;
    const y = 169 - value / future * 151;
    const c = 169 - (monthly * m) / future * 151;
    points.push((n ? 'L' : 'M') + x.toFixed(2) + ',' + y.toFixed(2));
    contributions.push((n ? 'L' : 'M') + x.toFixed(2) + ',' + c.toFixed(2));
  }
  $('#growth-line').setAttribute('d', points.join(' '));
  $('#growth-area').setAttribute('d', points.join(' ') + ' L494,169 L6,169 Z');
  $('#contribution-line').setAttribute('d', contributions.join(' '));
  $('#growth-chart').setAttribute('aria-label', 'Illustration of contributions growing towards ' + money(future) + ' over ' + years + ' years, assuming ' + rate + '% annual return.');
  updateRange($('#target')); updateRange($('#years'));
}
function previewGoal(key) {
  const goal = goals[key];
  $('#preview-title').textContent = goal.title;
  $('#preview-ring').setAttribute('stroke-dasharray', (goal.progress / 100 * 591).toFixed(1) + ' 591');
  $('#preview-percent').firstChild.textContent = goal.progress;
  $('.goal-ring').setAttribute('aria-label','Illustrative goal progress: ' + goal.progress + ' percent');
  $('#preview-amount').textContent = money(goal.amount);
  $('#preview-years').textContent = goal.years + ' years';
  document.querySelectorAll('[data-preview]').forEach(button => {const active=button.dataset.preview===key;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => previewGoal(button.dataset.preview)));
document.querySelectorAll('[data-goal]').forEach(button => button.addEventListener('click', () => {
  selectedGoal = button.dataset.goal;
  const goal = goals[selectedGoal];
  $('#target').value = goal.amount; $('#years').value = goal.years;
  document.querySelectorAll('[data-goal]').forEach(item => {const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  updatePlanner();
}));
['#target','#years','#return-rate','#inflation'].forEach(selector => $(selector).addEventListener('input', updatePlanner));
$('#return-rate').addEventListener('change',()=> {$('#return-rate').value=clamp(Number($('#return-rate').value),0,20);updatePlanner();});
$('#save-plan').addEventListener('click', () => {
  const text = [ 'MONEYTEC — MONEY IN PERSPECTIVE', 'My illustrated goal plan', '', 'Goal: ' + plan.goal, 'Target today: ' + money(plan.target), 'Time: ' + plan.years + ' years', 'Assumed annual return: ' + plan.rate + '%', 'Inflation assumption: ' + (plan.inflation ? '5% per year' : 'Not applied'), 'Future target: ' + money(plan.future), 'Approximate monthly contribution: ' + money(Math.ceil(plan.monthly/100)*100), 'Modelled contributions: ' + money(plan.invested), 'Modelled growth: ' + money(plan.growth), '', 'Educational illustration only. Not a recommendation or promise. Assumes month-end contributions and constant returns; excludes fees, taxes and market fluctuations. The displayed monthly contribution is rounded up to the next Rs 100. Actual outcomes vary.', '', 'Created in your browser. Your numbers were not sent to a server.' ].join('\n');
  const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
  const link = document.createElement('a'); const url = URL.createObjectURL(blob); link.href=url;link.download='moneytec-my-goal-plan.txt';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Your illustrated plan has been downloaded.');
});
const articles = {
  compounding: {tag:'THE LONG VIEW',title:'Time makes a difference.',body:'Compounding describes growth on an amount that already includes earlier growth. Time and consistent contributions can make that effect more visible—but a projection is only as reliable as its assumptions.',sections:[['Think in habits, not headlines.','A repeatable contribution can be easier to plan around than waiting for the perfect moment. What you can afford and when you need the money still matter.'],['Read the assumptions.','Our planner uses a constant return to make the mathematics easy to explore. Real markets do not move in a straight line. Fees, taxes and negative periods can change the outcome.'],['Try a different timeline.','Use the goal planner to compare shorter and longer horizons while keeping the return assumption the same. Notice how the monthly contribution changes.']]},
  risk: {tag:'THE BASICS',title:'What could happen along the way?',body:'A potential return never tells the whole story. Before choosing a financial product, understand what could go wrong and how that would affect your life.',sections:[['When will you need the money?','A near-term expense and a distant goal call for different conversations about access to cash and uncertainty.'],['What costs and restrictions apply?','Read the product documents. Ask about fees, access to your money, exit conditions, and whether the value can fall.'],['Can you live with the downside?','Your ability to take risk depends on more than your comfort with a chart. Think about income, obligations, dependants and existing savings. Seek appropriately qualified advice for personal decisions.']]},
  buffer: {tag:'EVERYDAY MONEY',title:'Give unexpected moments some space.',body:'An unexpected expense is easier to discuss when you have already thought about how you would cover it. A cash buffer is about access and resilience, rather than chasing a return.',sections:[['Start with the essentials.','List the costs that would continue if your income paused: housing, food, utilities, repayments and essential care.'],['Make it personal.','The amount you need depends on job stability, family responsibilities, insurance, access to support and other circumstances. A generic number is only a starting question.'],['Keep the purpose clear.','Consider how quickly you could access the money and any charges or restrictions. Revisit your buffer when your circumstances change.']]}
};
const dialog = $('#content-dialog');
let lastFocus;
function openDialog(content) {lastFocus=document.activeElement;$('#dialog-content').innerHTML=content;dialog.showModal();dialog.scrollTop=0;dialog.querySelector('.dialog-close').focus();}
function closeDialog(){dialog.close();}
dialog.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('close',()=>lastFocus?.focus({preventScroll:true}));
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeDialog();}});
document.querySelectorAll('[data-article]').forEach(button=>button.addEventListener('click',()=>{const article=articles[button.dataset.article];openDialog('<div class="eyebrow">'+article.tag+'</div><h2 id="dialog-title">'+article.title+'</h2><p>'+article.body+'</p>'+article.sections.map(([title,body])=>'<h3>'+title+'</h3><p>'+body+'</p>').join('')+'<a class="button dark" href="#planner" id="article-planner">Explore the goal planner ↗</a><p style="font-size:10px">General education only, not personal financial advice.</p>');$('#article-planner').addEventListener('click',closeDialog);}));
let checklist = new Set();
function checklistContent(){return '<div class="eyebrow">YOUR MONTHLY MONEY MOMENT</div><h2 id="dialog-title">A little check-in.<br>A clearer month.</h2><p>Five useful questions to revisit. These selections stay only for this page visit.</p><ul class="monthly-list">'+['Have I reviewed what came in and what went out?','Do I have enough accessible money for upcoming essentials?','Are my goals and timelines still relevant?','Have I checked upcoming repayments and commitments?','Is there one small adjustment I can make next month?'].map((text,i)=>'<li><label><input type="checkbox" data-check="'+i+'" '+(checklist.has(i)?'checked':'')+'><span>'+text+'</span></label></li>').join('')+'</ul><p id="check-progress" role="status">'+checklist.size+' of 5 reviewed.</p>';}
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{
  const type=button.dataset.open;
  if(type==='snapshot'){
    openDialog('<div class="eyebrow">MY MONEY SNAPSHOT</div><h2 id="dialog-title">Meet your monthly margin.</h2><p>A simple look at income minus spending. Enter monthly amounts, including repayments and regular commitments in your spending.</p><div class="dialog-fields"><label class="field">Monthly take-home income (₹)<input id="snapshot-income" type="number" min="0" max="100000000" step="1000" value="75000" inputmode="decimal"></label><label class="field">Monthly spending (₹)<input id="snapshot-spend" type="number" min="0" max="100000000" step="1000" value="50000" inputmode="decimal"></label></div><div class="snapshot-result" role="status" aria-live="polite"><p id="snapshot-label">Monthly amount remaining</p><strong id="snapshot-margin">₹25,000</strong><small id="snapshot-rate">33% of take-home income</small></div><p style="font-size:10px">This is a cash-flow snapshot, not a financial health score or an investment recommendation.</p>');
    const update=()=>{const income=clamp(Number($('#snapshot-income').value),0,1e8);const spend=clamp(Number($('#snapshot-spend').value),0,1e8);const margin=income-spend;$('#snapshot-margin').textContent=(margin<0?'−':'')+money(Math.abs(margin));$('#snapshot-label').textContent=margin<0?'Monthly spending above income':'Monthly amount remaining';$('#snapshot-rate').textContent=income>0?Math.round(Math.abs(margin)/income*100)+'% of take-home income'+(margin<0?' above income':''):'Enter income to calculate a percentage';};$('#snapshot-income').addEventListener('input',update);$('#snapshot-spend').addEventListener('input',update);
  } else if(type==='checklist'){
    openDialog(checklistContent());dialog.querySelectorAll('[data-check]').forEach(input=>input.addEventListener('change',()=>{const i=Number(input.dataset.check);input.checked?checklist.add(i):checklist.delete(i);$('#check-progress').textContent=checklist.size+' of 5 reviewed.';}));
  } else if(type==='privacy'){
    openDialog('<div class="eyebrow">PRIVACY, SIMPLY</div><h2 id="dialog-title">Your numbers stay yours.</h2><p>The planner, snapshot and checklist run in your browser. The tools do not send your entries to a server or store them in an account.</p><p>Downloading a plan creates a file on your device. Your planner entries reset when the page reloads. The website host may process standard technical request information; Google Fonts receives requests when fonts load.</p><p>The consultation form prepares a WhatsApp message only when you choose to continue. Its entries are not submitted to this website. Opening WhatsApp shares the prepared message with WhatsApp; sending it is your choice. Phone, email and social links open their respective services. This website does not execute investments or take payments.</p>');
  }
}));
const menuToggle=$('#menu-toggle');const mobileMenu=$('#mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');}
menuToggle.addEventListener('click',()=>{const opening=mobileMenu.hidden;mobileMenu.hidden=!opening;menuToggle.setAttribute('aria-expanded',String(opening));menuToggle.setAttribute('aria-label',opening?'Close navigation':'Open navigation');});
mobileMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){closeMenu();menuToggle.focus();}});
window.matchMedia('(min-width: 901px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
$('#year').textContent = new Date().getFullYear();
updatePlanner();

// One-time entrances; the page stays fully usable without animation support.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll('.perspective-grid, .perspective-bottom, .planner-heading, .planner, .approach-heading, .approach-steps article, .learn-heading, .editorial-card, .questions, .closing-inner');
  targets.forEach(element => element.setAttribute('data-reveal',''));
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}), {threshold:0.05});
  targets.forEach(element => observer.observe(element));
  const sculpture = document.querySelector('.sculpture');
  const motionObserver = new IntersectionObserver(entries => {
    sculpture.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
  });
  motionObserver.observe(sculpture);
}
