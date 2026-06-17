# G&S Event Co.

Static GitHub Pages website for **G&S Event Co.**, a luxury soft play and event rental brand.

Tagline:

> Elegant soft play and event rentals for unforgettable celebrations.

## Project Structure

This site is intentionally static and GitHub Pages deployable.

- `index.html`
- `style.css`
- `script.js`
- `README.md`
- `assets/images/`

There are no frameworks, npm dependencies, build tools, or backend services.

## How To Run Locally

Open `index.html` directly in your browser.

For the most accurate local preview, you can also serve the folder with any simple static server, then visit the local URL it provides.

## Image Files

All image assets live in `assets/images/`.

Current filenames used by the website:

- `hero-soft-play.jpg`
- `service-soft-play-rentals.jpg`
- `service-ball-pit.jpg`
- `service-bounce-house.jpg`
- `service-foam-mats.jpg`
- `service-toddler-play-zone.jpg`
- `service-playpen-fence.jpg`
- `service-event-styling.jpg`
- `package-basic.jpg`
- `package-premium.jpg`
- `addon-animal-hopper.jpg`
- `addon-ball-color.jpg`
- `addon-toddler-table-chairs.jpg`

To replace a photo, keep the same filename and overwrite the image in `assets/images/`. The HTML already points to those names.

Recommended image sizes:

- Hero image: 1600px wide or larger
- Service and package images: 1200px to 1600px wide
- Use JPG or WebP
- Keep a similar horizontal aspect ratio so cards stay consistent
- Compress images before uploading for faster mobile loading

## How To Update Package Pricing

Package prices appear in `index.html` in two places:

- The package cards in `<section id="packages">`
- The booking form package choices in Step 3

Current packages:

- Basic Package - $250
- Premium Package - $300
- Custom Quote

The booking estimate reads package prices from each radio button's `data-price` value.

## How To Update Add-ons

Add-ons are managed in `script.js` in the `addOns` array.

Current add-ons:

- Additional Animal Hopper - $25
- Additional Ball Color - $15
- Toddler Table & Chairs - $50

Example:

```js
{
  name: "Additional Animal Hopper",
  description: "Add another ride-on animal for extra play fun.",
  price: 25,
  image: "assets/images/addon-animal-hopper.jpg"
}
```

The visible add-on shopping cards and booking form selectable add-ons are generated from this array. Each add-on card uses its `image` value for the product photo.

## How To Update Business Contact Info

Edit the Contact section in `index.html`.

Current placeholders:

- Phone: `(555) 123-4567`
- Email: `hello@gseventco.com`
- Service Area: `Your City + Surrounding Areas`
- Social: `Instagram`, `Facebook`, `TikTok`

## Booking Form

Booking requests are saved in browser `localStorage`.

The admin login section has been removed from the public page. When you are ready for a private booking manager, connect the form to a real backend and build the admin view behind proper authentication.

## How To Deploy On GitHub Pages

1. Push these files and the `assets/images/` folder to your GitHub repository.
2. Go to repository `Settings`.
3. Open `Pages`.
4. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save.

GitHub Pages will serve `index.html` automatically.

## How To Connect Twilio Later

This static version cannot securely send SMS directly because Twilio secrets must not be placed in browser JavaScript.

When ready:

1. Create a secure backend endpoint using Netlify Functions, Vercel Functions, Supabase Edge Functions, or another server.
2. Store these secrets only on the server:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER`
3. In `script.js`, find:

```js
// Future Twilio integration:
// Send SMS notification to G&S Event Co. partners when a booking request is submitted.
```

4. Replace that comment area with a `fetch()` call to your secure backend endpoint.

Never place Twilio Auth Tokens in `script.js`, `index.html`, or any public GitHub Pages file.

## How To Connect A Real Booking Backend Later

Keep the current form UI, then replace the localStorage save inside the `bookingForm` submit handler in `script.js` with a request to a secure backend.

Good launch-ready backend options:

- Supabase table plus Row Level Security
- Netlify Functions
- Vercel Functions
- Supabase Edge Functions

Store private API keys only in backend environment variables, never in the static website files.
