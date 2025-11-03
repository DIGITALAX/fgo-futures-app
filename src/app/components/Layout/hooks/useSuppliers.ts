import { useEffect, useState } from "react";
import { Supplier } from "../types/layout.types";
import { getSuppliers } from "@/app/lib/subgraph/queries/getSuppliers";
import { ensureMetadata } from "@/app/lib/utils";

const useSuppliers = () => {
  const [suppliersLoading, setSuppliersLoading] = useState<boolean>(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersSkip, setSuppliersSkip] = useState<number>(0);
  const [hasMoreSuppliers, setHasMoreSuppliers] = useState<boolean>(true);

  const getAllSuppliers = async (reset: boolean = false) => {
    setSuppliersLoading(true);
    try {
      const skipValue = reset ? 0 : suppliersSkip;
      const data = await getSuppliers(20, skipValue);

      let allSuppliers = data?.data?.suppliers;

      allSuppliers = await Promise.all(
        allSuppliers.map(async (sup: any) => {
          sup = await ensureMetadata(sup);

          return {
            ...sup,
            futures: await Promise.all(
              sup?.futures?.map(
                async (fut: any) => await ensureMetadata(fut)
              )
            ),
          };
        })
      );

      if (!allSuppliers || allSuppliers.length < 20) {
        setHasMoreSuppliers(false);
      }

      if (reset) {
        setSuppliers(allSuppliers);
        setSuppliersSkip(20);
      } else {
        setSuppliers((prev) => [
          ...prev,
          ...(allSuppliers?.length < 1 ? [] : allSuppliers),
        ]);
        setSuppliersSkip((prev) => prev + 20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSuppliersLoading(false);
  };

  useEffect(() => {
    if (suppliers.length < 1) {
      getAllSuppliers(true);
    }
  }, []);

  const loadMoreSuppliers = () => {
    if (!suppliersLoading && hasMoreSuppliers) {
      getAllSuppliers(false);
    }
  };

  return {
    suppliersLoading,
    suppliers,
    hasMoreSuppliers,
    loadMoreSuppliers,
  };
};

export default useSuppliers;
