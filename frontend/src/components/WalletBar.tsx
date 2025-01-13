"use client";

// WalletBar.tsx
import { useState } from "react";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { WalletModal } from "./WalletModal";

const WalletBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      {!address ? (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-greenish-500 hover:bg-greenish-300 text-white text-center font-semibold rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
          <WalletModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </>
      ) : (
        <div className="flex items-center gap-2">
          <div className="text-base font-medium px-4 py-2 bg-greenish-500 text-white rounded-lg">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-greenish-500 text-center hover:bg-greenish-300 text-white font-semibold rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </>
  );
};

export default WalletBar;
