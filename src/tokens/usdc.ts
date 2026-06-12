import tokenIcon from '../img/usdc.webp';
import { RegistryAsset } from '../types';

export const asset: RegistryAsset = {
    id: "USDC",
    name: "USD Coin",
    symbol: "USDC",
    icon: tokenIcon,
    token_addresses: {
        testnet: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
        mainnet: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
    }
}
