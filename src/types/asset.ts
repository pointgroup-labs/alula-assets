export type RegistryAsset = {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    token_addresses: {
        testnet: string;
        mainnet: string;
    };
}