import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState, useEffect } from "react";
import Image from "next/image";
import useOrders from "../hooks/useOrders";
import { INFURA_GATEWAY } from "@/app/lib/constants";

export const FillOrder = ({ dict, lang }: { dict: any; lang: string }) => {
  const context = useContext(AppContext);
  const [quantity, setQuantity] = useState<number>(1);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const {
    handleFillOrder,
    handleFillOrderSupply,
    orderFillLoading,
    checkAllowance,
    handleApprove,
    approveLoading,
  } = useOrders(dict);

  if (!context?.fillOrder) return null;

  const totalCost = (context.fillOrder.pricePerUnit * quantity) / 1e18;
  const totalCostBigInt = BigInt(
    Math.floor(context.fillOrder.pricePerUnit * quantity)
  );

  useEffect(() => {
    const checkApprovalStatus = async () => {
      await checkAllowance();
    };
    checkApprovalStatus();
  }, [quantity, checkAllowance, totalCostBigInt]);

  const handleApproveClick = async () => {
    const success = await handleApprove(totalCostBigInt);
    if (success) {
      setIsApproved(true);
    }
  };

  const handleSubmit = async () => {
    if (quantity <= 0) return;
    if (Number(context?.fillOrder?.supply) > 0) {
      await handleFillOrderSupply(context.fillOrder?.orderId!, quantity);
    } else {
      await handleFillOrder(context.fillOrder?.orderId!, quantity);
    }
  };

  return (
    <div
      dir={lang == "yi" ? "rtl" : "ltr"}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white border border-black max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="text-lg">{dict?.fillOrderTitle}</div>
            <button
              onClick={() => context?.setFillOrder(undefined)}
              className="text-xl hover:bg-gray-100 px-2 py-1"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0 relative">
              <Image
                draggable={false}
                fill
                style={{ objectFit: "cover" }}
                src={`${INFURA_GATEWAY}${
                  context.fillOrder.contractImage?.split("ipfs://")?.[1]
                }`}
                alt={context.fillOrder.contractTitle}
                className="border border-gray-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate">
                {context.fillOrder.contractTitle}
              </div>
              <div className="text-xs text-gray-600">
                Order ID: {context.fillOrder.orderId}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">
              {dict?.pricePerUnitLabel}
            </div>
            <div className="text-sm font-medium">
              {(context.fillOrder.pricePerUnit / 1e18).toFixed(4)} $MONA
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">
              {dict?.quantityMaxLabel?.replace(
                "{max}",
                context.fillOrder.maxQuantity
              )}
            </label>
            <input
              type="number"
              step="1"
              min="1"
              max={context.fillOrder.maxQuantity}
              value={quantity}
              onChange={(e) => {
                const inputValue = Math.floor(Number(e.target.value));
                const value = Math.max(
                  1,
                  Math.min(context.fillOrder!.maxQuantity, inputValue)
                );
                setQuantity(value);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="text-xs text-blue-600 mb-1">
              {dict?.totalCostLabel}
            </div>
            <div className="text-lg font-bold text-blue-800">
              {totalCost.toFixed(4)} $MONA
            </div>
          </div>
        </div>

        <div className="border-t border-black p-3">
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => context?.setFillOrder(undefined)}
              className="px-4 py-2 text-xs border border-gray-300 bg-white text-black hover:bg-gray-50 transition-colors"
            >
              {dict?.cancelAction}
            </button>
            {!isApproved ? (
              <button
                onClick={handleApproveClick}
                disabled={approveLoading}
                className="px-4 py-2 text-xs border border-black bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {approveLoading ? dict?.approvingLabel : dict?.approveAction}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={orderFillLoading || quantity <= 0}
                className="px-4 py-2 text-xs border border-black bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {orderFillLoading ? dict?.fulfilling : dict?.fillOrderAction}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
