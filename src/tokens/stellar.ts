import tokenIcon from '../img/xlm.webp';
import { RegistryAsset } from '../types';

export const asset: RegistryAsset = {
    id: "native",
    name: "stellar",
    symbol: "XLM",
    icon: tokenIcon,
    decimals: 7,
    asset_issuer: 'stellar',
    token_addresses: {
        testnet: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
        mainnet: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
    }
}
