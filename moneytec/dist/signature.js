/* A small, dependency-free layer for Moneytec's signature interactions. */
(function (root) {
  'use strict';
  const numeric = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const limit = (value, min, max) => Math.min(max, Math.max(min, value));
  function futureValue(monthly, annualRate, years) {
    const payment = Math.max(0, numeric(monthly, 0));
    const rate = limit(numeric(annualRate, 0), 0, 20) / 1200;
    const months = limit(numeric(years, 1), 0, 50) * 12;
    return rate === 0 ? payment * months : payment * Math.expm1(months * Math.log1p(rate)) / rate;
  }
  function storyState(value) {
    const year = Math.round(limit(numeric(value, 1), 1, 20));
    return {
      year,
      invested: year * 12 * 5000,
      value: futureValue(5000, 8, year),
      scale: .36 + .64 * Math.pow((year - 1) / 19, .75),
      chapter: year < 6 ? 1 : year < 15 ? 10 : 20,
      caption: year < 6 ? 'Every possibility starts with a first step.' : year < 15 ? 'Small steps. A longer perspective.' : 'More room for the life you want.'
    };
  }
  root.MoneytecSignatureModel = Object.freeze({futureValue, storyState});
  if (typeof document === 'undefined') return;
  const find = selector => document.querySelector(selector);
  const formatMoney = value => '₹' + Math.round(value).toLocaleString('en-IN');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const yearInput = find('#story-year');
  const yearOutput = find('#story-year-display');
  const amountOutput = find('#story-value');
  const investedOutput = find('#story-invested');
  const installation = find('.growth-installation');
  let numberFrame = 0;
  let displayedValue = storyState(1).value;
  let manualUntil = 0;
  let currentStoryYear = 0;
  const mobileCopy = document.createElement('p');
  mobileCopy.id = 'story-caption';
  mobileCopy.className = 'story-mobile-copy';
  find('.installation-assumption').before(mobileCopy);
  function displayStory(value, manual = false) {
    const state = storyState(value);
    if (manual) manualUntil = performance.now() + 1800;
    if (state.year === currentStoryYear && !document.hidden) return;
    currentStoryYear = state.year;
    yearInput.value = state.year;
    yearInput.style.setProperty('--fill', ((state.year - 1) / 19 * 100) + '%');
    yearOutput.textContent = String(state.year).padStart(2, '0');
    find('#story-year-label').textContent = state.year + (state.year === 1 ? ' year' : ' years');
    investedOutput.textContent = formatMoney(state.invested);
    installation.style.setProperty('--tower-scale', state.scale.toFixed(4));
    mobileCopy.textContent = state.caption;
    document.querySelectorAll('[data-story-select]').forEach(button => {
      const active = Number(button.dataset.storySelect) === state.chapter;
      button.setAttribute('aria-pressed', String(active));
      button.closest('.growth-chapter').classList.toggle('active', active);
    });
    cancelAnimationFrame(numberFrame);
    if (reducedMotion.matches || document.hidden) {
      displayedValue = state.value;
      amountOutput.textContent = formatMoney(state.value);
      return;
    }
    const from = displayedValue;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / 500);
      displayedValue = from + (state.value - from) * (1 - Math.pow(1 - progress, 3));
      amountOutput.textContent = formatMoney(displayedValue);
      if (progress < 1) numberFrame = requestAnimationFrame(tick);
    }
    numberFrame = requestAnimationFrame(tick);
  }
  yearInput.addEventListener('input', () => displayStory(yearInput.value, true));
  document.querySelectorAll('[data-story-select]').forEach(button => button.addEventListener('click', () => displayStory(button.dataset.storySelect, true)));
  displayStory(yearInput.value);
  if ('IntersectionObserver' in window) {
    const chapterVisibility = new Map();
    const chapterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => chapterVisibility.set(entry.target, entry.intersectionRatio));
      if (!window.matchMedia('(min-width: 901px)').matches || performance.now() < manualUntil) return;
      const visible = [...chapterVisibility.entries()].filter(([,ratio]) => ratio > .25).sort((a,b) => b[1] - a[1]);
      if (visible.length) displayStory(visible[0][0].dataset.storyYear);
    }, {rootMargin:'-20% 0px -20% 0px', threshold:[0,.25,.5,.75,1]});
    document.querySelectorAll('[data-story-year]').forEach(chapter => chapterObserver.observe(chapter));
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(numberFrame); displayStory(yearInput.value); }
  });
  const routes = {
    invest: {title:'Give your goal a starting point.',body:'Explore an amount and a timeline in the goal planner. Bring those numbers into a conversation about affordability, risk and suitable choices.',primary:'Explore my goal',destination:'planner',interest:'Mutual funds / SIPs',secondary:'Talk it through with Gulshan'},
    protect: {title:'Start with the people who matter.',body:'Discuss existing cover, family responsibilities and the details of a policy before choosing protection. The right conversation comes before a product.',primary:'Discuss my family’s needs',destination:'consult',interest:'Life / health insurance',secondary:'Explore the services'},
    nri: {title:'Keep a familiar connection in India.',body:'Start with your country of residence, goals and time zone. Gulshan can discuss the documentation and provider eligibility relevant to your situation.',primary:'Connect with the NRI desk',destination:'consult',interest:'NRI support',secondary:'Explore the NRI desk'},
    review: {title:'See the bigger picture first.',body:'A clearer picture of income, commitments, investments and protection makes for a more useful conversation. Begin with a simple monthly snapshot.',primary:'Try my money snapshot',destination:'snapshot',interest:'Review my financial goals',secondary:'Talk it through with Gulshan'}
  };
  function afterClose(action) {
    dialog.addEventListener('close', () => requestAnimationFrame(action), {once:true});
    closeDialog();
  }
  function goToSection(id) {
    document.getElementById(id).scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});
  }
  function openCompass(trigger) {
    trigger.focus({preventScroll:true});
    dialog.classList.add('compass-dialog');
    openDialog('<div class="eyebrow">YOUR MONEYTEC STARTING POINT</div><h2 id="dialog-title">A little focus.<br><span class="serif italic">A clearer next step.</span></h2><p class="compass-intro">You don’t need all the answers today. Choose what’s on your mind, and we’ll help you find a useful place to begin.</p><fieldset class="compass-choices"><legend>WHAT WOULD YOU LIKE TO FOCUS ON?</legend><div class="compass-choice-grid"><button data-focus="invest" class="active" aria-pressed="true"><span>01</span><span>Make a start.<small>My goals & first investment</small></span><b>↗</b></button><button data-focus="protect" aria-pressed="false"><span>02</span><span>Look after my family.<small>Life & health protection</small></span><b>↗</b></button><button data-focus="nri" aria-pressed="false"><span>03</span><span>Plan from abroad.<small>My connection to India</small></span><b>↗</b></button><button data-focus="review" aria-pressed="false"><span>04</span><span>Get a clearer picture.<small>Where I stand today</small></span><b>↗</b></button></div></fieldset><section class="compass-result" aria-live="polite" aria-atomic="true"><div class="eyebrow">A USEFUL PLACE TO BEGIN</div><h3 id="focus-result-title"></h3><p id="focus-result-body"></p><div class="compass-result-actions"><button class="button dark" id="focus-action"></button><button class="text-link" id="focus-secondary"></button></div></section><p class="compass-privacy">This simply helps you navigate the website. It does not assess suitability or recommend a financial product. Your selection is not submitted or stored.</p>');
    let selection = 'invest';
    function updateRoute(key) {
      selection = key;
      const route = routes[key];
      dialog.querySelectorAll('[data-focus]').forEach(button => {const active=button.dataset.focus===key;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
      find('#focus-result-title').textContent = route.title;
      find('#focus-result-body').textContent = route.body;
      find('#focus-action').textContent = route.primary + ' ↗';
      find('#focus-secondary').textContent = route.secondary + ' ↗';
    }
    dialog.querySelectorAll('[data-focus]').forEach(button => button.addEventListener('click', () => updateRoute(button.dataset.focus)));
    find('#focus-action').addEventListener('click', () => {
      const route = routes[selection];
      afterClose(() => {
        if (route.destination === 'planner') {selectPlanningGoal('personal');goToSection('planner');}
        else if (route.destination === 'snapshot') document.querySelector('[data-open="snapshot"]').click();
        else openConsultation(route.interest);
      });
    });
    find('#focus-secondary').addEventListener('click', () => afterClose(() => {
      if (selection === 'protect') goToSection('expertise');
      else if (selection === 'nri') goToSection('nri');
      else openConsultation(routes[selection].interest);
    }));
    updateRoute(selection);
  }
  document.querySelectorAll('[data-compass]').forEach(button => button.addEventListener('click', () => openCompass(button)));
  dialog.addEventListener('close', () => dialog.classList.remove('compass-dialog'));
  const citySelect = find('#your-city');
  const cityClock = find('#your-city-time');
  function updateCityTime() {
    const now = new Date();
    cityClock.textContent = new Intl.DateTimeFormat('en-GB',{timeZone:citySelect.value,hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
    cityClock.dateTime = now.toISOString();
    cityClock.setAttribute('aria-label', citySelect.selectedOptions[0].textContent + ' local time: ' + cityClock.textContent);
  }
  citySelect.addEventListener('change', updateCityTime);
  updateCityTime();
  setInterval(() => {if(!document.hidden)updateCityTime();},60000);
  document.addEventListener('visibilitychange', () => {if(!document.hidden)updateCityTime();});
  if('IntersectionObserver' in window && !reducedMotion.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}}),{threshold:.04});
    document.querySelectorAll('.long-view-heading,.growth-chapter,.focus-invitation').forEach(item=>{item.setAttribute('data-reveal','');reveal.observe(item);});
  }
})(globalThis);
