"use client";

import { FunctionComponent } from "react";
import { getCurrentNetwork } from "@/app/lib/constants";
import Image from "next/image";
import { dummySettlementBots } from "@/app/lib/dummy/testData";
import InfiniteScroll from "react-infinite-scroll-component";
import useRegisterBot from "../hooks/useRegisterBot";

const SettlmentBots: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const network = getCurrentNetwork();
  const {
    settlementBots,
    settlementBotsLoading,
    hasMoreSettlementBots,
    loadMoreSettlementBots,
  } = useRegisterBot();

  const displayBots = settlementBots?.length > 0 ? settlementBots : dummySettlementBots;

  const calculateSlashScore = (
    totalSlashEvents: string,
    totalSettlements: string
  ) => {
    const slashes = Number(totalSlashEvents);
    const settlements = Number(totalSettlements);
    if (settlements === 0) return 100;
    const successRate = ((settlements - slashes) / settlements) * 100;
    return Math.max(0, successRate);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="w-full flex flex-col p-6">
      <div className="text-2xl font-bold mb-6 text-left">
        Settlement Bots Network
      </div>

      {settlementBotsLoading && settlementBots?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Loading settlement bots...
        </div>
      ) : (
        <div 
          className="h-[600px] overflow-y-auto" 
          id="settlementbots-scrollable"
        >
          <InfiniteScroll
            dataLength={settlementBots?.length || 0}
            next={loadMoreSettlementBots}
            hasMore={hasMoreSettlementBots && !settlementBotsLoading}
            loader={<div className="text-center text-xs text-gray-500 py-2">Loading more bots...</div>}
            scrollableTarget="settlementbots-scrollable"
            scrollThreshold={0.8}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayBots?.map((bot, index) => {
          const slashScore = calculateSlashScore(
            bot.totalSlashEvents,
            bot.totalSettlements
          );
          const performanceColor = getPerformanceColor(slashScore);

          return (
            <div
              key={bot.bot}
              className="bg-white border border-black p-4 flex flex-col"
            >
              <div className="border-b border-gray-300 pb-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-blue-600 font-medium">
                    BOT #{index + 1}
                  </div>
                  <div className={`text-xs font-bold ${performanceColor}`}>
                    {slashScore.toFixed(1)}% SUCCESS
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-1">Bot Address:</div>
                <a
                  href={`${network.blockExplorer}/address/${bot.bot}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 hover:text-blue-800 underline mb-2 block"
                >
                  {bot.bot.slice(0, 8)}...{bot.bot.slice(-6)}
                </a>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Stake:</span>
                    <div className="font-medium">
                      {(Number(bot.stakeAmount) / 10 ** 18).toLocaleString()}{" "}
                      $MONA
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Settlements:</span>
                    <div className="font-medium">{bot.totalSettlements}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-gray-600">Avg Delay:</span>
                    <div className="font-medium">
                      {bot.averageDelaySeconds}s
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Slashes:</span>
                    <div className="text-red-600">
                      {bot.totalSlashEvents}
                    </div>
                  </div>
                </div>

                {Number(bot.totalAmountSlashed) > 0 && (
                  <div className="mt-2 text-xs">
                    <span className="text-gray-600">Amount Slashed:</span>
                    <div className="text-red-600">
                      {(
                        Number(bot.totalAmountSlashed) /
                        10 ** 18
                      ).toLocaleString()}{" "}
                      $MONA
                    </div>
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500">
                  <a
                    href={`${network.blockExplorer}/tx/${bot.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Registration Tx: {bot.transactionHash.slice(0, 8)}...
                    {bot.transactionHash.slice(-6)}
                  </a>
                </div>
              </div>

              <div className="flex-1">
                <div className="text-xs text-gray-700 mb-2">
                  Recent Settlements ({bot.settledContracts?.length || 0})
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {bot.settledContracts?.map((contract) => (
                    <div
                      key={contract.contractId}
                      className="border border-gray-200 p-2 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 flex-shrink-0 relative">
                          <Image
                            draggable={false}
                            fill
                            style={{ objectFit: "cover" }}
                            src={contract.contract.metadata.image}
                            alt={contract.contract.metadata.title}
                            className="border border-gray-200"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-gray-700 truncate">
                            {contract.contract.metadata.title}
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-xxs text-gray-500 mt-1">
                            <span>Contract #{contract.contractId}</span>
                            <span>
                              Reward:{" "}
                              {(Number(contract.reward) / 10 ** 18).toFixed(0)}{" "}
                              $MONA
                            </span>
                          </div>

                          <div className="text-xxs text-gray-500 mt-1">
                            <span>
                              {new Date(
                                parseInt(contract.blockTimestamp) * 1000
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="text-xxs text-gray-400 mt-1">
                            <a
                              href={`${network.blockExplorer}/tx/${contract.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Tx: {contract.transactionHash.slice(0, 6)}...
                              {contract.transactionHash.slice(-4)}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {(!bot.settledContracts ||
                  bot.settledContracts.length === 0) && (
                  <div className="text-xs text-gray-400 text-center py-4">
                    No settlements recorded yet
                  </div>
                )}
              </div>
            </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}

      {settlementBots?.length === 0 && !settlementBotsLoading && (
        <div className="text-center text-gray-500 py-8">
          No settlement bots registered
        </div>
      )}
    </div>
  );
};

export default SettlmentBots;
