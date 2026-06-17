# Little Luxe Soft Play

A launch-ready static website for a luxury soft play rental business. The project uses only HTML, CSS, and vanilla JavaScript, so it can be opened directly in a browser or deployed to GitHub Pages without a build step.

## Files

- `index.html` - Page structure, content, SEO tags, and booking/admin sections.
- `style.css` - Responsive styling, visual placeholders, layout, and animations.
- `script.js` - Mobile navigation, form validation, local booking storage, admin preview, and JSON export.
- `README.md` - Setup and customization notes.

## 1. How to Run Locally

Open `index.html` directly in your browser.

No Node.js, npm, backend, database, or framework is required.

## 2. How to Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. In GitHub, open `Settings`.
4. Go to `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select the `main` branch and `/root` folder.
7. Save, then wait for GitHub to publish the Pages URL.

## 3. How to Change Company Information

Edit these areas in `index.html`:

- Header brand text near the top of the file.
- Hero headline and subheadline in the `hero` section.
- About text in the `about` section.
- Contact details in the `contact` section.
- Footer business name and tagline.

You can also update SEO text in the `<head>`:

- `<title>`
- `<meta name="description">`
- Open Graph title and description tags.

## 4. How to Update Package Pricing

In `index.html`, find the `packages` section.

Replace each placeholder price:

```html
Starting at <strong>$000</strong>
```

with the real starting price for each package.

You can also edit each package's feature list and best-for description in the same section.

## 5. How to Replace Gallery Images

The gallery currently uses CSS visual placeholders so the project stays limited to four files.

To use real photos later:

1. Add image files to your repository.
2. Replace each gallery placeholder in `index.html` with an image tag.
3. Example:

```html
<figure class="gallery-item">
  <img src="images/setup-1.jpg" alt="Neutral soft play birthday setup">
  <figcaption>Neutral Birthday Setup</figcaption>
</figure>
```

4. Add this CSS to `style.css` if you use image tags:

```css
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

If you want to keep GitHub Pages deployment simple, use relative image paths and commit the image files to the same repository.

## 6. How to Change Contact Info

In `index.html`, find the `contact` section and update:

- Phone number
- Email address
- Service area
- Social media links

Also update the `tel:` and `mailto:` link values so buttons and links continue working correctly.

## 7. How to Connect Twilio SMS Notifications Later

The current site is static, so it should not call Twilio directly from the browser. A Twilio Auth Token must stay private.

Recommended future approach:

1. Create a small serverless function using Netlify Functions, Vercel Functions, Cloudflare Workers, or a similar backend.
2. Store Twilio credentials as private environment variables.
3. Send booking form data from `script.js` to that function with `fetch`.
4. Have the function send the SMS through Twilio.

The placeholder comment is in `script.js` inside the booking form submit handler:

```js
// Future integration:
// Send SMS notification to business owners
// using Twilio API when booking is received.
```

## 8. How to Connect a Real Booking Backend Later

The current admin panel stores booking requests in `localStorage`, which is useful for a static preview but not for production booking management across devices.

Recommended backend options:

- Supabase table for bookings.
- Airtable form endpoint.
- Google Forms or Google Apps Script endpoint.
- Serverless function that writes to a database.

For Supabase later:

1. Create a `bookings` table with fields matching the form.
2. Replace the `localStorage` save logic in `script.js` with a `fetch` request or Supabase client call.
3. Move any private service keys to a serverless function.
4. Update the admin preview to read bookings from the backend instead of browser storage.

The placeholder comment is in `script.js` inside the booking form submit handler:

```js
// Future integration:
// Replace localStorage with a Supabase backend table
// for secure, multi-device booking management.
```

## Admin Preview

The admin booking preview password is:

```text
admin123
```

This is intentionally simple for local preview only. It is not real authentication. Use a backend authentication system before relying on the admin panel for real customer data.
