import { AppContext } from "@/app/lib/providers/Providers";
import { useContext } from "react";

export const Error = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext
  );

  if (!context?.errorData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-herm text-white">{dict?.error}</h2>
            </div>
            <button
              onClick={context.hideError}
              className="text-white hover:text-ama transition-colors font-herm"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="text-white font-herm text-sm leading-relaxed whitespace-pre-wrap break-words">
              {context.errorData.message}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={context.hideError}
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
