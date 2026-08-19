export type RegistryAsset = {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    asset_issuer?: string;
    token_addresses: {
        testnet?: string;
        mainnet: string;
    };
}