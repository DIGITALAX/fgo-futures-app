"use client";

import { FunctionComponent, useState } from "react";
import useFulfillers from "../hooks/useFulfillers";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/image";
import { ChildOrder } from "../types/layout.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDuration } from "@/app/lib/utils";

const Fulfillers: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const {
    fulfillers,
    fulfillersLoading,
    hasMoreFulfillers,
    loadMoreFulfillers,
  } = useFulfillers();
  const network = getCurrentNetwork();
  const [expandedOrders, setExpandedOrders] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleOrderExpanded = (fulfillerId: string, orderIndex: number) => {
    const key = `${fulfillerId}-${orderIndex}`;
    setExpandedOrders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "COMPLETED";
      case "in_progress":
        return "IN PROGRESS";
      case "pending":
        return "PENDING";
      default:
        return status?.toUpperCase();
    }
  };

  const getStepStatusText = (isCompleted: string) => {
    return isCompleted === "true" ? "COMPLETE" : "IN PROGRESS";
  };

  if (fulfillersLoading && fulfillers?.length === 0) {
    return (
      <div className="w-full flex flex-col p-6">
        <div className="text-2xl font-bold mb-6 text-left">
          Spectate Fulfillers
        </div>
        <div className="text-center text-gray-500 py-8">
          Loading fulfillers...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-6">
      <div className="text-2xl font-bold mb-6 text-left">
        Spectate Fulfillers
      </div>

      <div className="h-fit overflow-y-auto" id="fulfillers-scrollable">
        <InfiniteScroll
          dataLength={fulfillers?.length || 0}
          next={loadMoreFulfillers}
          hasMore={hasMoreFulfillers}
          loader={
            <div className="text-center text-xs text-gray-500 py-2">
              Loading more fulfillers...
            </div>
          }
          scrollableTarget="fulfillers-scrollable"
        >
          <div className="space-y-8">
            {fulfillers?.map((fulfiller) => (
              <div
                key={fulfiller?.fulfillerId}
                className="border border-black p-4 relative w-full h-fit flex flex-col"
              >
                <div className="border-b border-gray-300 pb-4 mb-4 w-full h-fit flex">
                  <div className="flex items-start gap-4">
                    <div className="w-40 h-40 flex-shrink-0 relative">
                      <Image
                        draggable={false}
                        fill
                        style={{ objectFit: "cover" }}
                        src={`${INFURA_GATEWAY}${
                          fulfiller?.metadata?.image?.split("ipfs://")?.[1]
                        }`}
                        alt={fulfiller?.metadata?.title}
                        className="border border-gray-300"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg font-bold text-gray-800">
                          {fulfiller?.metadata?.title}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          FULFILLER #{fulfiller?.fulfillerId}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <div className="font-mono text-xs">
                            <a
                              href={`${network?.blockExplorer}/address/${fulfiller?.fulfiller}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-800 underline"
                            >
                              {fulfiller?.fulfiller?.slice(0, 8)}...
                              {fulfiller?.fulfiller?.slice(-6)}
                            </a>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-600">Infrastructure:</span>
                          <div className="font-medium">
                            {parseInt(fulfiller?.infraId, 16).toString()}
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-600">Active Orders:</span>
                          <div className="font-medium">
                            {fulfiller?.childOrders?.length || 0}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <a
                          href={fulfiller?.metadata?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-600 hover:text-orange-800 underline"
                        >
                          Visit Website →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-md text-gray-700 mb-3">
                    Orders & Fulfillment Progress (
                    {fulfiller?.childOrders?.length || 0})
                  </div>

                  <div className="space-y-3">
                    {fulfiller?.childOrders?.map(
                      (order: ChildOrder, orderIndex: number) => {
                        const isExpanded =
                          expandedOrders[
                            `${fulfiller?.fulfillerId}-${orderIndex}`
                          ];

                        return (
                          <div
                            key={orderIndex}
                            className="border border-black bg-white"
                          >
                            <div
                              className="p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() =>
                                toggleOrderExpanded(
                                  fulfiller?.fulfillerId,
                                  orderIndex
                                )
                              }
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 flex-shrink-0 relative">
                                    <Image
                                      draggable={false}
                                      fill
                                      style={{ objectFit: "cover" }}
                                      src={`${INFURA_GATEWAY}${
                                        order?.parent?.metadata?.image?.split(
                                          "ipfs://"
                                        )?.[1]
                                      }`}
                                      alt={order?.parent?.metadata?.title}
                                      className="border border-gray-200"
                                    />
                                  </div>

                                  <div>
                                    <div className="text-gray-800 mb-1">
                                      {order?.parent?.metadata?.title}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs px-2 py-1 border border-black bg-white">
                                        {getStatusText(order?.orderStatus)}
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        Step {order?.fulfillment?.currentStep}
                                      </span>
                                      <span className="text-xs text-gray-600">
                                        {getStepStatusText(
                                          order?.fulfillment
                                            ?.fulfillmentOrderSteps?.isCompleted
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-gray-400">
                                  {isExpanded ? "▼" : "▶"}
                                </div>
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="border-t border-gray-200 p-4 bg-white">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div>
                                    <div className="text-sm text-gray-700 mb-3">
                                      Order Information
                                    </div>

                                    <div className="space-y-2 text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-gray-600">
                                          Design ID:
                                        </span>
                                        <span className="font-mono text-xs">
                                          {order?.parent?.designId}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-gray-600">
                                          Contract:
                                        </span>
                                        <div className="font-mono text-xs">
                                          <a
                                            href={`${network?.blockExplorer}/address/${order?.parent?.parentContract}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-600 hover:text-orange-800 underline"
                                          >
                                            {order?.parent?.parentContract?.slice(
                                              0,
                                              8
                                            )}
                                            ...
                                            {order?.parent?.parentContract?.slice(
                                              -6
                                            )}
                                          </a>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-gray-600">
                                          Created:
                                        </span>
                                        <span>
                                          {new Date(
                                            parseInt(
                                              order?.fulfillment?.createdAt
                                            )
                                          )?.toLocaleDateString()}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <span className="text-gray-600">
                                          Last Updated:
                                        </span>
                                        <span>
                                          {new Date(
                                            parseInt(
                                              order?.fulfillment?.lastUpdated
                                            )
                                          )?.toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-4">
                                      <div className="text-sm text-gray-700 mb-2">
                                        Current Step Notes
                                      </div>
                                      <div className="bg-gray-50 p-3 border border-gray-200 text-sm">
                                        {
                                          order?.fulfillment
                                            ?.fulfillmentOrderSteps?.notes
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-700 mb-3">
                                      Workflow Step Details
                                    </div>

                                    <div className="bg-white border border-black p-3 mb-3">
                                      <div className="text-sm text-gray-700 mb-2">
                                        Estimated Delivery Duration
                                      </div>
                                      <div className="text-sm text-gray-600 font-medium">
                                        {formatDuration(
                                          Number(
                                            order?.parent?.workflow
                                              ?.estimatedDeliveryDuration
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div className="bg-white border border-black p-3 mb-3">
                                      <div className="text-sm text-gray-700 mb-2">
                                        Instructions
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {
                                          order?.parent?.workflow?.physicalSteps
                                            ?.instructions
                                        }
                                      </div>
                                    </div>
                                    <div className="border border-black bg-white p-3">
                                      <div className="text-sm text-gray-700 mb-2">
                                        Step Fulfiller (Specialist)
                                      </div>

                                      <div className="flex items-start gap-2">
                                        <div className="w-10 h-10 flex-shrink-0 relative">
                                          <Image
                                            draggable={false}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            src={`${INFURA_GATEWAY}${
                                              order?.parent?.workflow?.physicalSteps?.fulfiller?.metadata?.image?.split(
                                                "ipfs://"
                                              )?.[1]
                                            }`}
                                            alt={
                                              order?.parent?.workflow
                                                ?.physicalSteps?.fulfiller
                                                ?.metadata?.title
                                            }
                                            className="border border-gray-200"
                                          />
                                        </div>

                                        <div className="flex-1">
                                          <div className="text-gray-700 text-sm">
                                            {
                                              order?.parent?.workflow
                                                ?.physicalSteps?.fulfiller
                                                ?.metadata?.title
                                            }
                                          </div>
                                          <div className="text-xs text-gray-600 font-mono">
                                            <a
                                              href={`${network?.blockExplorer}/address/${order?.parent?.workflow?.physicalSteps?.fulfiller?.fulfiller}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-orange-600 hover:text-orange-800 underline"
                                            >
                                              {order?.parent?.workflow?.physicalSteps?.fulfiller?.fulfiller?.slice(
                                                0,
                                                8
                                              )}
                                              ...
                                              {order?.parent?.workflow?.physicalSteps?.fulfiller?.fulfiller?.slice(
                                                -6
                                              )}
                                            </a>
                                          </div>
                                          <div className="text-xs text-gray-600 mt-1">
                                            Infrastructure:{" "}
                                            {
                                              order?.parent?.workflow
                                                ?.physicalSteps?.fulfiller
                                                ?.infraId
                                            }
                                          </div>
                                          <a
                                            href={
                                              order?.parent?.workflow
                                                ?.physicalSteps?.fulfiller
                                                ?.metadata?.link
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-orange-600 hover:text-orange-800 underline"
                                          >
                                            Visit Website →
                                          </a>
                                        </div>
                                      </div>

                                      <div className="mt-2 text-xs text-gray-600">
                                        <span className="font-medium">
                                          Revenue Split:
                                        </span>{" "}
                                        {Number(
                                          order?.parent?.workflow?.physicalSteps
                                            ?.subPerformers?.splitBasisPoints
                                        ) / 100}
                                        %
                                      </div>
                                    </div>
                                    {order?.fulfillment?.fulfillmentOrderSteps
                                      ?.isCompleted === "true" && (
                                      <div className="mt-3 bg-white border border-black p-3">
                                        <div className="text-sm text-gray-700 mb-1">
                                          Step Completed
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          Completed:{" "}
                                          {new Date(
                                            parseInt(
                                              order?.fulfillment
                                                ?.fulfillmentOrderSteps
                                                ?.completedAt
                                            )
                                          )?.toLocaleDateString()}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {(!fulfiller?.childOrders ||
                    fulfiller?.childOrders?.length === 0) && (
                    <div className="text-center text-gray-400 py-6">
                      No active orders for this fulfiller
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {fulfillers?.length === 0 && !fulfillersLoading && (
        <div className="text-center text-gray-500 py-8">
          No fulfillers registered
        </div>
      )}
    </div>
  );
};

export default Fulfillers;
