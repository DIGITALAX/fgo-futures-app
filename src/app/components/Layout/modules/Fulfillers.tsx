"use client";

import { FunctionComponent, useState } from "react";
import useFulfillers from "../hooks/useFulfillers";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/image";
import { Fulfillment } from "../types/layout.types";
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
  const [expandedFulfillments, setExpandedFulfillments] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedFulfillmentsSections, setExpandedFulfillmentsSections] =
    useState<{
      [key: string]: boolean;
    }>({});
  const toggleFulfillmentExpanded = (
    fulfillerAddress: string,
    fulfillmentIndex: number
  ) => {
    const key = `${fulfillerAddress}-${fulfillmentIndex}`;
    setExpandedFulfillments((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleFulfillmentsSection = (fulfillerAddress: string) => {
    setExpandedFulfillmentsSections((prev) => ({
      ...prev,
      [fulfillerAddress]: !prev[fulfillerAddress],
    }));
  };

  const getStatusText = (status: string) => {
    const statusNum = Number(status);
    switch (statusNum) {
      case 0:
        return dict?.statusPaid;
      case 1:
        return dict?.statusCancelled;
      case 2:
        return dict?.statusRefunded;
      default:
        return dict?.statusDisputed;
    }
  };

  const getStepStatusText = (isCompleted: boolean) => {
    return isCompleted === true
      ? dict?.stepStatusComplete
      : dict?.stepStatusInProgress;
  };

  if (fulfillersLoading && fulfillers?.length === 0) {
    return (
      <div className="flex noise bg-parchment h-[45rem] md:h-full flex-col overflow-hidden border border-black">
        <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
          <div className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-left">
            {dict?.spectateFulfillersTitle}
          </div>
          <div className="text-center text-gray-500 py-4 sm:py-8">
            {dict?.loadingFulfillersLabel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex noise bg-parchment h-[45rem] md:h-full flex-col border border-black">
      <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 flex-shrink-0">
        <div className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-left">
          {dict?.spectateFulfillersTitle}
        </div>
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto"
        id="fulfillers-scrollable"
      >
        <div className="px-2 sm:px-3 lg:px-4">
          <InfiniteScroll
            dataLength={fulfillers?.length || 0}
            next={loadMoreFulfillers}
            hasMore={hasMoreFulfillers}
            loader={
              <div className="text-center text-xs text-gray-500 py-2">
                {dict?.loadingMoreFulfillersLabel}
              </div>
            }
            scrollableTarget="fulfillers-scrollable"
          >
            <div className="space-y-3 sm:space-y-4 lg:space-y-8">
              {fulfillers?.map((fulfiller, i) => (
                <div
                  key={i}
                  className="border border-black p-2 bg-white sm:p-3 lg:p-4 relative w-full h-fit flex flex-col"
                >
                  <div className="pb-2 sm:pb-3 lg:pb-4 mb-2 sm:mb-3 lg:mb-4 w-full h-fit flex">
                    <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                      <div className="w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 flex-shrink-0 relative">
                        <Image
                          draggable={false}
                          fill
                          style={{ objectFit: "cover" }}
                          src={`${INFURA_GATEWAY}${
                            fulfiller?.metadata?.image?.split("ipfs://")?.[1] ??
                            "QmR3iFiECTvj3SZTgm1ZDMaxPhERV6Hk1JYQZHitH732a9"
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Address:</span>
                            <div className="font-mono text-xs">
                              <a
                                href={`${network?.blockExplorer}/address/${fulfiller?.fulfiller}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 break-all hover:text-orange-800 underline"
                              >
                                {fulfiller?.fulfiller?.slice(0, 8)}...
                                {fulfiller?.fulfiller?.slice(-6)}
                              </a>
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-600">
                              Infrastructure:
                            </span>
                            <div className="font-medium">
                              {parseInt(fulfiller?.infraId, 16).toString()}
                            </div>
                          </div>

                          <div>
                            <span className="text-gray-600">
                              {dict?.activeFulfillmentsLabel}
                            </span>
                            <div className="font-medium">
                              {fulfiller?.fulfillments?.length || 0}
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
                            {dict?.visitWebsiteLabel}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-md text-gray-700 mb-3 flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        toggleFulfillmentsSection(fulfiller?.fulfiller)
                      }
                    >
                      <div>
                        {dict?.fulfillmentsProgressLabel} (
                        {fulfiller?.fulfillments?.length || 0})
                      </div>
                      <div className="text-black">
                        {expandedFulfillmentsSections[fulfiller?.fulfiller]
                          ? "⇊"
                          : "⇉"}
                      </div>
                    </div>

                    {expandedFulfillmentsSections[fulfiller?.fulfiller] && (
                      <div className="space-y-3">
                        {fulfiller?.fulfillments?.map(
                          (
                            fulfillment: Fulfillment,
                            fulfillmentIndex: number
                          ) => {
                            const isExpanded =
                              expandedFulfillments[
                                `${fulfiller?.fulfiller}-${fulfillmentIndex}`
                              ];

                            return (
                              <div
                                key={fulfillmentIndex}
                                className="border border-black gradient"
                              >
                                <div className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="w-12 h-12 cursor-pointer flex-shrink-0 relative"
                                        onClick={() =>
                                          window.open(
                                            `https://fgo.themanufactory.xyz/library/parent/${fulfillment?.parent?.parentContract}/${fulfillment?.parent?.designId}/`
                                          )
                                        }
                                      >
                                        <Image
                                          draggable={false}
                                          fill
                                          style={{ objectFit: "cover" }}
                                          src={`${INFURA_GATEWAY}${
                                            fulfillment?.parent?.metadata?.image?.split(
                                              "ipfs://"
                                            )?.[1]
                                          }`}
                                          alt={
                                            fulfillment?.parent?.metadata?.title
                                          }
                                          className="border border-gray-200"
                                        />
                                      </div>

                                      <div>
                                        <div className="text-gray-800 mb-1">
                                          {fulfillment?.parent?.metadata?.title}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs px-2 py-1 border border-black">
                                            {getStatusText(
                                              fulfillment?.order?.orderStatus
                                            )}
                                          </span>
                                          <span className="text-xs text-gray-600">
                                            {fulfillment
                                              ?.fulfillmentOrderSteps?.[
                                              fulfillment?.fulfillmentOrderSteps
                                                ?.length - 1
                                            ]?.isCompleted
                                              ? dict?.stepsCompletedLabel
                                              : `${dict?.stepLabel} ${
                                                  Number(
                                                    fulfillment?.currentStep
                                                  ) + 1
                                                }`}
                                            {}
                                          </span>
                                          <span className="text-xs text-gray-600">
                                            {getStepStatusText(
                                              fulfillment
                                                ?.fulfillmentOrderSteps?.[
                                                fulfillment
                                                  ?.fulfillmentOrderSteps
                                                  ?.length - 1
                                              ]?.isCompleted ??
                                                fulfillment
                                                  ?.fulfillmentOrderSteps?.[
                                                  Number(
                                                    fulfillment?.currentStep
                                                  )
                                                ]?.isCompleted
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className="text-black cursor-pointer"
                                      onClick={() =>
                                        toggleFulfillmentExpanded(
                                          fulfiller?.fulfiller,
                                          fulfillmentIndex
                                        )
                                      }
                                    >
                                      {isExpanded ? "⇊" : "⇉"}
                                    </div>
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div className="border-t border-gray-200 p-4">
                                    <div className="text-sm text-gray-700 flex-row flex gap-1 mb-3">
                                      <div className="text-sm">
                                        {dict?.workflowStepDetailsLabel}
                                      </div>
                                      <div className="text-xs">{`${
                                        dict?.estDeliveryLabel
                                      } ${formatDuration(
                                        Number(
                                          fulfillment?.estimatedDeliveryDuration
                                        )
                                      )}`}</div>
                                    </div>
                                    <div className="relative w-full h-fit flex flex-col gap-4">
                                      {fulfillment?.physicalSteps?.map(
                                        (step, i) => {
                                          const orderStep =
                                            fulfillment
                                              ?.fulfillmentOrderSteps?.[i];
                                          return (
                                            <div
                                              key={i}
                                              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                            >
                                              <div>
                                                <div className="text-sm text-gray-700 mb-2">
                                                  {
                                                    dict?.fulfillerStepNotesLabel
                                                  }
                                                </div>
                                                <div className="bg-gray-50 p-3 border border-gray-200 text-sm">
                                                  {orderStep?.notes ??
                                                    dict?.noNotesYetLabel}
                                                </div>
                                              </div>
                                              <div>
                                                <div>
                                                  <div className="text-sm text-gray-700 mb-2">
                                                    {
                                                      dict?.designerInstructionsLabel
                                                    }
                                                  </div>
                                                  <div className="bg-gray-50 p-3 border border-gray-200 text-sm">
                                                    {step?.instructions ??
                                                      dict?.noDesignerInstructionsLabel}
                                                  </div>
                                                </div>

                                                <div className="border border-black p-3">
                                                  <div className="text-sm text-gray-700 mb-2">
                                                    {dict?.stepFulfillerLabel}
                                                  </div>

                                                  <div className="flex items-start gap-2">
                                                    <div className="w-10 h-10 flex-shrink-0 relative">
                                                      <Image
                                                        draggable={false}
                                                        fill
                                                        style={{
                                                          objectFit: "cover",
                                                        }}
                                                        src={`${INFURA_GATEWAY}${
                                                          step?.fulfiller?.metadata?.image?.split(
                                                            "ipfs://"
                                                          )?.[1] ??
                                                          "QmXZTsREXd1PRYjC63jySAKMrA49bChJK9SJhrxiNdbvMY"
                                                        }`}
                                                        alt={
                                                          step?.fulfiller
                                                            ?.metadata?.title
                                                        }
                                                        className="border border-gray-200"
                                                      />
                                                    </div>

                                                    <div className="flex-1">
                                                      <div className="text-gray-700 text-sm">
                                                        {
                                                          step?.fulfiller
                                                            ?.metadata?.title
                                                        }
                                                      </div>
                                                      <div className="text-xs text-gray-600 font-mono">
                                                        <a
                                                          href={`${network?.blockExplorer}/address/${step?.fulfiller?.fulfiller}`}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="text-orange-600 hover:text-orange-800 underline break-all"
                                                        >
                                                          {step?.fulfiller?.fulfiller?.slice(
                                                            0,
                                                            8
                                                          )}
                                                          ...
                                                          {step?.fulfiller?.fulfiller?.slice(
                                                            -6
                                                          )}
                                                        </a>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                {orderStep?.isCompleted && (
                                                  <div className="mt-3 border border-black p-3">
                                                    <div className="text-sm text-gray-700 mb-1">
                                                      {dict?.stepCompletedLabel}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                      {dict?.completedAtLabel}{" "}
                                                      {new Date(
                                                        parseInt(
                                                          orderStep?.completedAt
                                                        )
                                                      )?.toLocaleDateString()}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                        {(!fulfiller?.fulfillments ||
                          fulfiller?.fulfillments?.length === 0) && (
                          <div className="text-center text-gray-400 py-6">
                            {dict?.noActiveFulfillmentsLabel}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      {fulfillers?.length === 0 && !fulfillersLoading && (
        <div className="text-center text-gray-500 py-8 px-2 sm:px-3 lg:px-4">
          {dict?.noFulfillersRegisteredLabel}
        </div>
      )}
    </div>
  );
};

export default Fulfillers;
