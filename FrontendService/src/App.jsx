import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Vault from "./pages/Vault";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { InjectedConnector } from '@web3-react/injected-connector';

function App() {
  let [loading, setLoading] = useState(true);

  const { account, active, chainId, activate, deactivate } = useWeb3React();

  const chainID = 97
  const blockExplorer = 'https://testnet.bscscan.com/'
  const rpc = 'https://data-seed-prebsc-1-s3.bnbchain.org:8545'
  const networkName = "BSC Testnet"

  const injectedConnector = new InjectedConnector({
    supportedChainIds: [chainID]
  });

  const handleConnectWallet = async () => {
    try {
      if (window.ethereum) {
        if (chainId !== chainID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${Number(chainID).toString(16)}` }],
            });
            await activate(injectedConnector);

            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });
            console.log("accounts", accounts);
            sessionStorage.setItem("isWalletConnected", true);
          } catch (err) {
            if (err.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: `0x${Number(chainID).toString(16)}`,
                      chainName: `${networkName}`,
                      nativeCurrency: {
                        name: `${networkName}`,
                        symbol: "BNB",
                        decimals: 18,
                      },
                      rpcUrls: [`${rpc}`],
                      blockExplorerUrls: [`${blockExplorer}`],
                    },
                  ],
                });
              } catch (err) {
                console.log("ErrorMetamask", err);
              }
            }
          }
        }
      }
    } catch (err) {
      toast.warning("Please Connect Wallet sss", {
        position: "top-center",
        theme: "colored",
        style: { background: "#fcdb7b" },
      });
      console.log(err);
    }
  };

  const handleDisconnectWallet = () => {
    if (active) {
      deactivate(injectedConnector);
      sessionStorage.setItem("isWalletConnected", false);
    }
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (sessionStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injectedConnector);
          sessionStorage.setItem("isWalletConnected", true);
        } catch (ex) {
          console.log(ex, "errorex:");
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    };

    connectWalletOnPageLoad();
  }, [activate]);

  console.log("defaultAddress1", account)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Vault
            defaultAddress={account}
            connectWallet={handleConnectWallet}
            disconnectWallet={handleDisconnectWallet}
            active={active}
          />
        }
      />
    </Routes>
  );
}

export default App;
