# IronConverter

A barbell plate loading visualizer for lifters who train in both metric (Eleiko KGS) and commercial imperial (LBS) gyms.

Enter a target weight in either unit and instantly see the exact plate configuration for both standards, side by side.

## Features

- Synced KGS / LBS inputs — editing one updates the other
- Eleiko color-coded bumper plates (IWF standard)
- Commercial iron plates (Black / Dark Grey)
- Men's 20 kg / Women's 15 kg / Iron 45 lb bar selector
- Rounded-down and rounded-up configurations with a visual bounds track
- Per-side inventory toggles — disable plates you don't have

---

## Project Structure

```
src/
  utils/
    constants.ts        # Plate inventories, bar weights, colors, dimensions
    conversion.ts       # kg <-> lb math, rounding helpers
    loading.ts          # Greedy plate algorithm + bounds (round-down / round-up)
  components/
    Plate.tsx           # Single plate visual (Eleiko or Iron)
    Sleeve.tsx          # Half-barbell sleeve with stacked plates
    BarSelector.tsx     # Men's / Women's / Iron bar toggle
    WeightInput.tsx     # Synced numeric input (kg or lb)
    InfoPanel.tsx       # Achievable weight, exact value, bounds + toggle
    BoundsTrack.tsx     # Visual range track (↓ exact ↑)
    InventoryToggles.tsx # Collapsible per-side plate enable/disable
  test/
    conversion.test.ts
    loading.test.ts
    Plate.test.tsx
    Sleeve.test.tsx
    BarSelector.test.tsx
    WeightInput.test.tsx
    BoundsTrack.test.tsx
    InventoryToggles.test.tsx
  App.tsx
  main.tsx
  index.css
```

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type-check
npx tsc --noEmit

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Deploying on Render

1. Push your repository to GitHub.
2. Go to [render.com](https://render.com) and create a **New Static Site**.
3. Connect your GitHub repository.
4. Set the following:

| Setting | Value |
|---|---|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

5. Click **Create Static Site**. Render will build and deploy automatically on every push to `main`.

> No environment variables are required — this is a fully client-side app.

---

## Tech Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) — build tool
- [Tailwind CSS v3](https://tailwindcss.com) — styling
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) — tests
