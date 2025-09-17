"use client";

import { FunctionComponent, useContext, useState } from "react";
import { CreateProps } from "../types/layout.types";
import { AppContext } from "@/app/lib/providers/Providers";

const Create: FunctionComponent<CreateProps> = ({
  dict,
  escrowLoading,
  escrowUserLoading,
  escrowedRights,
  escrowedRightsUser,
  handleWithdrawPhysicalRights,
  withdrawLoading,
}) => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [withdrawQuantities, setWithdrawQuantities] = useState<{
    [key: string]: number;
  }>({});

  return (
    <div className="flex flex-col border border-black">
      <div className="px-4 py-3 border-b border-black">
        <div className="text-lg">FGO Futures</div>
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
            My Rights
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {(activeTab === "all" ? escrowLoading : escrowUserLoading) ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : (
          <div>
            {(activeTab === "all" ? escrowedRights : escrowedRightsUser)?.map(
              (right) => (
                <div
                  key={`${right.childId}-${right.orderId}-${right.rightsKey}`}
                  className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate">
                          Child ID: {right.childId}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
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
                      <div className="flex items-center gap-2">
                        {!right.futuresCreated ? (
                          <>
                            <input
                              type="number"
                              min="1"
                              max={
                                Number(right.amount) -
                                Number(right.amountUsedForFutures)
                              }
                              value={withdrawQuantities[right.rightsKey] || 1}
                              onChange={(e) => {
                                const maxAmount =
                                  Number(right.amount) -
                                  Number(right.amountUsedForFutures);
                                const value = Math.max(
                                  1,
                                  Math.min(maxAmount, Number(e.target.value))
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
                                  amount:
                                    withdrawQuantities[right.rightsKey] || 1,
                                  originalMarket: right.originalMarket,
                                  childContract: right.childContract,
                                })
                              }
                              disabled={
                                withdrawLoading ||
                                Number(right.amount) -
                                  Number(right.amountUsedForFutures) <=
                                  0
                              }
                              className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {withdrawLoading ? "..." : "Withdraw"}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              context?.setOpenContract({
                                childId: Number(right.childId),
                                orderId: Number(right.orderId),
                                maxAmount:
                                  Number(right.amount) -
                                  Number(right.amountUsedForFutures),
                                childContract: right.childContract,
                                originalMarket: right.originalMarket,
                              });
                            }}
                            className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            {"Create Future"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
