# Alula Registry

Static token registry for Alula DeFi.

This repository stores token metadata and token icons, then generates a static JSON registry that can be served from GitHub Pages, a CDN, or any static hosting provider.

## What It Does

* Stores token definitions in TypeScript files under `src/tokens`
* Stores source token icons under `src/img`
* Copies token icons into `data/img`
* Generates `data/token-list.json`
* Supports both `testnet` and `mainnet` token addresses
* Uses `/img/...` icon paths by default
* Supports absolute icon URLs with `REGISTRY_BASE_URL`

## Registry Output

Each generated asset has this shape:

```json
{
  "id": "aqua",
  "name": "AQUA",
  "symbol": "AQUA",
  "decimals": 7,
  "icon": "/img/aqua.webp",
  "token_addresses": {
    "testnet": "CDNVQW44C3HALYNVQ4SOBXY5EWYTGVYXX6JPESOLQDABJI5FC5LTRRUE",
    "mainnet": "CAUIKL3IYGMERDRUN6YSCLWVAKIFG5Q4YJHUKM4S4NJZQIA3BAS6OJPK"
  }
}
```

Generated files:

```text
data/
  token-list.json
  img/
    *.webp
    *.png
    *.svg
    *.jpg
    *.jpeg
```

## Project Structure

```text
src/
  img/          # source token icons
  tokens/       # token definitions
  types/        # shared registry types

scripts/
  build-json.ts # static registry generator

data/
  token-list.json   # generated registry output
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

Or run the registry generator directly:

```bash
pnpm build:registry
```

## Add a New Token

1. Add the token icon to `src/img`
2. Create a new token file in `src/tokens`
3. Export an `asset` object
4. Run `pnpm build`
5. Commit both the source token file and the generated `data/` output

Example:

```ts
import tokenIcon from '../img/example.webp'
import { RegistryAsset } from '../types'

export const asset: RegistryAsset = {
  id: 'example',
  name: 'Example Token',
  symbol: 'EXM',
  decimals: 7,
  icon: tokenIcon,
  token_addresses: {
    testnet: 'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    mainnet: 'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
}
```

After the build, the token is automatically included in `data/token-list.json`.

## Token Addresses

The `token_addresses` field should contain Soroban token contract addresses.

These addresses usually start with `C`.

```ts
token_addresses: {
  testnet: 'C...',
  mainnet: 'C...',
}
```

Do not put classic Stellar issuer addresses directly into `token_addresses`.

For example, this is an issuer address:

```text
GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
```

This should not be used as `token_addresses.mainnet`.

Instead, use the corresponding Soroban Asset Contract address:

```text
CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75
```

## Decimals

For Stellar classic assets wrapped through SAC, use:

```ts
decimals: 7
```

This applies to common Stellar assets such as USDC, EURC, AQUA, and XLM SAC tokens.

For custom Soroban tokens, call the token contract `decimals()` method and use the returned value.

## Public Hosting

This repository is designed to be served as static content.

Typical setup:

* publish `data/token-list.json`
* publish `data/img/*`
* fetch the registry from your frontend

Example fetch:

```ts
const response = await fetch('https://your-domain.com/token-list.json')
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

Without `REGISTRY_BASE_URL`, icons are generated as relative public paths:

```text
/img/aqua.webp
```

## Frontend Usage

The frontend can load the registry once and use it to match token contract addresses with metadata.

Example:

```ts
type TokenItem = {
  id: string
  name: string
  symbol: string
  decimals: number
  icon: string
  token_addresses: {
    testnet?: string
    mainnet?: string
  }
}

const response = await fetch('/token-list.json')
const tokens = await response.json() as TokenItem[]
```

To find a token by address:

```ts
function getTokenByAddress(tokens: TokenItem[], address: string) {
  return tokens.find(token =>
    token.token_addresses.testnet === address ||
    token.token_addresses.mainnet === address
  )
}
```

## Notes

* Token files under `src/tokens` are the source of truth
* `data/` is generated output
* The build script scans every `src/tokens/*.ts` file automatically
* `src/tokens/index.ts` is ignored by the build script
* No manual registry index maintenance is required
* Token icons are copied automatically during the build
* Token addresses must be Soroban contract addresses, not issuer addresses
