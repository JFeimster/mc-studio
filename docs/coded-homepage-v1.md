# Coded Homepage v1 — Wix Custom Element

This branch implements the Moonshine Capital homepage as a Wix-hosted custom element so the visual experience is owned by GitHub code instead of dozens of manually positioned Wix Editor elements.

## Source

`src/public/custom-elements/moonshine-homepage.js`

Registered tag name:

`moonshine-homepage`

## One-time Wix mount

1. Run the site locally with `npm run dev`.
2. In the Wix Local Editor, open **Home**.
3. Add **Embed → Popular Embeds → Custom Element**.
4. Choose **Velo file** as the source.
5. Select `moonshine-homepage.js` from `public/custom-elements/`.
6. Enter the tag name exactly: `moonshine-homepage`.
7. Stretch the custom element to the full content width.
8. Give the element the Wix ID `moonshineHomepage`.
9. Make the element tall enough to display the full coded homepage during this first visual test. The component itself is responsive; the Wix host box still defines its available viewport.

## Visual test goal

Judge the coded component itself — typography, density, hierarchy, responsiveness, command UI, cards, tools section, agency pivot, and overall brand feel.

Do not spend time polishing the old Wix homepage underneath it during this experiment.

## Event contract

The component emits:

- `moonshine-intent` with `{ intent, routeKey }`
- `moonshine-route` with `{ routeKey, intent, surface }`

After the visual mount is approved, `Home.d9gz2.js` should listen to those events from `#moonshineHomepage` and connect them to the existing `SiteRoutes`, session-state, navigation, and analytics modules.

## SEO decision gate

This custom-element build is first a visual/UX proof. If the result is good enough to keep on Wix, add explicit page SEO/structured data and preserve important indexable native content where appropriate.

If the result still feels constrained by Wix, move the public frontend to a server-rendered/static-rendered Vercel application and keep Wix for Blog, Contacts, Forms, Events, Bookings, Members, CMS, and business data. Preserve existing URLs or issue 301 redirects during that migration.
