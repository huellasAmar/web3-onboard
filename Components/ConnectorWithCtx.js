import { useContext } from "react";
import ConnectorCtx from "../store/connector-context";
import styles from "./Connector.module.scss";

const ConnectorWithCtx = () => {
    const web3Ctx = useContext(ConnectorCtx);
    // console.log(web3Ctx);

    const connectWallet = () => web3Ctx.connectWallet();
    const disconnectWallet = () => {}

    return (
        <div>
            {!web3Ctx.account ? (
                <button className={styles.btn} onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <button className={styles.btn} onClick={disconnectWallet}>Disconnect Wallet</button>
            )}
        </div>
    )
}

export default ConnectorWithCtx