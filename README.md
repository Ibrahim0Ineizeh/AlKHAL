# الخال (Alkhal) — 3D menu

A responsive, view-only menu with Latte and Turkish coffee. Customers scan a printed QR code, open the website, and rotate the cup previews. No ordering, payments, accounts, or backend.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL shown in the terminal. On a phone connected to the same Wi-Fi, use the displayed **Network** URL. `localhost` on a phone refers to the phone, not your computer.

```sh
npm run build
npm run preview
```

## Edit the menu

Edit `src/menu.ts`. It holds the shop name, categories, Arabic and English drink names, descriptions, prices, currency, and model URL for each drink. Set each drink's `category` to `coffee`, `soft-drinks`, or `cold-drinks`. Soft drinks and Cold drinks currently show an empty state until items are added.

- The shop name is **الخال**. The supplied Alkhal logo is saved in `public/alkhal-logo.png`.
- **JOD (Jordanian dinar) is the starting currency assumption.** Change `currency` and `locale` if a different dinar is intended.
- **3.50 JOD for Latte and 2.00 JOD for Turkish coffee are sample prices**, not confirmed prices. Replace them and set `shop.isDemo` to `false` before using the menu with customers.
- Both drinks currently use the supplied `models/CoffeCup.glb`. It is a generic takeaway cup; it does not depict a specific latte or traditional Turkish serving. Each card says it is a cup preview.
- To use distinct models, add the new `.glb` files under `models`, import each with `?url`, and set the corresponding drink's `model`, `modelAlt`, and `modelNote`. Vite gives the model a versioned asset URL when building.
- The plant, robot, and snowman are preserved in `models/` and are not included in the website bundle.

The Arabic font is bundled locally. Menu information loads independently of the 3D library. The viewers support horizontal touch dragging, vertical page scrolling, keyboard controls, reset, reduced-motion preferences, and a failure state that keeps names/prices visible. Cups stay still until the customer rotates them; there are no play/pause controls or automatic rotation.

## Deploy to Vercel

The project includes `vercel.json` for a static Vite deployment. No environment variables or database are needed.

1. Confirm the prices and replace the shared preview model if desired.
2. Push the project to your Git provider and import it in Vercel, or run `npx vercel` in this folder and sign in.
3. Use **Vite** as the framework, **npm run build** as the build command, and **dist** as the output directory. These are already set in `vercel.json`.
4. Publish to production (with the CLI: `npx vercel --prod`).
5. Open the production URL on a phone and check both models and prices before printing the QR code. Ensure customers can open it without Vercel authentication.

Official deployment reference: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Create the printed QR code

After publishing, use the stable production domain (or your own custom domain):

```sh
npm run qr -- https://your-menu.vercel.app
```

This creates `qr/khal-menu-qr.svg` for print, `qr/khal-menu-qr.png` for general use, and `qr/destination.txt` with the encoded destination. Use your real deployed URL, not the example above. The generator requires HTTPS and rejects credentials in the URL. Print the code with its white border intact and test it on a phone. Keeping the same production domain lets you update the menu without reprinting codes.

3D component reference: [model-viewer camera and touch controls](https://modelviewer.dev/examples/staging-and-camera-control.html).
