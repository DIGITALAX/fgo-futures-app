"use client";

import {
  FunctionComponent,
  useContext,
  useMemo,
  useState,
  type JSX,
} from "react";
import { OrderProps, Order, Filler, TabKey } from "../types/layout.types";
import useOrders from "../hooks/useOrders";
import { useAccount } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY, getCurrentNetwork } from "@/app/lib/constants";

const Orders: FunctionComponent<OrderProps> = ({
  loadingKeys,
  handleCancelOrder,
  dict,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const { address } = useAccount();
  const context = useContext(AppContext);

  const {
    orders,
    ordersLoading,
    userOrders,
    userOrdersLoading,
    userFilledOrders,
    userFilledLoading,
    hasMoreOrders,
    hasMoreUserOrders,
    hasMoreUserFilled,
    loadMoreOrders,
    loadMoreUserOrders,
    loadMoreUserFilledOrders,
  } = useOrders(dict);

  type BuyEntry = {
    filler: Filler;
    order: Order;
  };

  type CombinedItem =
    | { kind: "sell"; order: Order }
    | { kind: "buy"; entry: BuyEntry };

  const formatAddress = (value?: string) => {
    if (!value || value.length < 10) {
      return value || dict?.naLabel;
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

  const allBuyOrders = useMemo<BuyEntry[]>(
    () =>
      orders.flatMap((order) =>
        (order.fillers || []).map((fill) => ({
          filler: fill,
          order: order,
        }))
      ),
    [orders]
  );

  const combinedAll = useMemo<CombinedItem[]>(
    () =>
      orders.flatMap<CombinedItem>((order) => {
        const sellItem: CombinedItem = { kind: "sell", order };

        const buyItems = (order.fillers || []).map<CombinedItem>((fill) => ({
          kind: "buy",
          entry: { filler: fill, order },
        }));

        return [sellItem, ...buyItems];
      }),
    [orders]
  );

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
    { key: "all", label: dict?.tabAll },
    { key: "my", label: dict?.tabMy },
    { key: "allSells", label: dict?.ordersTabAllSells },
    { key: "allBuys", label: dict?.ordersTabAllBuys },
    { key: "mySells", label: dict?.ordersTabMySells },
    { key: "myBuys", label: dict?.ordersTabMyBuys },
  ];
  const emptyMessages: Record<TabKey, string> = {
    all: dict?.emptyOrdersAll ?? "",
    my: dict?.emptyOrdersMy ?? "",
    allSells: dict?.emptyOrdersAllSells ?? "",
    allBuys: dict?.emptyOrdersAllBuys ?? "",
    mySells: dict?.emptyOrdersMySells ?? "",
    myBuys: dict?.emptyOrdersMyBuys ?? "",
  };

  const renderSellCard = (order: Order) => {
    const totalQuantity = Number(order.quantity || "0");
    const totalFilled = (order.fillers || []).reduce(
      (sum, fill) => sum + Number(fill.quantity || "0"),
      0
    );
    const remainingQuantity = Math.max(totalQuantity - totalFilled, 0);

    const canCancel =
      order?.isActive &&
      !order?.filled &&
      address &&
      order?.seller?.toLowerCase() === address.toLowerCase();

    const canFillOrder =
      order?.isActive &&
      !order?.filled &&
      !order?.contract?.isSettled &&
      address;

    return (
      <div
        key={`sell-${order.orderId}-${order.blockTimestamp || "0"}`}
        className="border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 flex-shrink-0 relative">
            {order?.contract?.metadata?.image ? (
              <Image
                draggable={false}
                fill
                objectFit="cover"
                src={`${INFURA_GATEWAY}${
                  order?.contract?.metadata?.image?.split("ipfs://")?.[1]
                }`}
                alt={order?.contract?.metadata?.title}
                className="border border-gray-300"
              />
            ) : (
              <div className="w-full h-full border border-gray-300 bg-gray-100" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs truncate">
                {order?.contract?.metadata?.title}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  order.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.isActive ? dict?.statusActive : dict?.statusInactive}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">
                {Number(order.pricePerUnit) / 1e18} $MONA {dict?.perUnitSuffix}
              </span>
              <span className="text-xs text-gray-600">
                {dict?.quantityLabel} {order.quantity}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">
                {dict?.filledLabel} {totalFilled} / {totalQuantity}
              </span>
              <span className="text-xs text-gray-600">
                {dict?.totalLabel} {(Number(order.pricePerUnit) * totalQuantity) / 1e18}{" "}
                $MONA
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {dict?.sellerLabel} {formatAddress(order.seller)}
            </div>
            {order.transactionHash && (
              <a
                href={`${getCurrentNetwork().blockExplorer}/tx/${
                  order.transactionHash
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xxs text-blue-600 hover:text-blue-800 hover:underline"
              >
                {dict?.transactionLabel} {formatAddress(order.transactionHash)}
              </a>
            )}
            {(order.fillers || []).length > 0 && (
              <div className="mt-2 border-t border-gray-200 pt-2">
                <div className="text-xxs font-semibold text-gray-600 mb-1">
                  {dict?.fillsTitle}
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {(order.fillers || []).map((fill) => {
                    const fillKey =
                      fill.transactionHash ||
                      `${order.orderId}-${fill.filler}-${fill.blockTimestamp}-${fill.quantity}`;
                    return (
                      <div
                        key={`fill-${fillKey}`}
                        className="flex items-center justify-between text-xxs text-gray-600"
                      >
                        <span>{formatAddress(fill.filler)}</span>
                        <span>
                          {Number(fill.quantity || "0")} {"@ "}
                          {Number(fill.price || "0") / 1e18} $MONA
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
                      onClick={() => handleCancelOrder(Number(order.orderId))}
                      disabled={loadingKeys[`order-${order.orderId}`]}
                      className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {loadingKeys[`order-${order.orderId}`]
                        ? "..."
                        : dict?.cancelOrderAction}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {canFillOrder && (
                    <button
                      onClick={() => {
                        context?.setFillOrder({
                          orderId: Number(order.orderId),
                          maxQuantity: remainingQuantity,
                          contractTitle: order?.contract?.metadata?.title,
                          contractImage: order?.contract?.metadata?.image,
                          pricePerUnit: Number(order.pricePerUnit),
                        });
                      }}
                      className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {dict?.fillOrderAction}
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
    const filler = entry.filler;
    const order = entry?.order ?? filler?.order;
    const cardKey =
      filler.transactionHash ||
      `${order?.orderId ?? "order"}-${filler.filler}-${filler.blockTimestamp}-${
        filler.quantity
      }`;
    const title = order?.contract?.metadata?.title || "Unknown Contract";
    const imageHash = order?.contract?.metadata?.image?.split("ipfs://")?.[1];
    const imageSrc = imageHash ? `${INFURA_GATEWAY}${imageHash}` : null;
    const canListSell =
      !!address &&
      filler.filler?.toLowerCase() === address.toLowerCase() &&
      order &&
      !order?.contract?.isSettled;

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
                  order?.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order?.isActive ? dict?.statusActive : dict?.statusInactive}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
              <span>
                {dict?.buyerLabel} {formatAddress(filler.filler)}
              </span>
              <span>
                {Number(filler.quantity || "0")} @{" "}
                {Number(filler.price || "0") / 1e18} $MONA {dict?.perUnitSuffix}
              </span>
            </div>
            {order?.seller && (
              <div className="text-xxs text-gray-500 mb-1">
                {dict?.sellerLabel} {formatAddress(order.seller)}
              </div>
            )}
            {filler.transactionHash && (
              <a
                href={`${getCurrentNetwork().blockExplorer}/tx/${
                  filler.transactionHash
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xxs text-blue-600 hover:text-blue-800 hover:underline"
              >
                {dict?.transactionLabel} {formatAddress(filler.transactionHash)}
              </a>
            )}
            <div className="text-xxs text-gray-400">
              {formatTimestamp(filler.blockTimestamp)}
            </div>
            {canListSell && order && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() =>
                    context?.setSellOrder({
                      orderId: Number(order.orderId),
                      tokenId: order.contract.tokenId,
                      maxQuantity: Number(filler.quantity || "0"),
                      contractTitle: order?.contract?.metadata?.title,
                      contractImage: order?.contract?.metadata?.image,
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
          loader: ordersLoading,
          hasMore: hasMoreOrders,
          next: () => loadMoreOrders(),
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
          render: (order: Order) => renderSellCard(order),
        };
      case "allBuys":
        return {
          items: allBuyOrders,
          dataLength: allBuyOrders.length,
          loader: ordersLoading,
          hasMore: hasMoreOrders,
          next: () => loadMoreOrders(),
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
          render: (order: Order) => renderSellCard(order),
        };
      case "myBuys":
        return {
          items: userFilledOrders,
          dataLength: userFilledOrders.length,
          loader: userFilledLoading,
          hasMore: hasMoreUserFilled,
          next: () => loadMoreUserFilledOrders(),
          render: (item: Filler) =>
            renderBuyCard({ filler: item, order: item.order }),
        };
      default:
        return {
          items: orders,
          dataLength: orders.length,
          loader: ordersLoading,
          hasMore: hasMoreOrders,
          next: () => loadMoreOrders(),
          render: (order: Order) => renderSellCard(order),
        };
    }
  }, [
    activeTab,
    combinedAll,
    orders,
    allBuyOrders,
    combinedMy,
    userOrders,
    userFilledOrders,
    ordersLoading,
    hasMoreOrders,
    loadMoreOrders,
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
        <div className="text-sm sm:text-base lg:text-lg">
          {dict?.ordersTitle}
        </div>
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
            <div className="text-xs text-gray-500">{dict?.loading}</div>
          </div>
        ) : (
          <>
            <InfiniteScroll
              dataLength={tabConfig.dataLength}
              next={tabConfig.next}
              hasMore={tabConfig.hasMore}
              loader={
                <div className="text-center text-xs text-gray-500 py-2">
                  {dict?.loadingMore}
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

export default Orders;
