document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
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
