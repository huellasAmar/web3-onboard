import { createContext, useState } from "react";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import walletLinkModule from "@web3-onboard/walletlink";

const MAINNET_RPC_URL = "https://rpc.ankr.com/eth";
const ROPSTEN_RPC_URL = "https://rpc.ankr.com/eth_ropsten";
const RINKEBY_RPC_URL = "https://rpc.ankr.com/eth_rinkeby";

const injected = injectedModule();
const walletConnect = walletConnectModule();
const walletLink = walletLinkModule();

const onboard = Onboard({
    wallets: [walletLink, walletConnect, injected],
    chains: [
        {
            id: "0x1", // chain ID must be in hexadecimel
            token: "ETH", // main chain token
            namespace: "evm",
            label: "Ethereum Mainnet",
            rpcUrl: MAINNET_RPC_URL
        }, {
            id: "0x3",
            token: "tROP",
            namespace: "evm",
            label: "Ethereum Ropsten Testnet",
            rpcUrl: ROPSTEN_RPC_URL
        }, {
            id: "0x4",
            token: "rETH",
            namespace: "evm",
            label: "Ethereum Rinkeby Testnet",
            rpcUrl: RINKEBY_RPC_URL
        }
    ],
    appMetadata: {
        name: "Web3.0 Connect With Wallet",
        icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        description: "My app using Onboard",
        recommendedInjectedWallets: [
            { name: "Coinbase", url: "https://wallet.coinbase.com/" },
            { name: "MetaMask", url: "https://metamask.io" }
        ]
    }
});

const ConnectorCtx = createContext({
    provider: '',
    account: '',
    error: '',
    chainId: '',
    network: '',
    isLoading: '',
    connectWallet: () => {},
    // disconnectWallet: () => {},
})

export const ConnectorCtxProvide = (props) => {
    const [providerCtx, setProviderCtx] = useState();
    const [accoutCtx, setAccoutCtx] = useState();
    const [errorCtx, setErrorCtx] = useState("");
    const [chainIdCtx, setChainIdCtx] = useState();
    const [networkCtx, setNetworkCtx] = useState();
    const [isLoadingCtx, setIsLoadingCtx] = useState(false);

    const connectWalletHandler = async () => {
        try {
            const wallets = await onboard.connectWallet();
            setIsLoadingCtx(true);
            const { accounts, chains, provider } = wallets[0];
            setAccoutCtx(accounts[0].address);
            setChainIdCtx(chains[0].id);
            setProviderCtx(provider);
            setIsLoadingCtx(false);
            console.log(wallets);
        } catch (error) {
            setErrorCtx(error);
            console.log(error);
            console.log(error.message);
        }
    }
    
    const contextValue = {
        provider: providerCtx,
        account: accoutCtx,
        error: errorCtx,
        chainId: chainIdCtx,
        network: networkCtx,
        isLoading: isLoadingCtx,
        connectWallet: connectWalletHandler
    }
    return <ConnectorCtx.Provider value={contextValue}>
        {props.children}
    </ConnectorCtx.Provider>
}

export default ConnectorCtx;