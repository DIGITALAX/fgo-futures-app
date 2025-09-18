import { AppContext } from "@/app/lib/providers/Providers";
import { useContext, useState, useRef } from "react";
import useOpenContract from "../hooks/useOpenContract";
import { SettlementBot } from "../../Layout/types/layout.types";

export const OpenContract = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);
  const {
    handleOpenContract,
    openContractLoading,
    openContractForm,
    setOpenContractForm,
  } = useOpenContract();

  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [botSearch, setBotSearch] = useState<string>("");
  const [customBot, setCustomBot] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!context?.openContract) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOpenContractForm((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const addBot = (botAddress: string) => {
    if (selectedBots.length < 5 && !selectedBots.includes(botAddress)) {
      const newBots = [...selectedBots, botAddress];
      setSelectedBots(newBots);
      setOpenContractForm((prev) => ({
        ...prev,
        trustedSettlementBots: newBots,
      }));
    }
  };

  const removeBot = (botAddress: string) => {
    const newBots = selectedBots.filter((bot) => bot !== botAddress);
    setSelectedBots(newBots);
    setOpenContractForm((prev) => ({
      ...prev,
      trustedSettlementBots: newBots,
    }));
  };

  const addCustomBot = () => {
    if (
      customBot.trim() &&
      customBot.startsWith("0x") &&
      customBot.length === 42
    ) {
      addBot(customBot.trim());
      setCustomBot("");
    }
  };

  const filteredBots =
    context?.settlementBots?.filter((bot: SettlementBot) =>
      bot.bot.toLowerCase().includes(botSearch.toLowerCase())
    ) || [];

  const handleSubmit = async () => {
    await handleOpenContract();
    context?.setOpenContract(undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-black max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="text-lg">Create Future Contract</div>
            <button
              onClick={() => context?.setOpenContract(undefined)}
              className="text-xl hover:bg-gray-100 px-2 py-1"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Child ID</label>
              <input
                type="text"
                value={openContractForm.childId}
                disabled
                className="w-full px-2 py-1 text-xs border border-gray-300 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Order ID</label>
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
              Amount (Max: {context?.openContract?.maxAmount || 0})
            </label>
            <input
              type="number"
              min="1"
              max={context?.openContract.maxAmount}
              value={openContractForm.amount}
              onChange={(e) =>
                setOpenContractForm((prev) => ({
                  ...prev,
                  amount: Math.max(
                    1,
                    Math.min(
                      context?.openContract?.maxAmount || 1,
                      Number(e.target.value)
                    )
                  ),
                }))
              }
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              Price Per Unit ($MONA)
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
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              Settlement Reward BPS
            </label>
            <input
              type="number"
              min="0"
              max="10000"
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
              className="w-full px-2 py-1 text-xs border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              Contract Title
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
              className="w-full px-2 py-1 text-xs border border-gray-300"
              placeholder="Enter contract title"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              Contract Image
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors"
              >
                Upload PNG
              </button>
              {openContractForm.image && (
                <span className="text-xs text-green-600">Image uploaded</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">
              Trusted Settlement Bots ({selectedBots.length}/5)
            </label>
            <div className="mb-2">
              <input
                type="text"
                value={botSearch}
                onChange={(e) => setBotSearch(e.target.value)}
                placeholder="Search settlement bots..."
                className="w-full px-2 py-1 text-xs border border-gray-300 mb-2"
              />
              {botSearch && (
                <div className="max-h-32 overflow-y-auto border border-gray-300">
                  {filteredBots.map((bot: SettlementBot) => (
                    <div
                      key={bot.bot}
                      onClick={() => addBot(bot.bot)}
                      className="px-2 py-1 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-200"
                    >
                      {bot.bot} - {bot.totalSettlements} settlements
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
                placeholder="0x... (custom bot address)"
                className="flex-1 px-2 py-1 text-xs border border-gray-300"
              />
              <button
                onClick={addCustomBot}
                disabled={!customBot.trim() || selectedBots.length >= 5}
                className="px-3 py-1 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {selectedBots.map((bot) => (
                <div
                  key={bot}
                  className="flex items-center justify-between bg-gray-50 px-2 py-1 text-xs"
                >
                  <span>{bot}</span>
                  <button
                    onClick={() => removeBot(bot)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-black p-3">
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => context?.setOpenContract(undefined)}
              className="px-4 py-2 text-xs border border-gray-300 bg-white text-black hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                openContractLoading ||
                !openContractForm.title ||
                !openContractForm.pricePerUnit ||
                !openContractForm.image ||
                !openContractForm.settlementRewardBPS
              }
              className="px-4 py-2 text-xs border border-black bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {openContractLoading ? "Creating..." : "Create Contract"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
