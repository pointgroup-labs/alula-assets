import tokenIcon from '../img/stellar.webp';
import { RegistryAsset } from '../types';

export const asset: RegistryAsset = {
    id: "native",
    name: "stellar",
    symbol: "XLM",
    icon: tokenIcon,
    token_addresses: {
        testnet: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
        mainnet: "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
    }
}
