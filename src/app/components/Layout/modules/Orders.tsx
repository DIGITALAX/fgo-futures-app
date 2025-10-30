"use client";

import { FunctionComponent, useContext, useState } from "react";
import { OrderProps } from "../types/layout.types";
import useOrders from "../hooks/useOrders";
import { useAccount } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";

const Orders: FunctionComponent<OrderProps> = ({
  dict,
  handleCancelFuture,
  orderCancelLoading,
  futureCancelLoading,
  handleCancelOrder,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const { address } = useAccount();
  const context = useContext(AppContext);

  const { 
    orders, 
    ordersLoading, 
    userOrders, 
    userOrdersLoading,
    hasMoreOrders,
    hasMoreUserOrders,
    loadMoreOrders,
    loadMoreUserOrders
  } = useOrders();

  return (
    <div className="w-full flex h-[20rem] flex-col overflow-hidden border border-black">
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
      <div 
        className="flex-1 overflow-y-auto min-h-0" 
        id={`orders-scrollable-${activeTab}`}
      >
        {(activeTab === "all" ? ordersLoading : userOrdersLoading) && (activeTab === "all" ? orders : userOrders)?.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={(activeTab === "all" ? orders : userOrders)?.length || 0}
            next={activeTab === "all" ? loadMoreOrders : loadMoreUserOrders}
            hasMore={(activeTab === "all" ? hasMoreOrders && !ordersLoading : hasMoreUserOrders && !userOrdersLoading)}
            loader={<div className="text-center text-xs text-gray-500 py-2">Loading more...</div>}
            scrollableTarget={`orders-scrollable-${activeTab}`}
            scrollThreshold={0.8}
          >
            {(activeTab === "all" ? orders : userOrders)?.map((order) => (
              <div
                key={order.orderId}
                className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0 relative">
                    <Image
                      draggable={false}
                      fill
                      style={{ objectFit: "cover" }}
                      src={order.contract.metadata.image}
                      alt={order.contract.metadata.title}
                      className="border border-gray-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs truncate">
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
                    {(() => {
                      const canCancel =
                        order.isActive &&
                        !order.filled &&
                        address &&
                        order.seller?.toLowerCase() === address.toLowerCase();

                      const canSell =
                        !order.contract.isSettled &&
                        order.balanceOf > 0 &&
                        address &&
                        order.filler?.toLowerCase() === address.toLowerCase();

                      const canFillOrder = 
                        !order.filled && 
                        !order.contract.isSettled &&
                        address &&
                        order.seller?.toLowerCase() !== address.toLowerCase();

                      return canCancel || canSell || canFillOrder ? (
                        <div className="mt-2 flex gap-2">
                          {canCancel && (
                            <button
                              onClick={() =>
                                handleCancelOrder(Number(order.orderId))
                              }
                              disabled={orderCancelLoading}
                              className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {orderCancelLoading ? "..." : "Cancel Order"}
                            </button>
                          )}
                          {canSell && (
                            <button
                              onClick={() => {
                                context?.setSellOrder({
                                  orderId: Number(order.orderId),
                                  maxQuantity: order.balanceOf,
                                  contractTitle: order.contract.metadata.title,
                                  contractImage: order.contract.metadata.image,
                                });
                              }}
                              className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              Sell Order
                            </button>
                          )}
                          {canFillOrder && (
                            <button
                              onClick={() => {
                                context?.setFillOrder({
                                  orderId: Number(order.orderId),
                                  maxQuantity: Number(order.quantity),
                                  contractTitle: order.contract.metadata.title,
                                  contractImage: order.contract.metadata.image,
                                  pricePerUnit: Number(order.pricePerUnit),
                                });
                              }}
                              className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              Fill Order
                            </button>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
        {(activeTab === "all" ? orders : userOrders)?.length === 0 &&
          !(activeTab === "all" ? ordersLoading : userOrdersLoading) && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm pt-2">
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
