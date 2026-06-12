import tokenIcon from '../img/eurc.webp';
import { RegistryAsset } from '../types';

export const asset: RegistryAsset = {
    id: "eurc",
    name: "EUR Coin",
    symbol: "EURC",
    icon: tokenIcon,
    token_addresses: {
        testnet: "CCUUDM434BMZMYWYDITHFXHDMIVTGGD6T2I5UKNX5BSLXLW7HVR4MCGZ",
        mainnet: "CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
    }
}
