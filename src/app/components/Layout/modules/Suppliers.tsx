"use client";

import { FunctionComponent, useState } from "react";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import useSuppliers from "../hooks/useSuppliers";

const Suppliers: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const { suppliers, suppliersLoading, hasMoreSuppliers, loadMoreSuppliers } =
    useSuppliers();
  const network = getCurrentNetwork();
  const [expandedFutures, setExpandedFutures] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleFuturesExpanded = (supplierId: string) => {
    setExpandedFutures((prev) => ({
      ...prev,
      [supplierId]: !prev[supplierId],
    }));
  };

  if (suppliersLoading && suppliers?.length === 0) {
    return (
      <div className="w-full flex flex-col p-2 sm:p-4 lg:p-6">
        <div className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-left">
          {dict?.tradeWithSuppliersTitle}
        </div>
        <div className="text-center text-gray-500 py-4 sm:py-8">
          {dict?.loadingSuppliersLabel}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col p-2 sm:p-4 lg:p-6">
      <div className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-left">
        {dict?.tradeWithSuppliersTitle}
      </div>

      <div className="h-fit overflow-y-auto" id="suppliers-scrollable">
        <InfiniteScroll
          dataLength={suppliers?.length || 0}
          next={loadMoreSuppliers}
          hasMore={hasMoreSuppliers}
          loader={
            <div className="text-center text-xs text-gray-500 py-2">
              {dict?.loadingMoreSuppliersLabel}
            </div>
          }
          scrollableTarget="suppliers-scrollable"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {suppliers?.map((supplier) => (
              <div
                key={supplier?.supplierId}
                className="border border-black p-2 gradient sm:p-3 lg:p-4 relative w-full h-fit flex flex-col"
              >
                <div className="border-b border-gray-300 pb-2 sm:pb-3 lg:pb-4 mb-2 sm:mb-3 lg:mb-4 w-full h-fit flex">
                  <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                    <div className="w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 flex-shrink-0 relative">
                      <Image
                        draggable={false}
                        fill
                        style={{ objectFit: "cover" }}
                        src={`${INFURA_GATEWAY}${
                          supplier?.metadata?.image?.split("ipfs://")?.[1] ??
                          "QmSStZdcaVM2j2EnACaM3CrzsPTHpgFYynAKJcJqbZEVz1"
                        } `}
                        alt={supplier?.metadata?.title ?? ""}
                        className="border border-gray-300"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg font-bold text-gray-800">
                          {supplier?.metadata?.title}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          SUPPLIER #{supplier?.supplierId}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">{dict?.addressLabel}</span>
                          <div className="font-mono text-xs">
                            <a
                              href={`${network?.blockExplorer}/address/${supplier?.supplier}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 break-all hover:text-orange-800 underline"
                            >
                              {supplier?.supplier?.slice(0, 8)}...
                              {supplier?.supplier?.slice(-6)}
                            </a>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-600">{dict?.infrastructureLabel}</span>
                          <div className="font-medium">
                            {parseInt(supplier?.infraId, 16).toString()}
                          </div>
                        </div>
                        {supplier?.metadata?.description && (
                          <div className="font-medium max-h-28 overflow-y-scroll">
                            {supplier?.metadata?.description}
                          </div>
                        )}
                      </div>

                      {supplier?.metadata?.link && (
                        <div className="mt-2">
                          <a
                            href={supplier?.metadata?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-600 hover:text-orange-800 underline"
                          >
                            {dict?.visitWebsiteLabel}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {(supplier?.futures || []).length > 0 && (
                  <div className="mt-3 sm:mt-4">
                    <button
                      onClick={() => toggleFuturesExpanded(supplier?.supplierId)}
                      className="w-full flex items-center justify-between gap-2 p-2 hover:bg-gray-100 transition-colors border border-gray-200 rounded"
                    >
                      <div>
                        {dict?.futuresLabel} ({supplier?.futures?.length || 0})
                      </div>
                      <div className="text-black">
                        {expandedFutures[supplier?.supplierId] ? "⇊" : "⇉"}
                      </div>
                    </button>

                    {expandedFutures[supplier?.supplierId] && (
                      <div className="mt-2 border border-gray-200 rounded p-2 space-y-2">
                        {supplier?.futures?.map((future, index) => (
                          <div
                            key={`${supplier?.supplierId}-future-${index}`}
                            className="border border-gray-300 p-2 rounded hover:bg-gray-50 flex items-center gap-2"
                          >
                            <div className="w-8 h-8 flex-shrink-0 relative">
                              {future?.metadata?.image ? (
                                <Image
                                  draggable={false}
                                  fill
                                  objectFit="cover"
                                  src={`${INFURA_GATEWAY}${
                                    future?.metadata?.image?.split("ipfs://")?.[1]
                                  }`}
                                  alt={future?.metadata?.title ?? ""}
                                  className="border border-gray-300"
                                />
                              ) : (
                                <div className="w-full h-full border border-gray-300 bg-gray-100" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-800 truncate">
                                {future?.metadata?.title || dict?.unnamedFutureLabel}
                              </div>
                              <div className="text-xxs text-gray-600 mt-1">
                                {dict?.amountLabelSupplier} {future?.futures?.totalAmount}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                window.open(
                                  `https://fgo.themanufactory.xyz/market/future/${future?.childContract}/${future?.childId}`,
                                  "_blank"
                                )
                              }
                              className="px-2 py-1 text-xs border border-black bg-white text-black hover:bg-gray-100 transition-colors whitespace-nowrap"
                            >
                              {dict?.viewLabel}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {suppliers?.length === 0 && !suppliersLoading && (
        <div className="text-center text-gray-500 py-8">
          {dict?.noSuppliersLabel}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
