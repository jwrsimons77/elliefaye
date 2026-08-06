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

  // Post the contact form in the background so the page can swap in the
  // success panel instead of handing off to Netlify's default thank-you page.
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = contactForm.querySelector('button.submit');
      if (button) button.disabled = true;

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Submission failed');
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          if (button) button.disabled = false;
          // Fall back to a normal form POST so a failed fetch never loses the message.
          contactForm.submit();
        });
    });
  }
});
