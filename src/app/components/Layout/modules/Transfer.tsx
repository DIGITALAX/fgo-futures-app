"use client";

import { FunctionComponent, useState } from "react";
import useTransfer from "../hooks/useTransfer";
import { TransferProps } from "../types/layout.types";
import { useAccount } from "wagmi";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDuration } from "@/app/lib/utils";
import { INFURA_GATEWAY } from "@/app/lib/constants";

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

  const { transferLoadingKey, handleTransferRights } = useTransfer(dict);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  return (
    <div className="flex noise bg-parchment h-[45rem] md:h-full flex-col overflow-hidden border border-black">
      <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-black">
        <div className="text-sm sm:text-base lg:text-lg">
          {dict?.transferTitle}
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
            {dict?.transferTabMy}
          </button>
        </div>
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        id={`transfer-scrollable-${activeTab}`}
      >
        {(activeTab === "all" ? physicalLoading : physicalUserLoading) &&
        (activeTab === "all" ? physicalRights : physicalRightsUser)?.length ===
          0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">{dict?.loading}</div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={
              (activeTab === "all" ? physicalRights : physicalRightsUser)
                ?.length || 0
            }
            next={
              activeTab === "all"
                ? loadMorePhysicalRights
                : loadMorePhysicalRightsUser
            }
            hasMore={
              activeTab === "all"
                ? hasMorePhysicalRights && !physicalLoading
                : hasMorePhysicalRightsUser && !physicalUserLoading
            }
            loader={
              <div className="text-center text-xs text-gray-500 py-2">
                {dict?.loadingMore}
              </div>
            }
            scrollableTarget={`transfer-scrollable-${activeTab}`}
            scrollThreshold={0.8}
          >
            {(activeTab === "all" ? physicalRights : physicalRightsUser)?.map(
              (right) => {
                const estimatedSeconds = Number(
                  right.estimatedDeliveryDuration
                );
                const blockTimestampSeconds = Number(right.blockTimestamp);
                const hasEstimatedSeconds =
                  Number.isFinite(estimatedSeconds) && estimatedSeconds > 0;
                const hasBlockTimestamp =
                  Number.isFinite(blockTimestampSeconds) &&
                  blockTimestampSeconds > 0;
                const elapsedSeconds = hasBlockTimestamp
                  ? Math.max(0, nowInSeconds - blockTimestampSeconds)
                  : 0;
                const remainingSeconds = hasEstimatedSeconds
                  ? hasBlockTimestamp
                    ? Math.max(0, estimatedSeconds - elapsedSeconds)
                    : estimatedSeconds
                  : 0;

                const rowKey = `${right.childId}-${right.orderId}-${right.child.childContract}`;
                const isTransferring = transferLoadingKey === rowKey;
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
                        <div className="text-xs text-gray-700 mb-1">
                          {dict?.quantityLabel} {right.guaranteedAmount} |{" "}
                          {dict?.orderLabel} {right.orderId}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {dict?.estimatedDeliveryLabel}{" "}
                          {formatDuration(remainingSeconds)}
                        </div>
                        {(() => {
                          const canTransfer =
                            (activeTab === "my" &&
                              Number(right.guaranteedAmount) > 0) ||
                            (activeTab === "all" &&
                              address &&
                              right.holder?.toLowerCase() ===
                                address.toLowerCase() &&
                              Number(right.guaranteedAmount) > 0);

                          return canTransfer ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <input
                                type="number"
                                step="1"
                                min="1"
                                max={right.guaranteedAmount}
                                value={
                                  transferQuantities[rowKey] ||
                                  Number(right.guaranteedAmount)
                                }
                                onChange={(e) => {
                                  const inputValue = Math.floor(Number(e.target.value));
                                  const value = Math.max(
                                    1,
                                    Math.min(
                                      Number(right.guaranteedAmount),
                                      inputValue
                                    )
                                  );
                                  setTransferQuantities((prev) => ({
                                    ...prev,
                                    [rowKey]: value,
                                  }));
                                }}
                                className="w-16 px-2 py-1 text-xs border border-gray-300 text-center"
                              />
                              <button
                                onClick={() =>
                                  handleTransferRights({
                                    childId: Number(right.childId),
                                    orderId: Number(right.orderId),
                                    amount:
                                      transferQuantities[rowKey] ||
                                      Number(right.guaranteedAmount),
                                    childContract: right.child.childContract,
                                    marketContract: right.purchaseMarket,
                                    key: rowKey,
                                  })
                                }
                                disabled={isTransferring}
                                className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                              >
                                {isTransferring ? dict?.loadingDots : dict?.transferAction}
                              </button>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </InfiniteScroll>
        )}
        {(activeTab === "all" ? physicalRights : physicalRightsUser)?.length ===
          0 &&
          !(activeTab === "all" ? physicalLoading : physicalUserLoading) && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm pt-2">
                  {activeTab === "all"
                    ? dict?.transferEmptyAll
                    : dict?.transferEmptyUser}
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Transfer;
