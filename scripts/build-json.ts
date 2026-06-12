import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'

type Network = 'testnet' | 'mainnet'

type RegistryAsset = {
  id: string
  name: string
  symbol: string
  icon: string
  token_addresses: Partial<Record<Network, string>>
}

type BuildRegistryAsset = RegistryAsset & {
  iconFileName: string
  iconSourcePath: string
}

const projectRoot = process.cwd()
const tokensDir = path.join(projectRoot, 'src/tokens')
const outputDir = path.join(projectRoot, 'data')
const outputIconsDir = path.join(outputDir, 'img')
const registryBaseUrl = process.env.REGISTRY_BASE_URL?.replace(/\/$/, '')

const tokenFiles = await fg('*.ts', {
  cwd: tokensDir,
  absolute: true,
  ignore: ['index.ts'],
})

const tokens = tokenFiles
  .sort((left, right) => left.localeCompare(right))
  .map(buildRegistryAsset)

validateTokens(tokens)

fs.mkdirSync(outputIconsDir, { recursive: true })

for (const token of tokens) {
  fs.copyFileSync(
    token.iconSourcePath,
    path.join(outputIconsDir, token.iconFileName),
  )
}

const registry = tokens.map(({ iconFileName, iconSourcePath, ...asset }) => asset)

fs.writeFileSync(
  path.join(outputDir, 'tokens.json'),
  `${JSON.stringify(registry, null, 2)}\n`,
)

console.log(`Generated ${registry.length} assets in data/tokens.json`)

function buildRegistryAsset(filePath: string): BuildRegistryAsset {
  const source = fs.readFileSync(filePath, 'utf8')

  const assetBody = getExportedObjectBody(source, 'asset', filePath)
  const iconImport = getIconImportPath(source, filePath)

  const iconSourcePath = path.resolve(path.dirname(filePath), iconImport)
  const iconFileName = path.basename(iconSourcePath)

  const tokenAddressesBody = getObjectPropertyBody(
    assetBody,
    'token_addresses',
    filePath,
  )

  const tokenAddresses: RegistryAsset['token_addresses'] = {
    testnet: getOptionalStringProperty(tokenAddressesBody, 'testnet'),
    mainnet: getOptionalStringProperty(tokenAddressesBody, 'mainnet'),
  }

  return {
    id: getStringProperty(assetBody, 'id', filePath),
    name: getStringProperty(assetBody, 'name', filePath),
    symbol: getStringProperty(assetBody, 'symbol', filePath),
    icon: registryBaseUrl
      ? `${registryBaseUrl}/img/${iconFileName}`
      : `/img/${iconFileName}`,
    token_addresses: removeEmptyValues(tokenAddresses),
    iconFileName,
    iconSourcePath,
  }
}

function getExportedObjectBody(
  source: string,
  exportName: string,
  filePath: string,
): string {
  const exportMatch = source.match(
    new RegExp(`export\\s+const\\s+${exportName}\\s*(?::\\s*[^=]+)?=\\s*\\{`),
  )

  if (!exportMatch || exportMatch.index === undefined) {
    throw new Error(
      `Unable to locate "${exportName}" object in ${path.relative(projectRoot, filePath)}`,
    )
  }

  const objectStartIndex = source.indexOf('{', exportMatch.index)

  return getBodyByOpeningBrace(source, objectStartIndex, filePath)
}

function getObjectPropertyBody(
  source: string,
  propertyName: string,
  filePath: string,
): string {
  const propertyMatch = source.match(
    new RegExp(`${propertyName}\\s*:\\s*\\{`),
  )

  if (!propertyMatch || propertyMatch.index === undefined) {
    throw new Error(
      `Unable to locate "${propertyName}" object in ${path.relative(projectRoot, filePath)}`,
    )
  }

  const objectStartIndex = source.indexOf('{', propertyMatch.index)

  return getBodyByOpeningBrace(source, objectStartIndex, filePath)
}

function getBodyByOpeningBrace(
  source: string,
  openingBraceIndex: number,
  filePath: string,
): string {
  let depth = 0

  for (let index = openingBraceIndex; index < source.length; index++) {
    const char = source[index]

    if (char === '{') {
      depth++
    }

    if (char === '}') {
      depth--

      if (depth === 0) {
        return source.slice(openingBraceIndex + 1, index)
      }
    }
  }

  throw new Error(
    `Unable to parse object braces in ${path.relative(projectRoot, filePath)}`,
  )
}

function getIconImportPath(source: string, filePath: string): string {
  const iconMatch = source.match(
    /import\s+\w+\s+from\s+['"](.+\.(?:webp|png|svg|jpg|jpeg))['"];?/,
  )

  if (!iconMatch) {
    throw new Error(
      `Unable to locate icon import in ${path.relative(projectRoot, filePath)}`,
    )
  }

  return iconMatch[1]
}

function getStringProperty(
  source: string,
  propertyName: string,
  filePath: string,
): string {
  const value = getOptionalStringProperty(source, propertyName)

  if (!value) {
    throw new Error(
      `Unable to read "${propertyName}" in ${path.relative(projectRoot, filePath)}`,
    )
  }

  return value
}

function getOptionalStringProperty(
  source: string,
  propertyName: string,
): string | undefined {
  const propertyMatcher = new RegExp(
    `${propertyName}\\s*:\\s*['"]([^'"]+)['"]`,
  )

  return source.match(propertyMatcher)?.[1]
}

function removeEmptyValues<T extends Record<string, string | undefined>>(
  object: T,
): Partial<Record<keyof T, string>> {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => Boolean(value)),
  ) as Partial<Record<keyof T, string>>
}

function validateTokens(tokens: BuildRegistryAsset[]) {
  const ids = new Set<string>()
  const addresses = new Set<string>()

  for (const token of tokens) {
    if (ids.has(token.id)) {
      throw new Error(`Duplicate asset id: ${token.id}`)
    }

    ids.add(token.id)

    if (!Object.keys(token.token_addresses).length) {
      throw new Error(`Asset "${token.id}" has no token addresses`)
    }

    for (const [network, address] of Object.entries(token.token_addresses)) {
      if (!address) {
        continue
      }

      if (!/^C[A-Z2-7]{55}$/.test(address)) {
        throw new Error(
          `Invalid ${network} token address for "${token.id}": ${address}`,
        )
      }

      const addressKey = `${network}:${address}`

      if (addresses.has(addressKey)) {
        throw new Error(
          `Duplicate ${network} token address: ${address}`,
        )
      }

      addresses.add(addressKey)
    }

    if (!fs.existsSync(token.iconSourcePath)) {
      throw new Error(
        `Icon not found for "${token.id}": ${path.relative(projectRoot, token.iconSourcePath)}`,
      )
    }
  }
}