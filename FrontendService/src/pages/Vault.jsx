import { useState } from "react";
import Web3 from "web3";
import { ToastContainer, toast } from "react-toastify";

function Vault({ defaultAddress, active, connectWallet, disconnectWallet }) {
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [bnbAmount, setBnbAmount] = useState("0.01");

  const withdraw = async (value) => {
    if (!active) {
      alert("Please Connect Wallet to continue ... ");
      return false;
    }
    if (value <= 0) {
      alert("Please Enter the amount to continue ... ");
      return false;
    }
    setLoadingWithdraw(true); // Start loading for withdraw
    try {
      window.web3 = new Web3(window.web3.currentProvider);

      // Initialize claimContract with ABI and address
      const claimContract = new window.web3.eth.Contract(
        JSON.parse(import.meta.env.VITE_APP_CLAIM_ABI),
        import.meta.env.VITE_APP_CLAIM_ADDRESS
      );
      // Get the allowed amount from the contract
      // const AllowedAmount = BigInt(
      //   await claimContract.methods.balances(defaultAddress).call()
      // );
      //console.log("AllowedAmount", AllowedAmount)
      // if (value * 10 ** 18 > AllowedAmount) {
      //   toast.error("Amount greater than claimable amount ", {
      //     position: "top-center",
      //   });
      //   setLoadingWithdraw(false);
      // } else {
        const withdrawAmount = window.web3.utils.toWei(value, "ether"); //value;
        // Fetch the current gas price
        console.log("withdrawAmount", withdrawAmount)
        const gasPrice = await window.web3.eth.getGasPrice();
        // Estimate the gas required for the withdraw transaction
        try {
          const estimatedGas = await claimContract.methods
            .withdraw(withdrawAmount)
            .estimateGas({
              from: defaultAddress,
            });
          console.log("Estimated Gas:", estimatedGas);

          // Execute the withdraw transaction using the estimated gas and legacy transaction format
          const sendTransaction = await claimContract.methods
            .withdraw(withdrawAmount)
            .send({
              from: defaultAddress,
              gasPrice: gasPrice, // Using legacy gas price mechanism
              gas: estimatedGas, // Using the estimated gas value
            });
          if (sendTransaction) {
            console.log("sendTransaction", sendTransaction);
            toast.success("Successfully Claimed", {
              position: "top-center",
              theme: "colored",
              style: { background: "#006B57" },
            });
            setLoadingWithdraw(false); // Stop loading for withdraw
          } else {
            toast.error("Transaction Failed", {
              position: "top-center",
            });
            setLoadingWithdraw(false); // Stop loading for withdraw
          }
        } catch (error) {
          console.log("Error:", error);
          let errorMessage = "An unexpected error occurred.";
          if (error?.data?.message) {
            if (error.data.message.includes("Not admin")) {
              errorMessage =
                "Only the admin can claim funds. Please ensure you select the admin address.";
            } else {
              errorMessage = error.data.message; // Use the original error message if it's more relevant
            }
          }
          toast.error(errorMessage, {
            position: "top-center",
          });
          setLoadingWithdraw(false); // Stop loading for withdraw
        }
     // }
    } catch (error) {
      console.log("error", error);
      setLoadingWithdraw(false); // Stop loading for withdraw
      console.error("Error :", error);
    }
  };

  const depositBNB = async (value) => {
    if (!active) {
      alert("Please Connect Wallet to continue...");
      return false;
    }
    if (value <= 0) {
      alert("Please Enter the amount to continue...");
      return false;
    }

    setLoadingDeposit(true); // Start loading for deposit
    try {
      // Set up Web3 instance and contract
      const web3 = new Web3(window.web3.currentProvider);
      const claimContract = new web3.eth.Contract(
        JSON.parse(import.meta.env.VITE_APP_CLAIM_ABI),
        import.meta.env.VITE_APP_CLAIM_ADDRESS
      );

      // Convert the value to Wei
      const depositAmount = web3.utils.toWei(value, "ether");

      // Get the current gas price
      const gasPrice = await web3.eth.getGasPrice();

      // Estimate gas for the deposit transaction, including the value parameter
      const estimatedGas = await claimContract.methods
        .deposit()
        .estimateGas({
          from: defaultAddress,
          value: depositAmount, // Include the value in Wei here
        });

      // Execute the deposit transaction
      const sendTransaction = await claimContract.methods
        .deposit()
        .send({
          from: defaultAddress,
          value: depositAmount, // Include the value in Wei here
          gasPrice: gasPrice,
          gas: estimatedGas,
        });

      if (sendTransaction) {
        toast.success("Successfully Deposited", {
          position: "top-center",
          theme: "colored",
          style: { background: "#006B57" },
        });
        setLoadingDeposit(false); // Stop loading for deposit
      } else {
        toast.error("Transaction Failed", { position: "top-center" });
        setLoadingDeposit(false); // Stop loading for deposit
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("An unexpected error occurred.", { position: "top-center" });
      setLoadingDeposit(false); // Stop loading for deposit
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="relative w-full h-[100vh]">
        <div className="absolute w-full h-full top-0 flex items-center justify-center bg-[#090909c9]">
          <div className="bg-gray-800 p-6 rounded shadow-lg">
            <h4 className="text-theme text-center mb-4">Welcome to Simple Vault Contract</h4>
            <div className="flex items-center justify-between mb-4">
              {active ? (
                <button onClick={disconnectWallet} className="bg-theme-secondary text-white px-4 py-2 rounded">
                  Disconnect
                </button>
              ) : (
                <button onClick={connectWallet} className="bg-theme-secondary text-white px-4 py-2 rounded">
                  Connect Wallet
                </button>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1">Your Connected Wallet</label>
              <input
                type="text"
                value={defaultAddress}
                disabled
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-1">Enter BNB Amount to Deposit:</label>
              <input
                type="number"
                placeholder="Enter the Amount of BNB"
                value={bnbAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0 || e.target.value === "") {
                    setBnbAmount(e.target.value);
                  }
                }}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
              <button
                onClick={() => depositBNB(bnbAmount)}
                disabled={loadingDeposit}
                className="mt-2 bg-theme-secondary text-white px-4 py-2 rounded w-full"
              >
                {loadingDeposit ? "Processing..." : "Deposit"}
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-white mb-1">Enter BNB Amount to Withdraw:</label>
              <input
                type="number"
                placeholder="Enter the Amount of BNB"
                value={bnbAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value > 0 || e.target.value === "") {
                    setBnbAmount(e.target.value);
                  }
                }}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
              <button
                onClick={() => withdraw(bnbAmount)}
                disabled={loadingWithdraw}
                className="mt-2 bg-theme-secondary text-white px-4 py-2 rounded w-full"
              >
                {loadingWithdraw ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Vault;
