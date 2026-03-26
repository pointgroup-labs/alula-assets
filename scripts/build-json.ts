import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'

type RegistryAsset = {
    id: string
    name: string
    symbol: string
    token_address: string
    icon: string
}

const projectRoot = process.cwd()
const tokensDir = path.join(projectRoot, 'src/tokens')
const outputDir = path.join(projectRoot, 'data')
const outputIconsDir = path.join(outputDir, 'img')
const registryBaseUrl = process.env.REGISTRY_BASE_URL?.replace(/\/$/, '')

const tokenFiles = await fg('*.ts', {
    cwd: tokensDir,
    absolute: true,
    ignore: ['index.ts']
})

const tokens = tokenFiles
    .sort((left, right) => left.localeCompare(right))
    .map(buildRegistryAsset)

fs.mkdirSync(outputIconsDir, { recursive: true })

for (const token of tokens) {
    fs.copyFileSync(token.iconSourcePath, path.join(outputIconsDir, token.iconFileName))
}

const registry = tokens.map(({ iconFileName, iconSourcePath, ...asset }) => asset)

fs.writeFileSync(
    path.join(outputDir, 'tokens.json'),
    `${JSON.stringify(registry, null, 2)}\n`
)

console.log(`Generated ${registry.length} assets in data/tokens.json`)

function buildRegistryAsset(filePath: string): RegistryAsset & {
    iconFileName: string
    iconSourcePath: string
} {
    const source = fs.readFileSync(filePath, 'utf8')
    const assetBody = getAssetBody(source, filePath)
    const iconImport = getIconImportPath(source, filePath)
    const iconSourcePath = path.resolve(path.dirname(filePath), iconImport)
    const iconFileName = path.basename(iconSourcePath)

    return {
        id: getStringProperty(assetBody, 'id', filePath),
        name: getStringProperty(assetBody, 'name', filePath),
        symbol: getStringProperty(assetBody, 'symbol', filePath),
        token_address: getStringProperty(assetBody, 'token_address', filePath),
        icon: registryBaseUrl ? `${registryBaseUrl}/img/${iconFileName}` : `/img/${iconFileName}`,
        iconFileName,
        iconSourcePath
    }
}

function getAssetBody(source: string, filePath: string): string {
    const assetMatch = source.match(/export const asset\s*(?::\s*[^=]+)?=\s*\{([\s\S]*?)\n\}/)

    if (!assetMatch) {
        throw new Error(`Unable to locate asset object in ${path.relative(projectRoot, filePath)}`)
    }

    return assetMatch[1]
}

function getIconImportPath(source: string, filePath: string): string {
    const iconMatch = source.match(/import\s+\w+\s+from\s+['"](.+\.(?:webp|png|svg|jpg|jpeg))['"];/)

    if (!iconMatch) {
        throw new Error(`Unable to locate icon import in ${path.relative(projectRoot, filePath)}`)
    }

    return iconMatch[1]
}

function getStringProperty(source: string, propertyName: string, filePath: string): string {
    const propertyMatcher = new RegExp(`${propertyName}\\s*:\\s*['\"]([^'\"]+)['\"]`)
    const propertyMatch = source.match(propertyMatcher)

    if (!propertyMatch) {
        throw new Error(`Unable to read ${propertyName} in ${path.relative(projectRoot, filePath)}`)
    }

    return propertyMatch[1]
}