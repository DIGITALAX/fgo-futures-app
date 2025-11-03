"use client";

import { FunctionComponent, useMemo, useState, JSX, useContext } from "react";
import {
  SupplyOrderProps,
  SellOrder,
  PurchaseRecord,
  TabKey,
} from "../types/layout.types";
import { useAccount } from "wagmi";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY, getCurrentNetwork } from "@/app/lib/constants";
import useSupplyOrders from "../hooks/useSupplyOrders";
import { AppContext } from "@/app/lib/providers/Providers";

const formatAddress = (value?: string) => {
  if (!value || value.length < 10) {
    return value || "N/A";
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) {
    return "";
  }

  const ms = Number(timestamp) * 1000;
  if (!Number.isFinite(ms) || Number.isNaN(ms)) {
    return "";
  }

  return new Date(ms).toLocaleString();
};

const SupplyOrders: FunctionComponent<SupplyOrderProps> = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const { address } = useAccount();

  const {
    orders,
    ordersLoading,
    userOrders,
    userOrdersLoading,
    userFilledOrders,
    userFilledLoading,
    allFilledOrders,
    allFilledLoading,
    hasMoreOrders,
    hasMoreUserOrders,
    hasMoreUserFilled,
    hasMoreAllFilled,
    loadMoreOrders,
    loadMoreUserOrders,
    loadMoreUserFilledOrders,
    loadMoreAllFilledOrders,
    handleCancelOrder,
    loadingKeys,
  } = useSupplyOrders(dict);

  type BuyEntry = {
    filler: PurchaseRecord;
    order: SellOrder;
  };

  type CombinedItem =
    | { kind: "sell"; order: SellOrder }
    | { kind: "buy"; entry: BuyEntry };

  const allBuyOrders = useMemo<BuyEntry[]>(
    () =>
      orders.flatMap((order) =>
        (order?.fillers || []).map((fill) => ({
          filler: fill,
          order: order,
        }))
      ),
    [orders]
  );

  const allBuyOrdersWithDirect = useMemo<BuyEntry[]>(
    () => [
      ...allBuyOrders,
      ...allFilledOrders.map((fill) => ({
        filler: fill,
        order: fill.order,
      })),
    ],
    [allBuyOrders, allFilledOrders]
  );

  const combinedAll = useMemo<CombinedItem[]>(() => {
    const sellItems = orders.flatMap<CombinedItem>((order) => {
      const sellItem: CombinedItem = { kind: "sell", order };

      const buyItems = (order?.fillers || []).map<CombinedItem>((fill) => ({
        kind: "buy",
        entry: { filler: fill, order },
      }));

      return [sellItem, ...buyItems];
    });

    const directBuyItems = allFilledOrders.map<CombinedItem>((fill) => ({
      kind: "buy",
      entry: { filler: fill, order: fill.order },
    }));

    return [...sellItems, ...directBuyItems];
  }, [orders, allFilledOrders]);

  const combinedMy = useMemo<CombinedItem[]>(() => {
    const sellItems = userOrders.map<CombinedItem>((order) => ({
      kind: "sell",
      order,
    }));

    const buyItems = userFilledOrders.map<CombinedItem>((fill) => ({
      kind: "buy",
      entry: { filler: fill, order: fill.order },
    }));

    return [...sellItems, ...buyItems];
  }, [userOrders, userFilledOrders]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "my", label: "My" },
    { key: "allSells", label: "All Sells" },
    { key: "allBuys", label: "All Buys" },
    { key: "mySells", label: "My Sells" },
    { key: "myBuys", label: "My Buys" },
  ];
  const emptyMessages: Record<TabKey, string> = {
    all: "No orders or fills found yet",
    my: "No personal orders or fills found",
    allSells: "No sell orders available",
    allBuys: "No buy fills available",
    mySells: "You have no sell orders",
    myBuys: "You have no buy fills",
  };

  const renderSellCard = (order: SellOrder) => {
    const context = useContext(AppContext);
    const totalQuantity = Number(order?.amount || "0");
    const totalFilled = (order?.fillers || []).reduce(
      (sum, fill) => sum + Number(fill.amount || "0"),
      0
    );
    const remainingQuantity = Math.max(totalQuantity - totalFilled, 0);

    const canCancel =
      order?.isActive &&
      !order?.filled &&
      address &&
      order?.seller?.toLowerCase() === address.toLowerCase();

    const canFillOrder = order?.isActive && !order?.filled && address;
    return (
      <div
        key={`sell-${order?.orderId}-${order?.blockTimestamp || "0"}`}
        className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 flex-shrink-0 relative">
            {order?.future?.child?.metadata?.image ? (
              <Image
                draggable={false}
                fill
                objectFit="cover"
                src={`${INFURA_GATEWAY}${
                  order?.future?.child?.metadata?.image?.split("ipfs://")?.[1]
                }`}
                alt={order?.future?.child?.metadata?.title ?? ""}
                className="border border-gray-300"
              />
            ) : (
              <div className="w-full h-full border border-gray-300 bg-gray-100" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs truncate">
                {order?.future?.child?.metadata?.title}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  order?.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">
                {Number(order?.pricePerUnit) / 1e18} $MONA per unit
              </span>
              <span className="text-xs text-gray-600">
                Deadline:{" "}
                {new Date(
                  Number(order?.future?.deadline) * 1000
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">
                Qty: {order?.amount}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">
                Sold: {totalFilled} / {totalQuantity}
              </span>
              <span className="text-xs text-gray-600">
                Total: {(Number(order?.pricePerUnit) * totalQuantity) / 1e18}{" "}
                $MONA
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Seller: {formatAddress(order?.seller)}
            </div>
            {order?.transactionHash && (
              <a
                href={`${getCurrentNetwork().blockExplorer}/tx/${
                  order?.transactionHash
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xxs text-blue-600 hover:text-blue-800 hover:underline"
              >
                Tx: {formatAddress(order?.transactionHash)}
              </a>
            )}
            {(order?.fillers || []).length > 0 && (
              <div className="mt-2 border-t border-gray-200 pt-2">
                <div className="text-xxs font-semibold text-gray-600 mb-1">
                  Purchases
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {(order?.fillers || []).map((fill) => {
                    const fillKey =
                      fill.transactionHash ||
                      `${order?.orderId}-${fill.buyer}-${fill.blockTimestamp}-${fill.amount}`;
                    return (
                      <div
                        key={`fill-${fillKey}`}
                        className="flex items-center justify-between text-xxs text-gray-600"
                      >
                        <span>{formatAddress(fill.buyer)}</span>
                        <span>
                          {Number(fill.amount || "0")} @{" "}
                          {Number(order?.pricePerUnit || "0") / 1e18} $MONA
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {(canCancel || canFillOrder) && (
              <div className="mt-2 flex flex-wrap gap-2 justify-between">
                <div className="flex flex-wrap gap-2">
                  {canCancel && (
                    <button
                      onClick={() =>
                        handleCancelOrder(
                          Number(order?.orderId),
                          Number(order?.future.tokenId)
                        )
                      }
                      disabled={loadingKeys[`order-${order?.orderId}`]}
                      className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {loadingKeys[`order-${order?.orderId}`]
                        ? "..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {canFillOrder && (
                    <button
                      onClick={() => {
                        context?.setFillOrder({
                          orderId: Number(order?.orderId),
                          maxQuantity: remainingQuantity,
                          contractTitle:
                            order?.future?.child?.metadata?.title || "",
                          contractImage:
                            order?.future?.child?.metadata?.image || "",
                          pricePerUnit: Number(order?.pricePerUnit),
                          supply: true,
                        });
                      }}
                      className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Fill Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBuyCard = (entry: BuyEntry) => {
    const context = useContext(AppContext);

    const isDirectFutureBuy = !!entry?.filler?.future && !entry?.order;
    const future = isDirectFutureBuy
      ? entry?.filler?.future
      : entry?.order?.future;
    const pricePerUnit = isDirectFutureBuy
      ? entry?.filler?.future?.pricePerUnit
      : entry?.order?.pricePerUnit;
    const supplier = isDirectFutureBuy
      ? entry?.filler?.future?.supplier
      : entry?.order?.seller;
    const isActive = isDirectFutureBuy
      ? entry?.filler?.future?.isActive && !entry?.filler?.future?.isClosed
      : entry?.order?.isActive;

    const canListSellSupply =
      address && entry?.filler?.buyer?.toLowerCase() === address.toLowerCase();

    const cardKey =
      entry?.filler?.transactionHash ||
      `${entry?.order?.orderId ?? `direct-${entry?.filler?.buyer}`}-${
        entry?.filler?.buyer
      }-${entry?.filler?.blockTimestamp}-${entry?.filler?.amount}`;
    const title = future?.child?.metadata?.title || "Unknown Contract";
    const imageHash = future?.child?.metadata?.image?.split("ipfs://")?.[1];
    const imageSrc = imageHash ? `${INFURA_GATEWAY}${imageHash}` : null;
    return (
      <div
        key={`buy-${cardKey}`}
        className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 flex-shrink-0 relative">
            {imageSrc ? (
              <Image
                draggable={false}
                fill
                objectFit="cover"
                src={imageSrc}
                alt={title}
                className="border border-gray-300"
              />
            ) : (
              <div className="w-full h-full border border-gray-300 bg-gray-100" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs truncate">{title}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
              <span>Buyer: {formatAddress(entry?.filler?.buyer)}</span>
              <span>
                {Number(entry?.filler?.amount || "0")} @{" "}
                {Number(pricePerUnit || "0") / 1e18} $MONA
              </span>
            </div>
            {supplier && (
              <div className="text-xxs text-gray-500 mb-1">
                {isDirectFutureBuy ? "Supplier" : "Seller"}:{" "}
                {formatAddress(supplier)}
              </div>
            )}
            {entry?.filler?.transactionHash && (
              <a
                href={`${getCurrentNetwork().blockExplorer}/tx/${
                  entry?.filler?.transactionHash
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xxs text-blue-600 hover:text-blue-800 hover:underline"
              >
                Tx: {formatAddress(entry?.filler?.transactionHash)}
              </a>
            )}
            <div className="text-xxs text-gray-400">
              {formatTimestamp(entry?.filler?.blockTimestamp)}
            </div>
            {isDirectFutureBuy && (
              <div className="text-xxs text-gray-400 mt-1">
                Direct Future Purchase
              </div>
            )}
            {canListSellSupply && future && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() =>
                    context?.setSellOrder({
                      orderId: 0,
                      supply: true,
                      tokenId: entry?.filler?.future?.tokenId,
                      maxQuantity: Number(entry?.filler?.amount || "0"),
                      contractTitle:
                        entry?.filler?.future?.child?.metadata?.title!,
                      contractImage:
                        entry?.filler?.future?.child?.metadata?.image!,
                    })
                  }
                  className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Create Sell Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tabConfig = useMemo<{
    items: any[];
    dataLength: number;
    loader: boolean;
    hasMore: boolean;
    next: () => void;
    render: (item: any) => JSX.Element;
  }>(() => {
    switch (activeTab) {
      case "all":
        return {
          items: combinedAll,
          dataLength: combinedAll.length,
          loader: ordersLoading || allFilledLoading,
          hasMore: hasMoreOrders || hasMoreAllFilled,
          next: () => {
            if (hasMoreOrders) loadMoreOrders();
            if (hasMoreAllFilled) loadMoreAllFilledOrders();
          },
          render: (item: CombinedItem) =>
            item.kind === "sell"
              ? renderSellCard(item.order)
              : renderBuyCard(item.entry),
        };
      case "allSells":
        return {
          items: orders,
          dataLength: orders.length,
          loader: ordersLoading,
          hasMore: hasMoreOrders,
          next: () => loadMoreOrders(),
          render: (order: SellOrder) => renderSellCard(order),
        };
      case "allBuys":
        return {
          items: allBuyOrdersWithDirect,
          dataLength: allBuyOrdersWithDirect.length,
          loader: ordersLoading || allFilledLoading,
          hasMore: hasMoreOrders || hasMoreAllFilled,
          next: () => {
            if (hasMoreOrders) loadMoreOrders();
            if (hasMoreAllFilled) loadMoreAllFilledOrders();
          },
          render: (entry: BuyEntry) => renderBuyCard(entry),
        };
      case "my":
        return {
          items: combinedMy,
          dataLength: combinedMy.length,
          loader: userOrdersLoading || userFilledLoading,
          hasMore: hasMoreUserOrders || hasMoreUserFilled,
          next: () => {
            if (hasMoreUserOrders) loadMoreUserOrders();
            if (hasMoreUserFilled) loadMoreUserFilledOrders();
          },
          render: (item: CombinedItem) =>
            item.kind === "sell"
              ? renderSellCard(item.order)
              : renderBuyCard(item.entry),
        };
      case "mySells":
        return {
          items: userOrders,
          dataLength: userOrders.length,
          loader: userOrdersLoading,
          hasMore: hasMoreUserOrders,
          next: () => loadMoreUserOrders(),
          render: (order: SellOrder) => renderSellCard(order),
        };
      case "myBuys":
        return {
          items: userFilledOrders,
          dataLength: userFilledOrders.length,
          loader: userFilledLoading,
          hasMore: hasMoreUserFilled,
          next: () => loadMoreUserFilledOrders(),
          render: (item: PurchaseRecord) =>
            renderBuyCard({ filler: item, order: item.order }),
        };
      default:
        return {
          items: orders,
          dataLength: orders.length,
          loader: ordersLoading,
          hasMore: hasMoreOrders,
          next: () => loadMoreOrders(),
          render: (order: SellOrder) => renderSellCard(order),
        };
    }
  }, [
    activeTab,
    combinedAll,
    orders,
    allBuyOrders,
    allBuyOrdersWithDirect,
    combinedMy,
    userOrders,
    userFilledOrders,
    ordersLoading,
    hasMoreOrders,
    loadMoreOrders,
    allFilledLoading,
    hasMoreAllFilled,
    loadMoreAllFilledOrders,
    userOrdersLoading,
    hasMoreUserOrders,
    loadMoreUserOrders,
    userFilledLoading,
    hasMoreUserFilled,
    loadMoreUserFilledOrders,
  ]);

  return (
    <div className="gradient w-full flex h-[calc(42rem-1rem)] sm:h-[calc(42rem-2rem)] flex-col overflow-hidden border border-black">
      <div className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-black">
        <div className="text-sm sm:text-base lg:text-lg">Orders & Fills</div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2 py-0.5 text-xs border border-black transition-colors ${
                activeTab === tab.key
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto min-h-0"
        id={`orders-scrollable-${activeTab}`}
      >
        {tabConfig.loader && tabConfig.dataLength === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-xs text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            <InfiniteScroll
              dataLength={tabConfig.dataLength}
              next={tabConfig.next}
              hasMore={tabConfig.hasMore}
              loader={
                <div className="text-center text-xs text-gray-500 py-2">
                  Loading more...
                </div>
              }
              scrollableTarget={`orders-scrollable-${activeTab}`}
              scrollThreshold={0.8}
            >
              {tabConfig.items.map((item) => tabConfig.render(item))}
            </InfiniteScroll>
            {tabConfig.items.length === 0 && !tabConfig.loader && (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm pt-2">{emptyMessages[activeTab]}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SupplyOrders;
