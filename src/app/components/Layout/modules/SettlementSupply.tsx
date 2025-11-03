"use client";

import { FunctionComponent, useContext, useState } from "react";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import useSettleSupply from "../hooks/useSettleSupply";

const SettlementSupply: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const { address } = useAccount();
  const {
    contractsSettled,
    contractsLoading,
    handleSettleFutures,
    handleClaimCredits,
    loadingKeys,
    hasMoreContracts,
    loadMoreContracts,
    credits,
  } = useSettleSupply(dict);

  const [claimAmounts, setClaimAmounts] = useState<{ [key: string]: string }>({});

  const isPerpetual = (deadline: string) => deadline === "0";

  const getUserCredits = (tokenId: string) => {
    return credits?.find(
      (credit) =>
        credit.buyer?.toLowerCase() === address?.toLowerCase() &&
        credit.tokenId === tokenId
    );
  };

  return (
    <div className="w-full lg:max-w-sm flex flex-col w-full h-full bg-white border border-black">
      <div className="px-4 py-3 border-b border-black flex-shrink-0">
        <div className="flex items-center justify-start">
          <div>
            <div className="text-lg">{dict?.settlementSupplyTitle}</div>
            <div className="text-xs text-gray-600">
              {dict?.settlementSupplySubtitle
                ?.replace?.("{count}", String(contractsSettled?.length ?? 0))}
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
            {contractsSettled?.map((contract) => {
              const isPerpetualDeadline = isPerpetual(contract.deadline);
              const deadlineTime = Number(contract.deadline) * 1000;
              const deadlinePassed =
                !isPerpetualDeadline && Date.now() > deadlineTime;
              const deadlineLabel = isPerpetualDeadline
                ? dict?.settlementSupplyDeadlinePerpetual
                : dict?.settlementSupplyDeadlineLabel?.replace?.(
                    "{date}",
                    new Date(deadlineTime).toLocaleDateString()
                  );
              const canSettle = deadlinePassed && !contract.isSettled;
              const canClaim =
                contract.isSettled && (contract.balanceOf || 0) > 0;
              const userCredits = getUserCredits(contract.tokenId);

              return (
                <div
                  key={contract.tokenId}
                  className="border-b border-gray-300 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 flex-shrink-0 relative cursor-pointer"
                      onClick={() =>
                        window.open(
                          `https://fgo.themanufactory.xyz/market/future/${contract.child?.childContract}/${contract.child?.childId}`,
                          "_blank"
                        )
                      }
                    >
                      <Image
                        draggable={false}
                        fill
                        style={{ objectFit: "cover" }}
                        src={`${INFURA_GATEWAY}${
                          contract.child?.metadata?.image?.split("ipfs://")?.[1]
                        }`}
                        alt={contract.child?.metadata?.title!}
                        className="border border-gray-300 hover:opacity-80"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold text-gray-800 text-sm cursor-pointer hover:text-blue-600"
                        onClick={() =>
                          window.open(
                            `https://fgo.themanufactory.xyz/market/future/${contract.child?.childContract}/${contract.child?.childId}`,
                            "_blank"
                          )
                        }
                      >
                        {contract.child?.metadata?.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {dict?.supplierLabel}{" "}
                        {contract.supplierProfile?.metadata?.title ?? dict?.unknownLabel}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {dict?.typeLabel} {deadlineLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span
                      className={`px-2 py-1 border ${
                        contract.isSettled
                          ? "border-green-600 bg-green-50 text-green-700"
                          : "border-gray-400 bg-gray-50 text-gray-700"
                      }`}
                    >
                      {contract.isSettled
                        ? dict?.statusSettledUpper
                        : dict?.statusNotSettledUpper}
                    </span>
                  </div>

                  {canSettle && (
                    <button
                      onClick={() => handleSettleFutures(contract.tokenId)}
                      disabled={loadingKeys[`settle-${contract.tokenId}`]}
                      className="w-full px-3 py-2 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50 mb-3"
                    >
                      {loadingKeys[`settle-${contract.tokenId}`]
                        ? "..."
                        : dict?.settlementSupplySettleAction}
                    </button>
                  )}

                  {canClaim && (
                    <div className="space-y-2 mb-3">
                      <div className="text-xs text-gray-600">
                        {dict?.settlementSupplyBalanceLabel?.replace?.(
                          "{amount}",
                          String(contract.balanceOf ?? 0)
                        )}
                      </div>
                      {userCredits && (
                        <div className="text-xs text-gray-600">
                          {dict?.settlementSupplyCreditsLabel?.replace?.(
                            "{amount}",
                            String(
                              Number(userCredits.credits) -
                                Number(userCredits.consumed)
                            )
                          )}
                          <span className="block text-gray-400 mt-1">
                            {dict?.settlementSupplyCreditsHelper}
                          </span>
                        </div>
                      )}
                      <input
                        type="number"
                        min="1"
                        max={contract.balanceOf}
                        value={claimAmounts[contract.tokenId] || ""}
                        onChange={(e) =>
                          setClaimAmounts((prev) => ({
                            ...prev,
                            [contract.tokenId]: e.target.value,
                          }))
                        }
                        placeholder={dict?.settlementSupplyClaimPlaceholder ?? ""}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                      <button
                        onClick={() =>
                          handleClaimCredits(
                            contract.tokenId,
                            claimAmounts[contract.tokenId] || "0"
                          )
                        }
                        disabled={
                          !claimAmounts[contract.tokenId] ||
                          loadingKeys[`claim-${contract.tokenId}`]
                        }
                        className="w-full px-3 py-2 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {loadingKeys[`claim-${contract.tokenId}`]
                          ? "..."
                          : dict?.settlementSupplyClaimAction}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </InfiniteScroll>
        )}
      </div>

      {contractsSettled?.length === 0 && !contractsLoading && (
        <div className="p-4 text-center text-gray-400 text-sm">
          {dict?.settlementSupplyEmpty}
        </div>
      )}
    </div>
  );
};

export default SettlementSupply;
