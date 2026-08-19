import tokenIcon from '../img/pyusd.webp';
import { RegistryAsset } from '../types';

export const asset: RegistryAsset = {
    id: "pyusd",
    name: "PayPal USD",
    symbol: "PYUSD",
    icon: tokenIcon,
    decimals: 7,
    asset_issuer: "GDQE7IXJ4HUHV6RQHIUPRJSEZE4DRS5WY577O2FY6YQ5LVWZ7JZTU2V5",
    token_addresses: {
        mainnet: "CCCRWH6Q3FNP3I2I57BDLM5AFAT7O6OF6GKQOC6SSJNDAVRZ57SPHGU2",
    }
}
