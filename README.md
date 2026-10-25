# Digital Ganesh consultation landing page

A focused Next.js landing page and Thank You page for the Digital Ganesh free marketing consultation.

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and add a direct video, Vimeo, or YouTube URL plus a digits-only WhatsApp number, including country code.
3. Run `npm run dev`.
4. Open the local URL printed in the terminal.

## Vercel deployment

1. Push this project to a Git repository and import it in Vercel.
2. Add `NEXT_PUBLIC_VIDEO_URL` and `NEXT_PUBLIC_WHATSAPP_NUMBER` in Project Settings → Environment Variables.
3. Deploy. Vercel will detect Next.js and use the standard build settings.

## Pre-launch checklist

- [ ] Replace the logo with an optimized transparent-background version if an approved master asset is available.
- [ ] Review or replace `public/og-image.jpg`.
- [ ] Replace the simulated `submitLead` function with a real backend, email service, Google Sheets integration, or CRM.
- [ ] Set and test the final video URL.
- [ ] Set and test the digits-only WhatsApp number with country code.
- [ ] Test successful and invalid form submissions.
- [ ] Test the layout at 320px, 375px, 390px, and 430px.
- [ ] Add and verify analytics and Meta Pixel if they are introduced later.
