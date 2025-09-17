import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState } from "react";
import Image from "next/image";
import useOrders from "../hooks/useOrders";

export const FillOrder = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);
  const [quantity, setQuantity] = useState<number>(1);
  const { handleFillOrder, orderFillLoading } = useOrders();
  
  if (!context?.fillOrder) return null;

  const handleSubmit = async () => {
    if (quantity <= 0) return;
    
    await handleFillOrder(
      context.fillOrder?.orderId!,
      quantity
    );
    
    context?.setFillOrder(undefined);
  };

  const totalCost = (context.fillOrder.pricePerUnit * quantity) / 1e18;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-black max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="text-lg">Fill Order</div>
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
                src={context.fillOrder.contractImage}
                alt={context.fillOrder.contractTitle}
                className="border border-gray-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {context.fillOrder.contractTitle}
              </div>
              <div className="text-xs text-gray-600">
                Order ID: {context.fillOrder.orderId}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Price per unit</div>
            <div className="text-sm font-medium">
              {(context.fillOrder.pricePerUnit / 1e18).toFixed(4)} $MONA
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Quantity (Max: {context.fillOrder.maxQuantity})
            </label>
            <input
              type="number"
              min="1"
              max={context.fillOrder.maxQuantity}
              value={quantity}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(context.fillOrder!.maxQuantity, Number(e.target.value))
                );
                setQuantity(value);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="text-xs text-blue-600 mb-1">Total Cost</div>
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
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={orderFillLoading || quantity <= 0}
              className="px-4 py-2 text-xs border border-black bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {orderFillLoading ? "Fulfilling..." : "Fill Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};