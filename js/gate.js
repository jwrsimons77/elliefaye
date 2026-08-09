/* Password gate for the private portfolio area.
   The password is never stored in the page. The visitor's entry is hashed
   with SHA-256 and compared against the stored hash. A correct entry is
   remembered in localStorage so the password is only asked for once per
   browser. This is a light privacy screen for a personal site, not
   bank-grade security. */
(function () {
  var HASH = 'b8db007d3fc806da81c3578c43b9cac6fe781406b4196d434dd77e951fbc0f41';
  var KEY = 'ef-private-gate';

  function isUnlocked() {
    try { return localStorage.getItem(KEY) === HASH; } catch (e) { return false; }
  }

  function remember() {
    try { localStorage.setItem(KEY, HASH); } catch (e) { /* private browsing */ }
  }

  function unlockPage() {
    document.documentElement.classList.remove('locked');
    var screen = document.getElementById('gate');
    if (screen && screen.parentNode) screen.parentNode.removeChild(screen);
  }

  function sha256Hex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (isUnlocked()) { unlockPage(); return; }

    var form = document.getElementById('gate-form');
    var input = document.getElementById('gate-password');
    var error = document.getElementById('gate-error');
    if (!form || !input) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (error) error.style.display = 'none';
      if (!window.crypto || !crypto.subtle || !window.TextEncoder) {
        if (error) {
          error.textContent = 'Sorry, this browser is too old to unlock the page. Please try a current browser.';
          error.style.display = 'block';
        }
        return;
      }
      sha256Hex(input.value).then(function (hex) {
        if (hex === HASH) {
          remember();
          unlockPage();
        } else {
          input.value = '';
          input.focus();
          if (error) {
            error.textContent = 'That password is not right. Please try again.';
            error.style.display = 'block';
          }
        }
      });
    });

    input.focus();
  });
})();
