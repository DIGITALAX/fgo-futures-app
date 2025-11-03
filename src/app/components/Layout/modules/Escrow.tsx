"use client";

import { FunctionComponent, useState } from "react";
import { EscrowProps } from "../types/layout.types";
import { useAccount } from "wagmi";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const Escrow: FunctionComponent<EscrowProps> = ({
  dict,
  handleDepositPhysicalRights,
  depositLoadingKey,
  physicalRightsEscrowed,
  physicalEscrowedLoading,
  physicalUserEscrowedLoading,
  physicalRightsUserEscrowed,
  hasMorePhysicalRightsEscrowed,
  hasMorePhysicalRightsUserEscrowed,
  loadMorePhysicalRightsEscrowed,
  loadMorePhysicalRightsUserEscrowed,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [depositQuantities, setDepositQuantities] = useState<{
    [key: string]: number;
  }>({});
  const { address } = useAccount();

  return (
    <div className="flex gradient h-[45rem] md:h-full flex-col overflow-hidden border border-black">
      <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-black">
        <div className="text-sm sm:text-base lg:text-lg">
          {dict?.escrowTitle}
        </div>
        <div className="flex gap-1 sm:gap-2 mt-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-black transition-colors ${
              activeTab === "all"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.tabAll}
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-black transition-colors ${
              activeTab === "my"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.escrowTabMy}
          </button>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto min-h-0"
        id={`escrow-scrollable-${activeTab}`}
      >
        {(activeTab === "all"
          ? physicalEscrowedLoading
          : physicalUserEscrowedLoading) &&
        (activeTab === "all"
          ? physicalRightsEscrowed
          : physicalRightsUserEscrowed
        )?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">{dict?.loading}</div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={
              (activeTab === "all"
                ? physicalRightsEscrowed
                : physicalRightsUserEscrowed
              )?.length || 0
            }
            next={
              activeTab === "all"
                ? loadMorePhysicalRightsEscrowed
                : loadMorePhysicalRightsUserEscrowed
            }
            hasMore={
              activeTab === "all"
                ? hasMorePhysicalRightsEscrowed && !physicalEscrowedLoading
                : hasMorePhysicalRightsUserEscrowed &&
                  !physicalUserEscrowedLoading
            }
            loader={
              <div className="text-center text-xs text-gray-500 py-2">
                {dict?.loadingMore}
              </div>
            }
            scrollableTarget={`escrow-scrollable-${activeTab}`}
            scrollThreshold={0.8}
          >
            {(activeTab === "all"
              ? physicalRightsEscrowed
              : physicalRightsUserEscrowed
            )?.map((right) => {
              const rowKey = `${right.childId}-${right.orderId}-${
                right.child?.childContract || right.purchaseMarket || ""
              }`;
              const isDepositing = depositLoadingKey === rowKey;

              return (
                <div
                  key={rowKey}
                  className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-wrap">
                    <div
                      onClick={() =>
                        window.open(
                          `https://fgo.themanufactory.xyz/market/future/${right.child.childContract}/${right.childId}`
                        )
                      }
                      className="w-10 h-10 cursor-pointer flex-shrink-0 relative"
                    >
                      <Image
                        draggable={false}
                        fill
                        objectFit="contain"
                        src={`${INFURA_GATEWAY}${
                          right.child?.metadata?.image?.split("ipfs://")?.[1]
                        }`}
                        alt={right.child?.metadata?.title}
                        className="border border-gray-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs truncate">
                          {right.child?.metadata?.title}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          {Number(right.child.physicalPrice) / 1e18} $MONA
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 mb-2">
                        {dict?.quantityLabel} {right.guaranteedAmount} |{" "}
                        {dict?.orderLabel} {right.orderId}
                      </div>
                      {(() => {
                        const canDeposit =
                          (activeTab === "my" &&
                            Number(right.guaranteedAmount) > 0) ||
                          (activeTab === "all" &&
                            address &&
                            right.originalBuyer?.toLowerCase() ===
                              address.toLowerCase() &&
                            Number(right.guaranteedAmount) > 0);

                        return canDeposit ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="number"
                              step="1"
                              min="1"
                              max={right.guaranteedAmount}
                              value={depositQuantities[rowKey] ||  Number(right.guaranteedAmount)}
                              onChange={(e) => {
                                const inputValue = Math.floor(Number(e.target.value));
                                const value = Math.max(
                                  1,
                                  Math.min(
                                    Number(right.guaranteedAmount),
                                    inputValue
                                  )
                                );
                                setDepositQuantities((prev) => ({
                                  ...prev,
                                  [rowKey]: value,
                                }));
                              }}
                              className="w-16 px-2 py-1 text-xs border border-gray-300 text-center"
                            />
                            <button
                              onClick={() =>
                                handleDepositPhysicalRights({
                                  childId: Number(right.childId),
                                  orderId: Number(right.orderId),
                                  amount: depositQuantities[rowKey] ||  Number(right.guaranteedAmount),
                                  originalMarket: right.purchaseMarket,
                                  childContract: right.child.childContract,
                                  key: rowKey,
                                })
                              }
                              disabled={isDepositing}
                              className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {isDepositing ? dict?.loadingDots : dict?.escrowAction}
                            </button>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        )}
        {(activeTab === "all"
          ? physicalRightsEscrowed
          : physicalRightsUserEscrowed
        )?.length === 0 &&
          !(activeTab === "all"
            ? physicalEscrowedLoading
            : physicalUserEscrowedLoading) && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm pt-2">
                  {activeTab === "all"
                    ? dict?.escrowEmptyAll
                    : dict?.escrowEmptyUser}
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Escrow;
