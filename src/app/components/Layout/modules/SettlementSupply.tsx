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

  const getDeadlineStatus = (deadline: string) => {
    if (isPerpetual(deadline)) return "PERPETUAL";
    const deadlineTime = Number(deadline) * 1000;
    const now = Date.now();
    return now > deadlineTime ? "DEADLINE_PASSED" : "PENDING";
  };

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
            <div className="text-lg">Settlement Supply</div>
            <div className="text-xs text-gray-600">
              {contractsSettled?.length} futures
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
            {contractsSettled?.map((contract) => {
              const deadlineStatus = getDeadlineStatus(contract.deadline);
              const canSettle =
                deadlineStatus === "DEADLINE_PASSED" && !contract.isSettled;
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
                        Supplier: {contract.supplierProfile?.metadata?.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Type:{" "}
                        {isPerpetual(contract.deadline)
                          ? "PERPETUAL"
                          : `DEADLINE: ${new Date(
                              Number(contract.deadline) * 1000
                            ).toLocaleDateString()}`}
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
                      {contract.isSettled ? "SETTLED" : "NOT SETTLED"}
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
                        : "Settle"}
                    </button>
                  )}

                  {canClaim && (
                    <div className="space-y-2 mb-3">
                      <div className="text-xs text-gray-600">
                        My Balance: {contract.balanceOf} tokens
                      </div>
                      {userCredits && (
                        <div className="text-xs text-gray-600">
                          My Credits: {Number(userCredits.credits) - Number(userCredits.consumed)}
                          <span className="block text-gray-400 mt-1">
                            (Use in factory to redeem)
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
                        placeholder="Amount to claim"
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
                          : "Claim Credits"}
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
          No futures to settle
        </div>
      )}
    </div>
  );
};

export default SettlementSupply;
