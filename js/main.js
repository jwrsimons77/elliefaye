document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Scroll reveal: explicit .reveal elements (blog) plus case-study blocks
  // site-wide. Classes are added here so no-JS visitors see everything.
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduced) {
    Array.prototype.forEach.call(document.querySelectorAll('.case-study'), function (el) {
      if (revealEls.indexOf(el) === -1) {
        el.classList.add('reveal');
        revealEls.push(el);
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Netlify contact form: submit via fetch so we can swap in the success
  // message without a full page reload.
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      }).then(function () {
        form.style.display = 'none';
        var success = document.getElementById('form-success');
        if (success) success.style.display = 'block';
      }).catch(function () {
        form.submit();
      });
    });
  }

  // Native <video> can't play HLS directly outside Safari, so hls.js is
  // loaded on demand only for players that need it.
  var hlsPlayers = document.querySelectorAll('video[data-hls-src]');
  if (hlsPlayers.length) {
    var needsHls = Array.prototype.some.call(hlsPlayers, function (v) {
      return !v.canPlayType('application/vnd.apple.mpegurl');
    });
    if (needsHls) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
      script.onload = function () {
        hlsPlayers.forEach(function (video) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) return;
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(video.getAttribute('data-hls-src'));
            hls.attachMedia(video);
          }
        });
      };
      document.head.appendChild(script);
    } else {
      hlsPlayers.forEach(function (video) {
        video.src = video.getAttribute('data-hls-src');
      });
    }
  }
});
