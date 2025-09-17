import { useContext } from "react";
import { AppContext } from "@/app/lib/providers/Providers";
import { getCurrentNetwork } from "@/app/lib/constants";

export const Success = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);

  if (!context?.successData) return null;

  const network = getCurrentNetwork();
  const explorerUrl = context.successData.txHash
    ? `${network.blockExplorer}/tx/${context.successData.txHash}`
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-black border border-mar rounded-full flex items-center justify-center">
                <span className="text-mar text-sm">✓</span>
              </div>
              <h2 className="text-lg font-herm text-white">{dict?.success}</h2>
            </div>
            <button
              onClick={context.hideSuccess}
              className="text-white hover:text-ama transition-colors font-herm"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="text-white font-herm text-sm leading-relaxed mb-4">
              {context.successData.message}
            </p>

            {context.successData.txHash && (
              <div className="bg-black border border-white rounded-sm p-3">
                <p className="text-sm text-ama font-herm mb-2">{dict?.tx}</p>
                {explorerUrl ? (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-mar hover:text-ama break-all underline transition-colors"
                  >
                    {context.successData.txHash}
                  </a>
                ) : (
                  <p className="text-xs font-mono text-mar break-all">
                    {context.successData.txHash}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={context.hideSuccess}
              className="px-4 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors"
            >
              {dict?.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
