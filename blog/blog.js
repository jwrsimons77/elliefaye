document.addEventListener('DOMContentLoaded', function () {
  // Reading progress bar (post pages only). Scroll reveals live in js/main.js.
  var bar = document.querySelector('.progress');
  if (!bar) return;
  var update = function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = 'scaleX(' + ratio + ')';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
