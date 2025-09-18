import { AppContext } from "@/app/lib/providers/Providers";
import { useContext } from "react";
import Image from "next/image";
import useOrders from "../hooks/useOrders";

export const SellOrder = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);
  const {
    handleSellOrder,
    sellOrderLoading,
    pricePerUnit,
    setPricePerUnit,
    quantity,
    setQuantity,
  } = useOrders();

  if (!context?.sellOrder) return null;

  const handleSubmit = async () => {
    if (!pricePerUnit || quantity <= 0) return;

    const priceInWei = Math.floor(pricePerUnit * 1e18);

    await handleSellOrder(context.sellOrder?.orderId!, quantity, priceInWei);

    context?.setSellOrder(undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-black max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="text-lg">Sell Order</div>
            <button
              onClick={() => context?.setSellOrder(undefined)}
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
                src={context.sellOrder.contractImage}
                alt={context.sellOrder.contractTitle}
                className="border border-gray-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate">
                {context.sellOrder.contractTitle}
              </div>
              <div className="text-xs text-gray-600">
                Order ID: {context.sellOrder.orderId}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">
              Quantity (Max: {context.sellOrder.maxQuantity})
            </label>
            <input
              type="number"
              min="1"
              max={context.sellOrder.maxQuantity}
              value={quantity}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(
                    context.sellOrder!.maxQuantity,
                    Number(e.target.value)
                  )
                );
                setQuantity(value);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              Price Per Unit ($MONA)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(Number(e.target.value))}
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>
        </div>

        <div className="border-t border-black p-3">
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => context?.setSellOrder(undefined)}
              className="px-4 py-2 text-xs border border-gray-300 bg-white text-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={sellOrderLoading || !pricePerUnit || quantity <= 0}
              className="px-4 py-2 text-xs border border-black bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {sellOrderLoading ? "Creating..." : "Create Sell Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
