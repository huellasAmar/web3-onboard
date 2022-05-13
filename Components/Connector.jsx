import { useState } from "react";
import styles from "./Connector.module.scss";
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

const Connector = () => {
    const [_, setProvider] = useState();
    const [account, setAccount] = useState();
    const [error, setError] = useState("");
    const [chainId, setChainId] = useState();
    const [network, setNetwork] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const connectWallet = async () => {
        try {
            const wallets = await onboard.connectWallet();
            setIsLoading(true);
            const { accounts, chains, provider } = wallets[0];
            setAccount(accounts[0].address);
            setChainId(chains[0].id);
            setProvider(provider);
            setIsLoading(false);
        } catch (error) {
            setError(error);
        }
    }

    const refreshState = () => {
        setAccount("");
        setChainId("");
        setProvider();
    };

    const disconnectWallet = async () => {
        const [primaryWallet] = await onboard.state.get().wallets;
        if (!primaryWallet) return;
        await onboard.disconnectWallet({ label: primaryWallet.label });
        refreshState();
    };
    
    return (
        <div>
            {!account ? (
                <button className={styles.btn} onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <button className={styles.btn} onClick={disconnectWallet}>Disconnect Wallet</button>
            )}
        </div>
    )
}

export default Connector;