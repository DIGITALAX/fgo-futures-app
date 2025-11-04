"use client";

import { FunctionComponent, useContext, useState, useEffect } from "react";
import useSettle from "../hooks/useSettle";
import useRegisterBot from "../hooks/useRegisterBot";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import Image from "next/image";
import { AppContext } from "@/app/lib/providers/Providers";
import { ContractSettled } from "../types/layout.types";
import InfiniteScroll from "react-infinite-scroll-component";

const Countdown: FunctionComponent<{
  settlementDate: number;
  dict: any;
}> = ({ settlementDate, dict }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const diffSeconds = Number(settlementDate) - now;

      if (diffSeconds <= 0) {
        setTimeLeft(dict?.countdownExpired || "Expired");
        return;
      }

      const days = Math.floor(diffSeconds / 86400);
      const hours = Math.floor((diffSeconds % 86400) / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;

      if (days > 0) {
        setTimeLeft(
          `${days}d ${hours}h ${minutes}m ${seconds}s ${
            dict?.timeRemainingLabel || ""
          }`
        );
      } else if (hours > 0) {
        setTimeLeft(
          `${hours}h ${minutes}m ${seconds}s ${dict?.timeRemainingLabel || ""}`
        );
      } else if (minutes > 0) {
        setTimeLeft(
          `${minutes}m ${seconds}s ${dict?.timeRemainingLabel || ""}`
        );
      } else {
        setTimeLeft(`${seconds}s ${dict?.timeRemainingLabel || ""}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [settlementDate, dict]);

  return <span className="text-yellow-600 font-semibold">{timeLeft}</span>;
};

const Settlement: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const network = getCurrentNetwork();
  const { address } = useAccount();
  const context = useContext(AppContext);
  const {
    contractsSettled,
    contractsLoading,
    handleEmergencySettle,
    claimChildSettlement,
    loadingKeys,
    hasMoreContracts,
    loadMoreContracts,
  } = useSettle(dict);

  const {
    registerSettlementLoading,
    handleRegisterSettlement,
    stakeAmount,
    setStakeAmount,
    handleIncreaseStake,
    handleWithdrawStake,
    stakeLoading,
    settlementBot,
    approveLoading,
    approveStake,
    isStakeApproved,
  } = useRegisterBot(dict);

  const isEligible =
    Number(context?.stats?.ionic) > 0 || Number(context?.stats?.genesis) > 0;

  const getSettlementStatus = (settlement: ContractSettled) => {
    if (settlement.isSettled) {
      return settlement.settledContract?.emergency === "true"
        ? dict?.settlementEmergencyLabel
        : dict?.settlementNormalLabel;
    }

    if (!address || !context?.stats?.blockTimestamp) {
      return dict?.statusLabel;
    }

    const timeSinceSettlement =
      BigInt(context?.stats?.blockTimestamp ?? 0) -
      BigInt(settlement.futuresSettlementDate ?? 0);
    const isDelayExceeded =
      timeSinceSettlement > BigInt(settlement.maxSettlementDelay ?? 0);
    if (settlement.isActive && !settlement.isSettled) {
      return dict?.stillTrading;
    } else if (isDelayExceeded) {
      return dict?.settleNow;
    } else if (!settlement.isActive && !settlement.isSettled) {
      return dict?.cancelled;
    } else {
      return dict?.pendingSettlementLabel;
    }
  };

  const canEmergencySettle = (settlement: ContractSettled) => {
    if (!address || !context?.stats?.blockTimestamp) return false;

    const isOriginalHolder =
      settlement.originalHolder?.toLowerCase() === address.toLowerCase();
    const isOrderFulfiller = settlement.finalFillers?.some(
      (filler: string) => filler?.toLowerCase() === address.toLowerCase()
    );

    const timeSinceSettlement =
      BigInt(context?.stats?.blockTimestamp ?? 0) -
      BigInt(settlement.futuresSettlementDate ?? 0);
    const isDelayExceeded =
      timeSinceSettlement > BigInt(settlement.maxSettlementDelay ?? 0);

    return (
      (isOriginalHolder || isOrderFulfiller) &&
      isDelayExceeded &&
      !settlement.isSettled
    );
  };

  const canClaimChild = (settlement: ContractSettled) => {
    if (!address) return false;

    return (
      (settlement.balanceOf || 0) > 0 &&
      settlement.isSettled &&
      settlement.isFulfilled
    );
  };

  const shouldShowFulfillerLate = (settlement: ContractSettled) => {
    if (!address) return false;

    return (
      (settlement.balanceOf || 0) > 0 &&
      settlement.isSettled &&
      !settlement.isFulfilled
    );
  };

  return (
    <div className="w-full lg:max-w-sm flex flex-col w-full h-full bg-white border border-black">
      <div className="px-4 py-3 border-b border-black flex-shrink-0">
        <div className="flex items-center justify-start">
          <div>
            <div className="text-lg">{dict?.settlementTitle}</div>
            <div className="text-xs text-gray-600">
              {dict?.settlementSubtitle?.replace(
                "{count}",
                String(
                  contractsSettled?.filter((con) => con?.isSettled)?.length ?? 0
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto min-h-0 overflow-x-hidden lg:min-h-auto min-h-[30rem]"
        id="settlement-scrollable"
      >
        {contractsLoading && contractsSettled?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">{dict?.loading}</div>
        ) : (
          <InfiniteScroll
            dataLength={contractsSettled?.length || 0}
            next={loadMoreContracts}
            hasMore={hasMoreContracts}
            loader={
              <div className="text-center text-xs text-gray-500 py-2">
                {dict?.loadingMore}
              </div>
            }
            scrollableTarget="settlement-scrollable"
          >
            {contractsSettled?.map((settlement) => (
              <div
                key={settlement.contractId}
                className={`border-b border-gray-300 p-4 hover:bg-gray-50 transition-colors ${
                  settlement.settledContract?.emergency === "true"
                    ? "bg-red-50/30"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0 relative">
                    <Image
                      draggable={false}
                      fill
                      objectFit="contain"
                      src={`${INFURA_GATEWAY}${
                        settlement.child?.metadata?.image?.split("ipfs://")?.[1]
                      }`}
                      alt={settlement.child?.metadata?.title}
                      className="border border-gray-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-600">
                        {settlement.isSettled
                          ? dict?.settlementBadge
                          : dict?.statusLabel}
                      </span>
                      <span
                        className={`text-xxs ${
                          settlement.isSettled &&
                          settlement.settledContract?.emergency === "true"
                            ? "text-red-600"
                            : settlement.isSettled
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {getSettlementStatus(settlement)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 mb-1 truncate">
                      {settlement.child?.metadata?.title}
                    </div>

                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span>
                        {dict?.quantityLabel} {settlement.quantity}
                      </span>

                      <span>
                        {dict?.settlementBotRewardLabel}{" "}
                        {Number(settlement.settlementRewardBPS) / 100}%
                      </span>
                    </div>
                    <span className="text-xs">
                      {dict?.orderIdLabel} {settlement?.marketOrderId}
                    </span>
                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span></span>
                      <span>
                        (≈{" "}
                        {(
                          ((Number(settlement.settlementRewardBPS) / 10000) *
                            Number(settlement.pricePerUnit)) /
                          10 ** 18
                        ).toFixed(4)}{" "}
                        $MONA)
                      </span>
                    </div>

                    {settlement.isSettled ? (
                      <>
                        <div className="flex justify-between text-xxs text-gray-500 mb-1">
                          <span>
                            {dict?.rewardLabel}{" "}
                            {Number(settlement.settledContract?.reward || "0") /
                              10 ** 18}{" "}
                            $MONA
                          </span>
                        </div>

                        <div className="flex justify-between text-xxs text-gray-500 mb-1">
                          <span></span>
                          <span>
                            {dict?.blockLabel}{" "}
                            {settlement.settledContract?.blockNumber ||
                              settlement.blockNumber}
                          </span>
                        </div>

                        <div className="flex justify-between text-xxs text-gray-500 mb-1">
                          <span>
                            {dict?.settlerLabel}{" "}
                            {(
                              settlement.settledContract?.settler ||
                              dict?.naLabel
                            ).slice(0, 6)}
                            ...
                            {(
                              settlement.settledContract?.settler ||
                              dict?.naLabel
                            ).slice(-4)}
                          </span>
                          <span>
                            {new Date(
                              parseInt(
                                settlement.settledContract?.blockTimestamp ||
                                  settlement.blockTimestamp
                              ) * 1000
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between text-xxs text-gray-500 mb-2">
                          <a
                            href={`${network.blockExplorer}/tx/${
                              settlement.settledContract?.transactionHash ||
                              settlement.transactionHash
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {dict?.transactionLabel}{" "}
                            {(
                              settlement.settledContract?.transactionHash ||
                              settlement.transactionHash
                            ).slice(0, 8)}
                            ...
                            {(
                              settlement.settledContract?.transactionHash ||
                              settlement.transactionHash
                            ).slice(-6)}
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-xxs text-gray-500 mb-1">
                          <span>
                            {dict?.createdAt || "Creado"}:{" "}
                            {new Date(
                              parseInt(settlement.blockTimestamp) * 1000
                            ).toLocaleDateString()}
                          </span>
                          <span>
                            {dict?.blockLabel} {settlement.blockNumber}
                          </span>
                        </div>

                        <div className="flex justify-between text-xxs text-gray-500 mb-2">
                          <a
                            href={`${network.blockExplorer}/tx/${settlement.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {dict?.transactionLabel}{" "}
                            {settlement.transactionHash.slice(0, 8)}...
                            {settlement.transactionHash.slice(-6)}
                          </a>
                        </div>

                        {settlement.isActive && (
                          <div className="text-xxs mb-2">
                            <div className="text-gray-500 mb-1">
                              {dict?.estDeliveryLabel || "Entrega estimada"}{" "}
                              {new Date(
                                parseInt(settlement.futuresSettlementDate) * 1000
                              ).toLocaleDateString()}
                            </div>
                            <div>
                              <Countdown
                                settlementDate={Number(
                                  settlement.futuresSettlementDate
                                )}
                                dict={dict}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="relative w-full h-fit flex flex-row gap-2 flex-wrap">
                      {canEmergencySettle(settlement) && (
                        <button
                          onClick={() =>
                            handleEmergencySettle(Number(settlement.contractId))
                          }
                          disabled={
                            loadingKeys[`settle-${settlement.contractId}`]
                          }
                          className="w-fit mt-2 py-1 px-2 text-xs transition-all bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
                        >
                          {loadingKeys[`settle-${settlement.contractId}`]
                            ? "..."
                            : dict?.settlementEmergencyAction}
                        </button>
                      )}

                      {canClaimChild(settlement) && (
                        <button
                          onClick={() =>
                            claimChildSettlement(Number(settlement.contractId))
                          }
                          disabled={
                            loadingKeys[`claim-${settlement.contractId}`]
                          }
                          className="w-fit mt-2 py-1 px-2 text-xs transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          {loadingKeys[`claim-${settlement.contractId}`]
                            ? "..."
                            : dict?.settlementClaimAction}
                        </button>
                      )}

                      {shouldShowFulfillerLate(settlement) && (
                        <button
                          disabled
                          className="w-fit mt-2 py-1 px-2 text-xs transition-all bg-gray-300 text-gray-600 cursor-not-allowed"
                        >
                          {dict?.settlementFulfillerLate}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
        {contractsSettled?.length === 0 && !contractsLoading && (
          <div className="p-4 text-center text-gray-500">
            {dict?.settlementEmpty}
          </div>
        )}
      </div>

      <div className="border-t border-black p-4 flex-shrink-0 space-y-2">
        {settlementBot ? (
          <>
            <div className="text-xs text-gray-600 mb-2">
              {dict?.settlementCurrentStakeLabel}{" "}
              {Number(settlementBot.stakeAmount) / 10 ** 18} $MONA
            </div>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              placeholder={dict?.stakeAmountPlaceholder ?? ""}
              className="w-full py-1 px-2 text-xs border border-gray-300 rounded mb-2"
            />

            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (stakeAmount < Number(context?.minValues?.stake)) {
                    return;
                  }
                  if (!isStakeApproved) {
                    approveStake();
                  } else {
                    handleIncreaseStake();
                  }
                }}
                disabled={
                  stakeLoading ||
                  approveLoading ||
                  stakeAmount < Number(context?.minValues?.stake)
                }
                className={`w-full py-2 px-3 text-xs border border-black transition-colors ${
                  stakeLoading ||
                  approveLoading ||
                  stakeAmount < Number(context?.minValues?.stake)
                    ? "bg-white text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {!isStakeApproved
                  ? dict?.settlementApproveStakeAction
                  : approveLoading || stakeLoading
                  ? "..."
                  : dict?.settlementIncreaseStakeAction}
              </button>
              <button
                onClick={handleWithdrawStake}
                disabled={stakeLoading}
                className={`w-full py-2 px-3 text-xs border border-black transition-colors ${
                  stakeLoading
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-white text-gray-400 cursor-not-allowed"
                }`}
              >
                {stakeLoading ? "..." : dict?.settlementWithdrawStakeAction}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-gray-600 mb-2">
              {dict?.settlementMinStakeLabel?.replace?.(
                "{amount}",
                String(context?.minValues?.stake ?? 0)
              ) ?? ""}
            </div>

            <input
              type="number"
              value={stakeAmount}
              min={context?.minValues?.stake}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              placeholder={String(context?.minValues?.stake ?? "")}
              className="w-full py-1 px-2 text-xs border border-gray-300 rounded mb-2"
            />

            <button
              onClick={() => {
                if (stakeAmount < Number(context?.minValues?.stake)) {
                  return;
                }

                if (!isStakeApproved) {
                  approveStake();
                } else {
                  handleRegisterSettlement();
                }
              }}
              disabled={
                stakeAmount < Number(context?.minValues?.stake) ||
                !isEligible ||
                approveLoading ||
                registerSettlementLoading
              }
              className={`w-full py-2 px-3 text-xs border border-black transition-colors ${
                stakeAmount < Number(context?.minValues?.stake) ||
                !isEligible ||
                approveLoading ||
                registerSettlementLoading
                  ? "bg-white text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {registerSettlementLoading
                ? dict?.settlementRegisteringLabel
                : approveLoading
                ? dict?.settlementApprovingLabel
                : !isStakeApproved
                ? dict?.settlementApproveStakeAction
                : isEligible
                ? dict?.settlementRegisterAction
                : dict?.settlementEligibilityError}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settlement;
