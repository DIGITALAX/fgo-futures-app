"use client";

import { FunctionComponent, useState } from "react";
import useTransfer from "../hooks/useTransfer";
import { TransferProps } from "../types/layout.types";

const Transfer: FunctionComponent<TransferProps> = ({
  dict,
  physicalRights,
  physicalLoading,
  physicalUserLoading,
  physicalRightsUser,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [transferQuantities, setTransferQuantities] = useState<{
    [key: string]: number;
  }>({});

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
            My Rights
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {(activeTab === "all" ? physicalLoading : physicalUserLoading) ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : (
          <div>
            {(activeTab === "all" ? physicalRights : physicalRightsUser)?.map(
              (right) => (
                <div
                  key={`${right.childId}-${right.orderId}`}
                  className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img
                        src={right.child.metadata.image}
                        alt={right.child.metadata.title}
                        className="w-full h-full object-cover border border-gray-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate">
                          {right.child.metadata.title}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          {Number(right.child.physicalPrice) / 1e18} $MONA
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 mb-2">
                        Qty: {right.guaranteedAmount}
                      </div>
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

export default Transfer;
