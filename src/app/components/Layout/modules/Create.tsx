"use client";

import { FunctionComponent, useContext, useState } from "react";
import { CreateProps } from "../types/layout.types";
import { AppContext } from "@/app/lib/providers/Providers";
import { useAccount } from "wagmi";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const Create: FunctionComponent<CreateProps> = ({
  dict,
  escrowLoading,
  escrowUserLoading,
  escrowedRights,
  escrowedRightsUser,
  handleWithdrawPhysicalRights,
  withdrawLoadingKey,
  hasMoreEscrowedRights,
  hasMoreEscrowedRightsUser,
  loadMoreEscrowedRights,
  loadMoreEscrowedRightsUser,
  handleCancelFuture,
  loadingKeys,
}) => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [withdrawQuantities, setWithdrawQuantities] = useState<{
    [key: string]: number;
  }>({});

  return (
    <div className="flex gradient h-[45rem] md:h-full flex-col overflow-hidden border border-black">
      <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-black">
        <div className="text-sm sm:text-base lg:text-lg">
          {dict?.createTitle}
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
            {dict?.createTabMy}
          </button>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto min-h-0"
        id={`create-scrollable-${activeTab}`}
      >
        {(activeTab === "all" ? escrowLoading : escrowUserLoading) &&
        (activeTab === "all" ? escrowedRights : escrowedRightsUser)?.length ===
          0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">{dict?.loading}</div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={
              (activeTab === "all" ? escrowedRights : escrowedRightsUser)
                ?.length || 0
            }
            next={
              activeTab === "all"
                ? loadMoreEscrowedRights
                : loadMoreEscrowedRightsUser
            }
            hasMore={
              activeTab === "all"
                ? hasMoreEscrowedRights && !escrowLoading
                : hasMoreEscrowedRightsUser && !escrowUserLoading
            }
            loader={
              <div className="text-center text-xs text-gray-500 py-2">
                {dict?.loadingMore}
              </div>
            }
            scrollableTarget={`create-scrollable-${activeTab}`}
            scrollThreshold={0.8}
          >
            {(activeTab === "all" ? escrowedRights : escrowedRightsUser)?.map(
              (right) => (
                <div
                  key={`${right.childId}-${right.orderId}-${right.rightsKey}`}
                  className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-wrap">
                    <div
                      onClick={() =>
                        window.open(
                          `https://fgo.themanufactory.xyz/market/future/${right.childContract}/${right.childId}`
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
                          {dict?.childLabel} {right.childId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          {dict?.orderLabel} {right.orderId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        {dict?.createAvailableLabel} {" "}
                        {Number(right.amount) -
                          Number(right.amountUsedForFutures)}
                      </div>
                      <div className="text-xs text-gray-700 mb-1">
                        {dict?.createUsedLabel} {right.amountUsedForFutures}
                      </div>
                      <div className="text-xs text-gray-700 mb-2">
                        {dict?.createFuturesCreatedLabel} {" "}
                        {right.futuresCreated
                          ? dict?.booleanYes
                          : dict?.booleanNo}
                      </div>
                      {(() => {
                        const canManageRights =
                          activeTab === "my" ||
                          (activeTab === "all" &&
                            address &&
                            right.depositor?.toLowerCase() ===
                              address.toLowerCase());
                        const availableAmount =
                          Number(right.amount) -
                          Number(right.amountUsedForFutures);
                        const canCreateWithdraw =
                          canManageRights && availableAmount > 0;

                        return canCreateWithdraw ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            {(() => {
                              const withdrawKey = right.rightsKey;
                              const isWithdrawing =
                                withdrawLoadingKey === withdrawKey;

                              return (
                                <>
                                  <input
                                    type="number"
                                    step="1"
                                    min="1"
                                    max={availableAmount}
                                    value={withdrawQuantities[withdrawKey] || 1}
                                    onChange={(e) => {
                                      const inputValue = Math.floor(
                                        Number(e.target.value)
                                      );
                                      const value = Math.max(
                                        1,
                                        Math.min(availableAmount, inputValue)
                                      );
                                      setWithdrawQuantities((prev) => ({
                                        ...prev,
                                        [withdrawKey]: value,
                                      }));
                                    }}
                                    className="w-16 px-2 py-1 text-xs border border-gray-300 text-center"
                                  />
                                  <button
                                    onClick={() =>
                                      handleWithdrawPhysicalRights({
                                        childId: Number(right.childId),
                                        orderId: Number(right.orderId),
                                        amount:
                                          withdrawQuantities[withdrawKey] ||
                                          availableAmount,
                                        originalMarket: right.originalMarket,
                                        childContract: right.childContract,
                                        key: withdrawKey,
                                      })
                                    }
                                    disabled={isWithdrawing}
                                    className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                                  >
                                    {isWithdrawing ? dict?.loadingDots : dict?.createWithdrawAction}
                                  </button>
                                </>
                              );
                            })()}
                            {
                              <button
                                onClick={() => {
                                  context?.setOpenContract({
                                    childId: Number(right.childId),
                                    orderId: Number(right.orderId),
                                    maxAmount: availableAmount,
                                    childContract: right.childContract,
                                    originalMarket: right.originalMarket,
                                    estimatedDeliveryDuration: Number(
                                      right.estimatedDeliveryDuration
                                    ),
                                    allContracts: right.contracts
                                  });
                                }}
                                className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors"
                              >
                                {dict?.createFutureAction}
                              </button>
                            }
                          </div>
                        ) : null;
                      })()}
                      {right.contracts && right.contracts.length > 0 && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                          <div className="text-xs font-semibold text-gray-600 mb-2">
                            {dict?.createContractsTitle}
                          </div>
                          <div className="space-y-2">
                            {right.contracts.map((contract) => {
                              const contractKey = contract.contractId;
                              const isCreator =
                                address &&
                                contract.originalHolder?.toLowerCase() ===
                                  address.toLowerCase();
                              const canCancelFutures =
                                isCreator &&
                                Number(contract.balanceOf) ===
                                  Number(contract.quantity) &&
                                contract.isActive &&
                                !contract.isSettled;

                              return (
                                <div
                                  key={contractKey}
                                  className="flex items-center justify-between gap-2 flex-wrap bg-gray-50 p-2 rounded text-xs"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {contract.metadata?.image && (
                                      <div className="w-6 h-6 flex-shrink-0 relative">
                                        <Image
                                          draggable={false}
                                          fill
                                          objectFit="cover"
                                          src={`${INFURA_GATEWAY}${
                                            contract.metadata.image.split(
                                              "ipfs://"
                                            )?.[1]
                                          }`}
                                          alt={contract.metadata.title}
                                          className="border border-gray-200"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-0.5">
                                        <div className="truncate font-medium">
                                          {contract.metadata?.title || dict?.unknownLabel}
                                        </div>
                                        <span
                                          className={`text-xxs px-1.5 py-0.5 rounded ml-1 flex-shrink-0 ${
                                            contract.isActive
                                              ? "bg-green-100 text-green-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          {contract.isActive
                                            ? dict?.statusActive
                                            : dict?.statusInactive}
                                        </span>
                                      </div>
                                      <div className="text-gray-500 truncate text-xxs">
                                        {dict?.quantityLabel} {contract.quantity} | {dict?.balanceLabel}{" "}
                                        {contract.balanceOf ?? "0"} | {dict?.ordersLabel}{" "}
                                        {contract.orders?.length || 0}
                                      </div>
                                      <div className="text-gray-400 truncate text-xxs">
                                        {new Date(
                                          Number(contract.blockTimestamp) * 1000
                                        ).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                  {canCancelFutures && (
                                    <button
                                      onClick={() =>
                                        handleCancelFuture(
                                          Number(contract.contractId)
                                        )
                                      }
                                      disabled={
                                        loadingKeys[
                                          `future-${contract.contractId}`
                                        ]
                                      }
                                      className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                      {loadingKeys[
                                        `future-${contract.contractId}`
                                      ]
                                        ? dict?.loadingDots
                                        : dict?.cancelAction}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </InfiniteScroll>
        )}
        {(activeTab === "all" ? escrowedRights : escrowedRightsUser)?.length ===
          0 &&
          !(activeTab === "all" ? escrowLoading : escrowUserLoading) && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm pt-2">
                  {activeTab === "all"
                    ? dict?.createEmptyAll
                    : dict?.createEmptyUser}
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Create;
