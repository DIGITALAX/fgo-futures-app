import { AppContext } from "@/app/lib/providers/Providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useContext } from "react";
import useOpenContract from "../hooks/useOpenContract";
import { SettlementBot } from "../../Layout/types/layout.types";
import Image from "next/image";

export const OpenContract = ({ dict, lang }: { dict: any; lang: string }) => {
  const context = useContext(AppContext);
  const {
    handleOpenContract,
    openContractLoading,
    openContractForm,
    setOpenContractForm,
    selectedBots,
    botSearch,
    setBotSearch,
    customBot,
    setCustomBot,
    fileInputRef,
    handleImageUpload,
    addBot,
    removeBot,
    addCustomBot,
  } = useOpenContract(dict);
  const existingContract = context?.openContract?.allContracts?.find(
    (cont) =>
      Number(cont?.pricePerUnit) / 10 ** 18 ==
      Number(openContractForm?.pricePerUnit)
  );
  const existingPriceDisplay = existingContract
    ? Number(existingContract?.pricePerUnit || 0) / 1e18
    : 0;
  const existingPriceLabel = existingContract
    ? existingPriceDisplay.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })
    : "";
  const maxAvailable =
    context?.openContract?.maxAmount === undefined
      ? Infinity
      : context.openContract.maxAmount;
  const hasRequiredBots =
    (openContractForm.trustedSettlementBots?.length || 0) >= 3;
  const hasAmount =
    openContractForm.amount > 0 && openContractForm.amount <= maxAvailable;

  const disableSubmit =
    openContractLoading ||
    !openContractForm.pricePerUnit ||
    !hasAmount ||
    !hasRequiredBots;

  if (!context?.openContract) return null;

  return (
    <div
      dir={lang == "yi" ? "rtl" : "ltr"}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white border border-black max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="text-lg">{dict?.createFutureContractTitle}</div>
            <button
              onClick={() => context?.setOpenContract(undefined)}
              className="text-xl hover:bg-gray-100 px-2 py-1"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {existingContract && (
            <div className="border border-gray-500 bg-gray-50 p-3 text-xs text-gray-800">
              <div className="font-semibold uppercase tracking-wide">
                {dict?.existingContractDetected}
              </div>
              <p className="mt-1">
                Price matches contract #{existingContract?.contractId}. Title,
                reward, metadata, and trusted bots will be reused. Adjust only
                the amount, or change the price to create a separate contract.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="px-2 py-1 bg-gray-100">
                  {dict?.priceLabel}: {existingPriceLabel} $MONA
                </div>
                <div className="px-2 py-1 bg-gray-100">
                  {dict?.rewardBpsLabel}:{" "}
                  {existingContract?.settlementRewardBPS} BPS
                </div>
                {existingContract?.metadata?.title && (
                  <div className="px-2 py-1 bg-gray-100">
                    Title: {existingContract?.metadata?.title}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">{dict?.childIdLabel}</label>
              <input
                type="text"
                value={openContractForm.childId}
                disabled
                className="w-full px-2 py-1 text-xs border border-gray-300 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">{dict?.orderIdLabel}</label>
              <input
                type="text"
                value={openContractForm.orderId}
                disabled
                className="w-full px-2 py-1 text-xs border border-gray-300 bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1">
              {dict?.amountMaxLabel?.replace(
                "{max}",
                context?.openContract?.maxAmount || 0
              )}
            </label>
            <input
              type="number"
              step="1"
              min="1"
              max={context?.openContract.maxAmount}
              value={openContractForm.amount}
              onChange={(e) => {
                const inputValue = Math.floor(Number(e.target.value));
                setOpenContractForm((prev) => ({
                  ...prev,
                  amount: Math.max(
                    1,
                    Math.min(context?.openContract?.maxAmount || 1, inputValue)
                  ),
                }));
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              {dict?.pricePerUnitMonaLabel}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={openContractForm.pricePerUnit}
              onChange={(e) =>
                setOpenContractForm((prev) => ({
                  ...prev,
                  pricePerUnit: Number(e.target.value),
                }))
              }
              className={`w-full px-2 py-1 text-xs border ${
                existingContract
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-300"
              }`}
              title={
                existingContract
                  ? "This price matches an existing contract. Change it to create a new one."
                  : undefined
              }
            />
          </div>

          <div>
            <label className="block text-xs mb-1">{`Settlement Reward BPS (Min-${context?.minValues?.bpsMin}, Max-${context?.minValues?.bpsMax})`}</label>
            <input
              type="number"
              min={Number(context?.minValues?.bpsMin)}
              max={Number(context?.minValues?.bpsMax)}
              value={openContractForm.settlementRewardBPS}
              onChange={(e) =>
                setOpenContractForm((prev) => ({
                  ...prev,
                  settlementRewardBPS: Math.max(
                    0,
                    Math.min(10000, Number(e.target.value))
                  ),
                }))
              }
              disabled={Boolean(existingContract)}
              className="w-full px-2 py-1 text-xs border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              {dict?.contractTitleLabel}
            </label>
            <input
              type="text"
              value={openContractForm.title}
              onChange={(e) =>
                setOpenContractForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              disabled={Boolean(existingContract)}
              className="w-full px-2 py-1 text-xs border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={dict?.enterContractTitlePlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              {dict?.contractImageLabel}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={Boolean(existingContract)}
                className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dict?.uploadPngButton}
              </button>
              {openContractForm.image && (
                <span className="text-xs text-green-600">
                  {dict?.imageUploadedLabel}
                </span>
              )}
              {existingContract && (
                <span className="text-xs text-gray-700">
                  {dict?.existingMetadataLabel}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              onChange={handleImageUpload}
              className="hidden"
              disabled={Boolean(existingContract)}
            />
          </div>
          <div>
            <label className="block text-xs mb-1">
              {dict?.trustedSettlementBotsLabel?.replace(
                "{count}",
                selectedBots.length
              )}
            </label>
            <div className="mb-2">
              <input
                type="text"
                value={botSearch}
                onChange={(e) => setBotSearch(e.target.value)}
                placeholder={dict?.searchBotsPlaceholder}
                disabled={Boolean(existingContract)}
                className="w-full px-2 py-1 text-xs border border-gray-300 mb-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {botSearch && !existingContract && (
                <div className="max-h-32 overflow-y-auto border border-gray-300">
                  {(
                    context?.settlementBots?.filter((bot: SettlementBot) =>
                      bot.bot.toLowerCase().includes(botSearch.toLowerCase())
                    ) || []
                  ).map((bot: SettlementBot) => (
                    <div
                      key={bot.bot}
                      onClick={() => addBot(bot.bot)}
                      className="px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-200"
                    >
                      {bot.bot} - {bot.totalSettlements}{" "}
                      {dict?.settlementsLabel}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={customBot}
                onChange={(e) => setCustomBot(e.target.value)}
                placeholder={dict?.customBotPlaceholder}
                disabled={Boolean(existingContract)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={addCustomBot}
                disabled={
                  Boolean(existingContract) ||
                  !customBot.trim() ||
                  selectedBots.length >= 5
                }
                className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dict?.addBotButton}
              </button>
            </div>
            <div className="space-y-1">
              {selectedBots.map((bot) => (
                <div
                  key={bot}
                  className="flex items-center justify-between bg-gray-50 px-2 py-1 text-xs"
                >
                  <span>{bot}</span>
                  {!existingContract && (
                    <button
                      onClick={() => removeBot(bot)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!existingContract && (
              <p className="text-xxs text-gray-500 mt-1">
                {dict?.selectThreeBotsLabel}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-black p-3">
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => context?.setOpenContract(undefined)}
              className="px-4 py-2 text-xs border border-gray-300 bg-white text-black hover:bg-gray-50 transition-colors"
            >
              {dict?.cancelAction}
            </button>
            <button
              onClick={handleOpenContract}
              disabled={disableSubmit}
              className="px-4 py-2 text-xs border border-black bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {openContractLoading
                ? existingContract
                  ? dict?.updatingLabel
                  : dict?.creatingContractLabel
                : existingContract
                ? dict?.updateContractButton
                : dict?.createContractButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
