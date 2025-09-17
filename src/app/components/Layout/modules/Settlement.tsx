"use client";

import { FunctionComponent, useState } from "react";
import useSettle from "../hooks/useSettle";
import useRegisterBot from "../hooks/useRegisterBot";

const Settlement: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const {
    contractsSettled,
    contractsLoading,
    handleEmergencySettle,
    settleLoading,
  } = useSettle();

  const {
    registerSettlementLoading,
    handleRegisterSettlement,
    stakeAmount,
    setStakeAmount,
    validBalance,
    handleIncreaseStake,
    handleWithdrawStake,
    stakeLoading,
    settlementBot,
    handleClaimChildSettled,
    claimLoading,
  } = useRegisterBot();

  const [showStakeInput, setShowStakeInput] = useState(false);

  const isEligible =
    validBalance.dltaBalance > BigInt(0) ||
    validBalance.genesisBalance > BigInt(0);

  return (
    <div className="max-w-sm flex flex-col w-full h-full overflow-hidden border-x border-t border-black">
      <div className="px-4 py-3 border-b border-black flex-shrink-0">
        <div className="text-lg">Settlement</div>
        <div className="text-xs text-gray-600">
          {contractsSettled?.length} contracts settled
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 overflow-x-hidden">
        {contractsLoading ? (
          <div className="p-3 text-center text-gray-500">Loading...</div>
        ) : (
          <div>
            {contractsSettled?.map((settlement) => (
              <div
                key={settlement.contractId}
                className={`border-b border-gray-300 p-3 hover:bg-gray-50 transition-colors ${
                  settlement.emergency === "true" ? "bg-red-50/30" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-600">SETTLEMENT</span>
                  <span
                    className={`text-xxs ${
                      settlement.emergency === "true"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {settlement.emergency === "true" ? "emergency" : "normal"}
                  </span>
                </div>

                <div className="text-xs text-gray-700 mb-1">
                  {settlement.contract.child.metadata?.title}
                </div>

                <div className="flex justify-between text-xxs text-gray-500 mb-1">
                  <span>Reward: {settlement.reward} $MONA</span>
                  <span>Block: {settlement.blockNumber}</span>
                </div>

                <div className="flex justify-between text-xxs text-gray-500">
                  <span>
                    Settler: {settlement.settler.slice(0, 6)}...
                    {settlement.settler.slice(-4)}
                  </span>
                  <span>
                    {new Date(
                      parseInt(settlement.blockTimestamp) * 1000
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-black p-3 flex-shrink-0 space-y-2">
        {settlementBot ? (
          <>
            <div className="text-xs text-gray-600 mb-2">
              Current Stake: {settlementBot.stakeAmount} $MONA
            </div>

            {showStakeInput && (
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                placeholder="Stake amount"
                className="w-full py-1 px-2 text-xs border border-gray-300 rounded mb-2"
              />
            )}

            <div className="flex gap-1">
              <button
                onClick={() => {
                  setShowStakeInput(!showStakeInput);
                  if (showStakeInput) handleIncreaseStake();
                }}
                disabled={stakeLoading}
                className="flex-1 py-1 px-2 text-xs rounded transition-all bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
              >
                {showStakeInput ? "Confirm" : "Increase Stake"}
              </button>
              <button
                onClick={handleWithdrawStake}
                disabled={stakeLoading}
                className="flex-1 py-1 px-2 text-xs rounded transition-all bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
              >
                Withdraw Stake
              </button>
            </div>
          </>
        ) : (
          <>
            {showStakeInput && (
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                placeholder="Stake amount"
                className="w-full py-1 px-2 text-xs border border-gray-300 rounded mb-2"
              />
            )}

            <button
              onClick={() => {
                if (!showStakeInput) {
                  setShowStakeInput(true);
                } else {
                  handleRegisterSettlement();
                }
              }}
              disabled={!isEligible || registerSettlementLoading}
              className={`w-full py-2 px-3 text-xs border border-black transition-colors ${
                isEligible
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-gray-400 cursor-not-allowed"
              }`}
            >
              {registerSettlementLoading
                ? "Registering..."
                : showStakeInput
                ? "Confirm Registration"
                : isEligible
                ? "Register Settlement Bot"
                : "DLTA/Genesis Required"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settlement;
