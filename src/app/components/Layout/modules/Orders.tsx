"use client";

import { FunctionComponent, useState } from "react";
import { OrderProps } from "../types/layout.types";
import useOrders from "../hooks/useOrders";

const Orders: FunctionComponent<OrderProps> = ({
  dict,
  handleCancelFuture,
  futureCancelLoading,
  orderCancelLoading,
  orderFillLoading,
  sellOrderLoading,
  handleSellOrder,
  handleFillOrder,
  handleCancelOrder,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  const { orders, ordersLoading, userOrders, userOrdersLoading } = useOrders();

  return (
    <div className="w-full flex flex-col border border-black h-[20rem]">
      <div className="px-4 py-3 border-b border-black">
        <div className="text-lg">Active Orders</div>
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
            My Orders
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {(activeTab === "all" ? ordersLoading : userOrdersLoading) ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : (
          <div>
            {(activeTab === "all" ? orders : userOrders)?.map((order) => (
              <div
                key={order.orderId}
                className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0">
                    <img
                      src={order.contract.metadata.image}
                      alt={order.contract.metadata.title}
                      className="w-full h-full object-cover border border-gray-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">
                        {order.contract.metadata.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        {Number(order.pricePerUnit) / 1e18} $MONA per unit
                      </span>
                      <span className="text-xs text-gray-600">
                        Qty: {order.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        Filled: {order.filledQuantity}
                      </span>
                      <span className="text-xs text-gray-600">
                        Total:{" "}
                        {(Number(order.pricePerUnit) * Number(order.quantity)) /
                          1e18}{" "}
                        $MONA
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Seller: {order.seller.slice(0, 6)}...
                      {order.seller.slice(-4)}
                    </div>
                    {order.filled && (
                      <div className="text-xs text-gray-500">
                        Filler: {order.filler.slice(0, 6)}...
                        {order.filler.slice(-4)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {(activeTab === "all" ? orders : userOrders)?.length === 0 &&
          !(activeTab === "all" ? ordersLoading : userOrdersLoading) && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm">
                  No {activeTab === "all" ? "orders" : "user orders"} found
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Orders;
