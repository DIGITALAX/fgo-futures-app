import { useEffect, useState } from "react";
import { Fulfiller } from "../types/layout.types";
import { getFulfillers } from "@/app/lib/subgraph/queries/getFulfillers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { fetchMetadataFromIPFS } from "@/app/lib/utils";

const useFulfillers = () => {
  const [fulfillersLoading, setFulfillersLoading] = useState<boolean>(false);
  const [fulfillers, setFulfillers] = useState<Fulfiller[]>([]);
  const [fulfillersSkip, setFulfillersSkip] = useState<number>(0);
  const [hasMoreFulfillers, setHasMoreFulfillers] = useState<boolean>(true);

  const resolveWorkflowSteps = async (steps: any[]) => {
    if (!steps || steps.length === 0) return [];

    return Promise.all(
      steps.map(async (step) => {
        let resolvedInstructions = step.instructions || "";
        if (
          step.instructions &&
          typeof step.instructions === "string" &&
          step.instructions.startsWith("ipfs://")
        ) {
          try {
            const instructionsData = await fetchMetadataFromIPFS(
              step.instructions
            );
            resolvedInstructions =
              instructionsData?.instructions || step.instructions;
          } catch (error) {
            resolvedInstructions = step.instructions;
          }
        }

        return {
          ...step,
          instructions: resolvedInstructions,
        };
      })
    );
  };

  const getAllFulfillers = async (reset: boolean = false) => {
    setFulfillersLoading(true);
    try {
      const skipValue = reset ? 0 : fulfillersSkip;
      const data = await getFulfillers(20, skipValue);

      let allFulfillers = data?.data?.fulfillers;
      if (!allFulfillers || allFulfillers.length < 20) {
        setHasMoreFulfillers(false);
      }

      let processed = await Promise.all(
        allFulfillers.map(async (full: any) => {
          let fulfillments = await Promise.all(
            full?.fulfillments?.map(async (flow: any) => {
              let resolvedDetails = flow?.order?.fulfillmentData;

              if (
                typeof flow?.order?.fulfillmentData === "string" &&
                flow?.order?.fulfillmentData.trim() !== ""
              ) {
                const cid = flow?.order?.fulfillmentData.includes("ipfs://")
                  ? flow?.order?.fulfillmentData.split("ipfs://")?.[1]
                  : flow?.order?.fulfillmentData;

                if (cid) {
                  const response = await fetch(`${INFURA_GATEWAY}${cid}`);
                  if (response.ok) {
                    resolvedDetails = await response.json();
                  }
                }
              }

              const steps = await Promise.all(
                flow?.fulfillmentOrderSteps?.map(async (item: any) => {
                  let resolvedNotes = item?.notes || "";
                  if (
                    item?.notes &&
                    typeof item.notes === "string" &&
                    item.notes.startsWith("ipfs://")
                  ) {
                    try {
                      const notesData = await fetchMetadataFromIPFS(item.notes);
                      resolvedNotes =
                        typeof notesData === "string"
                          ? notesData
                          : notesData?.notes || item.notes;
                    } catch (error) {
                      resolvedNotes = item.notes;
                    }
                  }
                  return {
                    ...item,
                    notes: resolvedNotes,
                  };
                })
              );

              const resolvedDigitalSteps = await resolveWorkflowSteps(
                flow?.digitalSteps || []
              );
              const resolvedPhysicalSteps = await resolveWorkflowSteps(
                flow?.physicalSteps || []
              );

              return {
                ...flow,
                fulfillmentOrderSteps: steps,
                digitalSteps: resolvedDigitalSteps,
                physicalSteps: resolvedPhysicalSteps,
                order: {
                  ...flow?.order,
                  fulfillmentData: resolvedDetails,
                },
              };
            })
          );

          return {
            ...full,
            fulfillments,
          };
        })
      );

      if (reset) {
        setFulfillers(processed);
        setFulfillersSkip(20);
      } else {
        setFulfillers((prev) => [
          ...prev,
          ...(processed?.length < 1 ? [] : processed),
        ]);
        setFulfillersSkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFulfillersLoading(false);
  };

  useEffect(() => {
    if (fulfillers.length < 1) {
      getAllFulfillers(true);
    }
  }, []);

  const loadMoreFulfillers = () => {
    if (!fulfillersLoading && hasMoreFulfillers) {
      getAllFulfillers(false);
    }
  };

  return {
    fulfillersLoading,
    fulfillers,
    hasMoreFulfillers,
    loadMoreFulfillers,
  };
};

export default useFulfillers;
