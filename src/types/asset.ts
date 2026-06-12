export type RegistryAsset = {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    token_addresses: {
        testnet: string;
        mainnet: string;
    };
}