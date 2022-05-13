import { ConnectorCtxProvide } from '../store/connector-context'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <ConnectorCtxProvide>
    <Component {...pageProps} />
  </ConnectorCtxProvide>
}

export default MyApp
