/* Server-side password gate for the private portfolio and contact pages.
   Unlike the old client-side gate, the protected HTML is never sent to the
   browser until the correct password has been entered.

   Setup: in the Netlify dashboard, add an environment variable named
   PORTFOLIO_PASSWORD with the chosen password. Until that variable exists,
   the gate stays open so the site keeps working.

   How it works: a correct password (posted from the gate form below) sets a
   cookie holding a SHA-256 hash of the password. Every later request with
   that cookie passes straight through. Changing the password in the
   dashboard invalidates everyone's cookies. */

const COOKIE = "ef_portfolio";
const COOKIE_DAYS = 60;

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function gatePage(showError) {
  return `<!doctype html>
<html lang="en" class="locked">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Private area | Ellie Faye</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/images/blue-orangutan.svg" type="image/svg+xml">
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="gate-screen" id="gate">
  <div class="gate-card">
    <p class="gate-eyebrow">Private area</p>
    <h2>This page is password protected</h2>
    <p>Ellie's portfolio and contact details are private. If you have the password, enter it below. Otherwise, you are very welcome over at the <a href="/">Blue Orangutan Tales blog</a>.</p>
    <form method="POST">
      <label for="gate-password">Password</label>
      <input type="password" id="gate-password" name="password" autocomplete="off" autofocus required>
      <button class="submit" type="submit">Unlock</button>
      <p class="gate-error"${showError ? ' style="display:block"' : ""}>That password is not right. Please try again.</p>
    </form>
  </div>
</div>
</body>
</html>`;
}

function htmlResponse(body, status) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export default async function (request, context) {
  const password = Netlify.env.get("PORTFOLIO_PASSWORD");
  // No password configured yet: leave the pages open rather than locking
  // the owner out of their own site.
  if (!password) return context.next();

  const expected = await sha256Hex(password);

  if (context.cookies.get(COOKIE) === expected) {
    return context.next();
  }

  if (request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const attempt = form ? String(form.get("password") ?? "") : "";
    if (attempt && (await sha256Hex(attempt)) === expected) {
      const url = new URL(request.url);
      const response = new Response(null, {
        status: 303,
        headers: { location: url.pathname },
      });
      response.headers.append(
        "set-cookie",
        `${COOKIE}=${expected}; Path=/; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`
      );
      return response;
    }
    return htmlResponse(gatePage(true), 401);
  }

  return htmlResponse(gatePage(false), 401);
}

export const config = {
  path: ["/portfolio/*", "/get-in-touch", "/get-in-touch/*"],
};
