"use client";

import { FunctionComponent } from "react";
import SupplyOrders from "./SupplyOrders";
import useSupply from "../hooks/useSupply";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const getCountdown = (deadline: string | number): string => {
  const deadlineMs = Number(deadline) * 1000;
  const now = Date.now();
  const remaining = deadlineMs - now;

  if (remaining <= 0) {
    return "Expired";
  }

  const seconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m left`;
  }
  if (minutes > 0) {
    return `${minutes}m left`;
  }
  return `${seconds}s left`;
};

const Supply: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const {
    supply,
    supplyLoading,
    userSupply,
    userSupplyLoading,
    hasMoreSupply,
    hasMoreUserSupply,
    loadMoreSupply,
    loadMoreUserSupply,
    activeTab,
    setActiveTab,
    handleBuyFutures,
    loadingKeys,
    buyAmounts,
    setBuyAmounts,
    approveMona,
    approveLoading,
    isMonaApproved,
  } = useSupply(dict);

  return (
    <div className="w-full p-2 sm:p-4 lg:p-6 flex items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-6">
        <div className="w-full flex gradient h-[45rem] flex-col overflow-hidden border border-black">
          <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-black">
            <div className="text-sm sm:text-base lg:text-lg">
              Supply Futures
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
                All
              </button>
              <button
                onClick={() => setActiveTab("my")}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-black transition-colors ${
                  activeTab === "my"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                My Supply Futures
              </button>
            </div>
          </div>
          <div
            className="flex-1 min-h-0 overflow-y-auto"
            id={`transfer-scrollable-${activeTab}`}
          >
            {(activeTab === "all" ? supplyLoading : userSupplyLoading) &&
            (activeTab === "all" ? supply : userSupply)?.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-xs text-gray-500">Loading...</div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={
                  (activeTab === "all" ? supply : userSupply)?.length || 0
                }
                next={activeTab === "all" ? loadMoreSupply : loadMoreUserSupply}
                hasMore={
                  activeTab === "all"
                    ? hasMoreSupply && !supplyLoading
                    : hasMoreUserSupply && !userSupplyLoading
                }
                loader={
                  <div className="text-center text-xs text-gray-500 py-2">
                    Loading more...
                  </div>
                }
                scrollableTarget={`transfer-scrollable-${activeTab}`}
                scrollThreshold={0.8}
              >
                {(activeTab === "all" ? supply : userSupply)?.map(
                  (future, i) => {
                    const isActive = future.isActive && !future.isClosed;

                    return (
                      <div
                        key={i}
                        className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 flex-shrink-0 relative cursor-pointer"
                            onClick={() =>
                              window.open(
                                `https://fgo.themanufactory.xyz/market/future/${future.child.childContract}/${future.child.childId}`
                              )
                            }
                          >
                            <Image
                              draggable={false}
                              fill
                              objectFit="contain"
                              src={`${INFURA_GATEWAY}${
                                future.child?.metadata?.image?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                              alt={future.child?.metadata?.title ?? ""}
                              className="border border-gray-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs truncate">
                                {future.child?.metadata?.title}
                              </span>
                              <span className="text-xs text-gray-600 ml-2">
                                {Number(future.pricePerUnit) / 1e18} $MONA
                              </span>
                            </div>
                            <div className="text-xs text-gray-700 mb-1">
                              Supplier: {future.supplier?.slice(0, 6)}...
                              {future.supplier?.slice(-4)}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              Status:{" "}
                              {future?.isSettled
                                ? "Settled"
                                : isActive
                                ? "Active"
                                : "Closed"}
                            </div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs text-gray-700">
                                Deadline:{" "}
                                {new Date(
                                  Number(future.deadline) * 1000
                                ).toLocaleString()}
                              </div>
                              <span className="text-xs text-gray-500 font-semibold">
                                {getCountdown(future.deadline)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              Available:{" "}
                              {Number(future.totalAmount) -
                                Number(future.soldAmount)}{" "}
                              / {Number(future.totalAmount)}
                            </div>
                            {isActive ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                <input
                                  type="number"
                                  step="1"
                                  min="1"
                                  max={Math.max(
                                    0,
                                    Number(future.totalAmount) -
                                      Number(future.soldAmount)
                                  )}
                                  value={
                                    buyAmounts[`supply-${i}`] ||
                                    Math.max(
                                      0,
                                      Number(future.totalAmount) -
                                        Number(future.soldAmount)
                                    )
                                  }
                                  onChange={(e) => {
                                    const maxAvailable = Math.max(
                                      0,
                                      Number(future.totalAmount) -
                                        Number(future.soldAmount)
                                    );
                                    const inputValue = Math.floor(
                                      Number(e.target.value)
                                    );
                                    const value = Math.max(
                                      1,
                                      Math.min(maxAvailable, inputValue)
                                    );
                                    setBuyAmounts((prev) => ({
                                      ...prev,
                                      [`supply-${i}`]: value,
                                    }));
                                  }}
                                  className="w-16 px-2 py-1 text-xs border border-gray-300 text-center"
                                />
                                {!isMonaApproved ? (
                                  <button
                                    onClick={() => {
                                      const quantity = buyAmounts[`supply-${i}`] ||
                                        Math.max(
                                          0,
                                          Number(future.totalAmount) -
                                            Number(future.soldAmount)
                                        );
                                      const totalCost = quantity * (Number(future.pricePerUnit) / 1e18);
                                      approveMona(totalCost);
                                    }}
                                    disabled={approveLoading}
                                    className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                                  >
                                    {approveLoading ? "..." : "Approve"}
                                  </button>
                                ) : null}
                                <button
                                  onClick={() => {
                                    const buyKey = `buy-supply-${i}`;
                                    handleBuyFutures(
                                      buyKey,
                                      future.tokenId,
                                      (
                                        buyAmounts[`supply-${i}`] ||
                                        Math.max(
                                          0,
                                          Number(future.totalAmount) -
                                            Number(future.soldAmount)
                                        )
                                      ).toString(),
                                      future.pricePerUnit
                                    );
                                  }}
                                  disabled={
                                    loadingKeys[`buy-supply-${i}`] ||
                                    !isMonaApproved
                                  }
                                  className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                  {loadingKeys[`buy-supply-${i}`]
                                    ? "..."
                                    : "Buy"}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </InfiniteScroll>
            )}
            {(activeTab === "all" ? supply : userSupply)?.length === 0 &&
              !(activeTab === "all" ? supplyLoading : userSupplyLoading) && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-sm pt-2">
                      No{" "}
                      {activeTab === "all"
                        ? "supply rights"
                        : "user supply rights"}{" "}
                      found
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>

        <SupplyOrders dict={dict} />
      </div>
    </div>
  );
};

export default Supply;
