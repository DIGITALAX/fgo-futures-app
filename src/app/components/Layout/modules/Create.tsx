"use client";

import { FunctionComponent, useContext, useState } from "react";
import { CreateProps } from "../types/layout.types";
import { AppContext } from "@/app/lib/providers/Providers";
import { useAccount } from "wagmi";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

const Create: FunctionComponent<CreateProps> = ({
  dict,
  escrowLoading,
  escrowUserLoading,
  escrowedRights,
  escrowedRightsUser,
  handleWithdrawPhysicalRights,
  withdrawLoading,
  hasMoreEscrowedRights,
  hasMoreEscrowedRightsUser,
  loadMoreEscrowedRights,
  loadMoreEscrowedRightsUser,
}) => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [withdrawQuantities, setWithdrawQuantities] = useState<{
    [key: string]: number;
  }>({});

  return (
    <div className="flex flex-col border border-black">
      <div className="px-4 py-3 border-b border-black">
        <div className="text-lg">Create Futures</div>
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
            My Escrowed Rights
          </button>
        </div>
      </div>
      <div 
        className="flex-1 overflow-y-auto min-h-0" 
        id={`create-scrollable-${activeTab}`}
      >
        {(activeTab === "all" ? escrowLoading : escrowUserLoading) && (activeTab === "all" ? escrowedRights : escrowedRightsUser)?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={(activeTab === "all" ? escrowedRights : escrowedRightsUser)?.length || 0}
            next={activeTab === "all" ? loadMoreEscrowedRights : loadMoreEscrowedRightsUser}
            hasMore={activeTab === "all" ? hasMoreEscrowedRights : hasMoreEscrowedRightsUser}
            loader={<div className="text-center text-xs text-gray-500 py-2">Loading more...</div>}
            scrollableTarget={`create-scrollable-${activeTab}`}
            endMessage={
              <div className="text-center text-xs text-gray-400 py-2">
                No more escrowed rights to load
              </div>
            }
          >
            {(activeTab === "all" ? escrowedRights : escrowedRightsUser)?.map(
              (right) => (
                <div
                  key={`${right.childId}-${right.orderId}-${right.rightsKey}`}
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
                          Child: {right.childId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          Order: {right.orderId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        Available: {right.amount}
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        Used for Futures: {right.amountUsedForFutures}
                      </div>
                      <div className="text-xs text-gray-700 mb-2">
                        Futures Created: {right.futuresCreated ? "Yes" : "No"}
                      </div>
                      {(() => {
                        const canManageRights = activeTab === "my" || 
                          (activeTab === "all" && address && right.depositor?.toLowerCase() === address.toLowerCase());
                        const availableAmount = Number(right.amount) - Number(right.amountUsedForFutures);
                        const canCreateFuture = canManageRights && availableAmount > 0;
                        const canWithdraw = canManageRights && Number(right.amountUsedForFutures) > 0;
                        
                        return canCreateFuture || canWithdraw ? (
                          <div className="flex items-center gap-2">
                            {canWithdraw && (
                              <>
                                <input
                                  type="number"
                                  min="1"
                                  max={Number(right.amountUsedForFutures)}
                                  value={withdrawQuantities[right.rightsKey] || 1}
                                  onChange={(e) => {
                                    const value = Math.max(
                                      1,
                                      Math.min(Number(right.amountUsedForFutures), Number(e.target.value))
                                    );
                                    setWithdrawQuantities((prev) => ({
                                      ...prev,
                                      [right.rightsKey]: value,
                                    }));
                                  }}
                                  className="w-16 px-2 py-1 text-xs border border-gray-300 text-center"
                                />
                                <button
                                  onClick={() =>
                                    handleWithdrawPhysicalRights({
                                      childId: Number(right.childId),
                                      orderId: Number(right.orderId),
                                      amount: withdrawQuantities[right.rightsKey] || 1,
                                      originalMarket: right.originalMarket,
                                      childContract: right.childContract,
                                    })
                                  }
                                  disabled={withdrawLoading}
                                  className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                  {withdrawLoading ? "..." : "Withdraw"}
                                </button>
                              </>
                            )}
                            {canCreateFuture && (
                              <button
                                onClick={() => {
                                  context?.setOpenContract({
                                    childId: Number(right.childId),
                                    orderId: Number(right.orderId),
                                    maxAmount: availableAmount,
                                    childContract: right.childContract,
                                    originalMarket: right.originalMarket,
                                  });
                                }}
                                className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors"
                              >
                                Create Future
                              </button>
                            )}
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
        {(activeTab === "all" ? escrowedRights : escrowedRightsUser)?.length === 0 &&
          !(activeTab === "all" ? escrowLoading : escrowUserLoading) && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm pt-2">
                  No {activeTab === "all" ? "escrowed rights" : "user escrowed rights"} found
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Create;
