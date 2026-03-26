# Alula Registry

Static token registry for Alula DeFi.

This repository stores token definitions and generates a static JSON registry plus token icons that can be served directly from GitHub Pages, a CDN, or any static hosting provider.

## What It Does

- Keeps token metadata in simple TypeScript files under `src/tokens`
- Copies token icons into `data/img`
- Generates `data/tokens.json`
- Produces icon paths in `/img/...` format by default
- Supports absolute icon URLs with `REGISTRY_BASE_URL`

## Registry Output

Each generated asset has this shape:

```json
{
  "id": "aqua",
  "name": "AQUA",
  "symbol": "AQUA",
  "token_address": "GAHPYWLK6YRN7CVYZOO4H3VDRZ7PVF5UJGLZCSPAEIKJE2XSWF5LAGER",
  "icon": "/img/aqua.webp"
}
```

Generated files:

- `data/tokens.json`
- `data/img/*`

## Project Structure

```text
src/
  img/          # source token icons
  tokens/       # token definitions
  types/        # shared registry types
scripts/
  build-json.ts # static registry generator
data/
  tokens.json   # generated registry output
  img/          # generated icons for public serving
```

## Installation

```bash
pnpm install
```

## Build

Generate the static registry:

```bash
pnpm build
```

Or run the generator directly:

```bash
pnpm build:registry
```

## Add a New Token

1. Add the icon file to `src/img`
2. Create a new token file in `src/tokens`
3. Export an `asset` object
4. Run `pnpm build`

Example:

```ts
import tokenIcon from '../img/example.webp';
import { RegistryAsset } from '../types';

export const asset: RegistryAsset = {
    id: 'example',
    name: 'Example Token',
    symbol: 'EXM',
    icon: tokenIcon,
    token_address: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
}
```

After the build, the token is automatically included in `data/tokens.json`.

## Public Hosting

This repository is designed to be served as static content.

Typical setup:

- publish `data/tokens.json`
- publish `data/img/*`
- fetch the registry from your frontend

Example fetch:

```ts
const response = await fetch('https://your-domain.com/tokens.json')
const tokens = await response.json()
```

If your public files are served from a known base URL, build with:

```bash
REGISTRY_BASE_URL=https://your-domain.com pnpm build
```

That will generate absolute icon URLs like:

```text
https://your-domain.com/img/aqua.webp
```

## Frontend Usage

Your frontend only needs to:

1. request the registry JSON
2. render token metadata
3. use the `icon` field directly in image tags

## Notes

- Token files are the source of truth
- `data/` is generated output
- The build script scans every `src/tokens/*.ts` file automatically
- No manual registry index maintenance is required