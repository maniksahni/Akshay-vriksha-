(function () {
  // one FAQ open at a time; browsers without <details name> get the same behaviour here
  var faqs = [].slice.call(document.querySelectorAll('details.faq'));
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d && o.open) o.open = false; });
    });
  });
  var reveal = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('in'); });
  }
  var bar = document.getElementById('bar');
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var queued = false;
  function paint() {
    queued = false;
    var d = document.documentElement, max = d.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    var on = -1;
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top < innerHeight * 0.35) on = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === on); });
  }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
  paint();
  // the contents list starts closed on phones so the guide itself is what you see first
  var toc = document.querySelector('.toc details');
  if (toc && innerWidth < 1024) toc.removeAttribute('open');
  links.forEach(function (a) { a.addEventListener('click', function () { if (innerWidth < 1024 && toc) toc.removeAttribute('open'); }); });
})();
