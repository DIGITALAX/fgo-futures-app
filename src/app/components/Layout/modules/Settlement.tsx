"use client";

import { FunctionComponent, useContext } from "react";
import useSettle from "../hooks/useSettle";
import useRegisterBot from "../hooks/useRegisterBot";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import Image from "next/image";
import { AppContext } from "@/app/lib/providers/Providers";
import { ContractSettled } from "../types/layout.types";
import InfiniteScroll from "react-infinite-scroll-component";

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

  const canEmergencySettle = (settlement: ContractSettled) => {
    if (!address || !context?.stats?.blockTimestamp) return false;

    const isOriginalHolder =
      settlement.originalHolder?.toLowerCase() === address.toLowerCase();
    const isOrderFulfiller = settlement.finalFillers?.some(
      (filler: string) => filler?.toLowerCase() === address.toLowerCase()
    );

    const settlementDeadline =
      BigInt(settlement.timeSinceCompletion) +
      BigInt(settlement.maxSettlementDelay);
    const isDelayExceeded =
      context?.stats?.blockTimestamp >= settlementDeadline;

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
            <div className="text-lg">Physical Rights Settlement</div>
            <div className="text-xs text-gray-600">
              {contractsSettled?.length} contracts settled
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto min-h-0 overflow-x-hidden lg:min-h-auto min-h-[30rem]"
        id="settlement-scrollable"
      >
        {contractsLoading && contractsSettled?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          <InfiniteScroll
            dataLength={contractsSettled?.length || 0}
            next={loadMoreContracts}
            hasMore={hasMoreContracts}
            loader={
              <div className="text-center text-xs text-gray-500 py-2">
                Loading more...
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
                      style={{ objectFit: "cover" }}
                      src={`${INFURA_GATEWAY}${
                        settlement.child?.metadata?.image?.split("ipfs://")?.[1]
                      }`}
                      alt={settlement.child?.metadata?.title}
                      className="border border-gray-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-600">SETTLEMENT</span>
                      <span
                        className={`text-xxs ${
                          settlement.settledContract?.emergency === "true"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {settlement.settledContract?.emergency === "true"
                          ? "emergency"
                          : "normal"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700 mb-1 truncate">
                      {settlement.child?.metadata?.title}
                    </div>

                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span>Qty: {settlement.quantity}</span>
                      <span>
                        Bot Reward:{" "}
                        {Number(settlement.settlementRewardBPS) / 100}%
                      </span>
                    </div>

                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span>
                        Reward:{" "}
                        {Number(settlement.settledContract?.reward || "0") /
                          10 ** 18}{" "}
                        $MONA
                      </span>
                      <span>
                        Block:{" "}
                        {settlement.settledContract?.blockNumber ||
                          settlement.blockNumber}
                      </span>
                    </div>

                    <div className="flex justify-between text-xxs text-gray-500 mb-1">
                      <span>
                        Settler:{" "}
                        {(settlement.settledContract?.settler || "N/A").slice(
                          0,
                          6
                        )}
                        ...
                        {(settlement.settledContract?.settler || "N/A").slice(
                          -4
                        )}
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
                        Tx:{" "}
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

                    {canEmergencySettle(settlement) && (
                      <button
                        onClick={() =>
                          handleEmergencySettle(Number(settlement.contractId))
                        }
                        disabled={loadingKeys[`settle-${settlement.contractId}`]}
                        className="w-full mt-2 py-1 px-2 text-xs rounded transition-all bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
                      >
                        {loadingKeys[`settle-${settlement.contractId}`] ? "..." : "Emergency Settle"}
                      </button>
                    )}

                    {canClaimChild(settlement) && (
                      <button
                        onClick={() =>
                          claimChildSettlement(Number(settlement.contractId))
                        }
                        disabled={loadingKeys[`claim-${settlement.contractId}`]}
                        className="w-full mt-2 py-1 px-2 text-xs rounded transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300"
                      >
                        {loadingKeys[`claim-${settlement.contractId}`] ? "..." : "Claim Child"}
                      </button>
                    )}

                    {shouldShowFulfillerLate(settlement) && (
                      <button
                        disabled
                        className="w-full mt-2 py-1 px-2 text-xs rounded transition-all bg-gray-300 text-gray-600 cursor-not-allowed"
                      >
                        Fulfiller Late
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
        {contractsSettled?.length === 0 && !contractsLoading && (
          <div className="p-4 text-center text-gray-500">
            No settlements found
          </div>
        )}
      </div>

      <div className="border-t border-black p-4 flex-shrink-0 space-y-2">
        {settlementBot ? (
          <>
            <div className="text-xs text-gray-600 mb-2">
              Current Stake: {Number(settlementBot.stakeAmount) / 10 ** 18}{" "}
              $MONA
            </div>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              placeholder="Stake amount"
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
                  ? "Approve Stake"
                  : approveLoading || stakeLoading
                  ? "..."
                  : "Increase Stake"}
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
                {stakeLoading ? "..." : "Withdraw Stake"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-gray-600 mb-2">
              Min Stake: {context?.minValues?.stake} $MONA
            </div>

            <input
              type="number"
              value={stakeAmount}
              min={context?.minValues?.stake}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              placeholder={String(context?.minValues?.stake!)}
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
                ? "Registering..."
                : approveLoading
                ? "Approving..."
                : !isStakeApproved
                ? "Approve Stake"
                : isEligible
                ? "Register Settlement Bot"
                : "IONIC + Genesis Required"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settlement;
