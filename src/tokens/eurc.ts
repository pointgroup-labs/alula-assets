import tokenIcon from '../img/eurc.webp';
import { RegistryAsset } from '../types';

export const asset: RegistryAsset = {
    id: "eurc",
    name: "EUR Coin",
    symbol: "EURC",
    icon: tokenIcon,
    decimals: 7,
    asset_issuer: 'GB3Q6QDZYTHWT7E5PVS3W7FUT5GVAFC5KSZFFLPU25GO7VTC3NM2ZTVO',
    token_addresses: {
        testnet: "CCUUDM434BMZMYWYDITHFXHDMIVTGGD6T2I5UKNX5BSLXLW7HVR4MCGZ",
        mainnet: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
    }
}
