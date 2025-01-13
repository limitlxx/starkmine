"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useConnect } from "@starknet-react/core";
import { X } from "lucide-react";
import Image from "next/image";

interface WalletModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const walletIcons = {
  argentX: "/public/argent.svg",
  braavos: "/public/braavos.svg",
};

export function WalletModal({ isOpen, setIsOpen }: WalletModalProps) {
  const { connect, connectors } = useConnect();

  const getWalletDetails = (id: string) => {
    switch (id) {
      case "argentX":
        return {
          name: "Argent X",
          icon: walletIcons.argentX,
        };
      case "braavos":
        return {
          name: "Braavos",
          icon: walletIcons.braavos,
        };
      default:
        return {
          name: id,
          icon: walletIcons.braavos, // fallback icon
        };
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-[#1c1c1c] p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-white"
                  >
                    Connect a Wallet
                  </Dialog.Title>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg text-white mb-4">Popular</h4>
                    <div className="space-y-3">
                      {connectors.map((connector) => {
                        const walletDetails = getWalletDetails(connector.id);
                        return (
                          <button
                            key={connector.id}
                            onClick={() => {
                              connect({ connector });
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-4 rounded-lg
                              bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={walletDetails.icon}
                                  alt={walletDetails.name}
                                  width={32}
                                  height={32}
                                  className="rounded-md"
                                />
                              </div>
                              <span className="text-white font-medium">
                                {walletDetails.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* <div className="border-t border-[#2c2c2c] pt-6">
                    <h4 className="text-lg text-white mb-4">
                      What is a wallet?
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-center items-center gap-4">
                        <div className="relative">
                          <Image
                            src={walletIcons.modal1}
                            alt="Digital Assets"
                            width={50}
                            height={40}
                            className="rounded-md border border-white"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-medium mb-2">
                            A home for your digital assets
                          </h5>
                          <p className="text-gray-400 text-sm">
                            Wallets are used to send, receive, store, and
                            display digital assets like Ethereum and NFTs.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center items-center gap-4">
                        <div className="relative">
                          <Image
                            src={walletIcons.modal2}
                            alt="Sign In"
                            width={50}
                            height={40}
                            className="rounded-md border border-white"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-white font-medium mb-2">
                            A new way to sign in
                          </h5>
                          <p className="text-gray-400 text-sm">
                            Instead of creating new accounts and passwords on
                            every website, just connect your wallet.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
