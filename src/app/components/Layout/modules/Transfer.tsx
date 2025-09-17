"use client";

import { FunctionComponent, useState } from "react";
import useTransfer from "../hooks/useTransfer";
import { TransferProps } from "../types/layout.types";
import { useAccount } from "wagmi";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

const Transfer: FunctionComponent<TransferProps> = ({
  dict,
  physicalRights,
  physicalLoading,
  physicalUserLoading,
  physicalRightsUser,
  hasMorePhysicalRights,
  hasMorePhysicalRightsUser,
  loadMorePhysicalRights,
  loadMorePhysicalRightsUser,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [transferQuantities, setTransferQuantities] = useState<{
    [key: string]: number;
  }>({});
  const { address } = useAccount();

  const { transferLoading, handleTransferRights } = useTransfer();

  return (
    <div className="flex flex-col border border-black">
      <div className="px-4 py-3 border-b border-black">
        <div className="text-lg">Transfer Rights</div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-2 py-1 text-xs border border-black transition-colors ${
              activeTab === "all"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-2 py-1 text-xs border border-black transition-colors ${
              activeTab === "my"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            My Physical Rights
          </button>
        </div>
      </div>
      <div 
        className="flex-1 overflow-y-auto min-h-0" 
        id={`transfer-scrollable-${activeTab}`}
      >
        {(activeTab === "all" ? physicalLoading : physicalUserLoading) && (activeTab === "all" ? physicalRights : physicalRightsUser)?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={(activeTab === "all" ? physicalRights : physicalRightsUser)?.length || 0}
            next={activeTab === "all" ? loadMorePhysicalRights : loadMorePhysicalRightsUser}
            hasMore={activeTab === "all" ? hasMorePhysicalRights : hasMorePhysicalRightsUser}
            loader={<div className="text-center text-xs text-gray-500 py-2">Loading more...</div>}
            scrollableTarget={`transfer-scrollable-${activeTab}`}
            endMessage={
              <div className="text-center text-xs text-gray-400 py-2">
                No more physical rights to load
              </div>
            }
          >
            {(activeTab === "all" ? physicalRights : physicalRightsUser)?.map(
              (right) => (
                <div
                  key={`${right.childId}-${right.orderId}`}
                  className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex-shrink-0 relative">
                      <Image
                        draggable={false}
                        fill
                        style={{ objectFit: "cover" }}
                        src={right.child?.metadata?.image}
                        alt={right.child?.metadata?.title}
                        className="border border-gray-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate">
                          {right.child?.metadata?.title}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          {Number(right.child.physicalPrice) / 1e18} $MONA
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 mb-2">
                        Qty: {right.guaranteedAmount}
                      </div>
                      {(() => {
                        const canTransfer = (activeTab === "my" && Number(right.guaranteedAmount) > 0) || 
                          (activeTab === "all" && address && right.holder?.toLowerCase() === address.toLowerCase() && Number(right.guaranteedAmount) > 0);
                        
                        return canTransfer ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max={right.guaranteedAmount}
                              value={
                                transferQuantities[
                                  `${right.childId}-${right.orderId}`
                                ] || 1
                              }
                              onChange={(e) => {
                                const value = Math.max(
                                  1,
                                  Math.min(
                                    Number(right.guaranteedAmount),
                                    Number(e.target.value)
                                  )
                                );
                                setTransferQuantities((prev) => ({
                                  ...prev,
                                  [`${right.childId}-${right.orderId}`]: value,
                                }));
                              }}
                              className="w-16 px-2 py-1 text-xs border border-gray-300 text-center"
                            />
                            <button
                              onClick={() =>
                                handleTransferRights(
                                  Number(right.childId),
                                  Number(right.orderId),
                                  transferQuantities[
                                    `${right.childId}-${right.orderId}`
                                  ] || 1,
                                  right.purchaseMarket
                                )
                              }
                              disabled={transferLoading}
                              className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {transferLoading ? "..." : "Transfer"}
                            </button>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              )
            )}
          </InfiniteScroll>
        )}
        {(activeTab === "all" ? physicalRights : physicalRightsUser)?.length === 0 &&
          !(activeTab === "all" ? physicalLoading : physicalUserLoading) && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm pt-2">
                  No {activeTab === "all" ? "physical rights" : "user physical rights"} found
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Transfer;
