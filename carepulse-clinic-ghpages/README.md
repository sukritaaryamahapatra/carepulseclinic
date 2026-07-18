# CarePulse Clinic

A fully static, multi-page website for a multi-specialty medical clinic, built to run directly on **GitHub Pages** — no build step, no server, no framework.

## Folder structure

```
carepulse-clinic/
├── index.html          Home page
├── about.html
├── services.html       Departments (accordion)
├── doctors.html
├── contact.html        Appointment "booking" form (opens a pre-filled email)
├── 404.html            GitHub Pages shows this automatically for unknown URLs
├── css/
│   └── styles.css      All design tokens + styles
├── js/
│   └── main.js         Nav, scroll reveals, testimonial slider, form handling
├── partials/
│   ├── header.html     Shared nav, loaded into every page via fetch
│   └── footer.html     Shared footer, loaded into every page via fetch
├── .nojekyll            Tells GitHub Pages to skip Jekyll processing
└── README.md
```

Every link and asset path in this project is **relative** (`about.html`, `css/styles.css`, not `/about.html`), so it works whether GitHub Pages serves it at `https://yourname.github.io/` (a user site) or `https://yourname.github.io/carepulse-clinic/` (a project site) — no path changes needed either way.

## How the appointment form works here

GitHub Pages only serves static files — it cannot run a backend. So `contact.html`'s form doesn't call an API. Instead, submitting it opens the visitor's **email app** with a pre-filled message (name, phone, department, preferred date/time, notes) addressed to the clinic's email — they just review it and hit send. No server, database, or configuration required.

If you later want real online booking (saved to a database, SMS confirmations, etc.), you'd need a backend host (Cloudflare Pages/Workers, Netlify Functions, a small Node server, etc.) — GitHub Pages alone can't do that part.

## Publish it on GitHub Pages

1. Create a new GitHub repository (or use an existing one) and upload every file/folder here to it, keeping the structure exactly as-is (don't nest it inside another folder).
2. In the repo, go to **Settings → Pages** (left sidebar).
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, select **main** (or whichever branch you uploaded to) and folder **/ (root)**.
5. Click **Save**.
6. Wait 1-2 minutes, then refresh the Pages settings page — it will show your live URL, something like:
   ```
   https://yourusername.github.io/carepulse-clinic/
   ```
7. Open that URL — the site should be fully live, including navigation, the accordion on the Services page, the testimonial slider, and the appointment form.

Any time you push a new commit to that branch, GitHub Pages automatically republishes the site within a minute or two — no redeploy step needed.

## Customizing

- **Colors, type, spacing:** all defined as CSS variables at the top of `css/styles.css` — change once, applies everywhere.
- **Clinic name, address, phone, doctors, departments:** plain text inside the HTML files — search and replace `CarePulse`, the Dhanbad address, the sample doctor names/specialties, and the `hello@carepulseclinic.example` address in `js/main.js` with your real ones.
- **Logo:** an inline SVG in `partials/header.html` — swap for an `<img>` tag if you have a real logo file.
- **Map:** `contact.html` uses a keyless Google Maps embed URL — replace the `q=` value with your real address.

## Notes

- All images are drawn with inline SVG / CSS gradients, so there are no binary image assets to manage or replace.
- Fonts (Fraunces, Work Sans, IBM Plex Mono) load from Google Fonts via `css/styles.css` — swap the `@import` line if you'd rather self-host them.
- The site respects `prefers-reduced-motion` and is fully keyboard-navigable.
