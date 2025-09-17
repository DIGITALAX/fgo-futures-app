import { useContext, useEffect, useState } from "react";
import { PhysicalRight } from "../types/layout.types";
import {
  getPhysicalRightsAll,
  getPhysicalRightsBuyer,
  getPhysicalRightsAllEscrowed,
  getPhysicalRightsBuyerEscrowed,
} from "@/app/lib/subgraph/queries/getPhysicalRights";
import { useAccount } from "wagmi";
import { AppContext } from "@/app/lib/providers/Providers";

const usePhysicalRights = () => {
  const context = useContext(AppContext);
  const { address } = useAccount();
  const [physicalRights, setPhysicalRights] = useState<PhysicalRight[]>([]);
  const [physicalRightsEscrowed, setPhysicalRightsEscrowed] = useState<
    PhysicalRight[]
  >([]);
  const [physicalRightsUserEscrowed, setPhysicalRightsUserEscrowed] = useState<
    PhysicalRight[]
  >([]);
  const [physicalRightsUser, setPhysicalRightsUser] = useState<PhysicalRight[]>(
    []
  );
  const [physicalLoading, setPhysicalLoading] = useState<boolean>(false);
  const [physicalUserLoading, setPhysicalUserLoading] =
    useState<boolean>(false);
  const [physicalEscrowedLoading, setPhysicalEscrowedLoading] =
    useState<boolean>(false);
  const [physicalUserEscrowedLoading, setPhysicalUserEscrowedLoading] =
    useState<boolean>(false);

  const getPhysicalRights = async () => {
    setPhysicalLoading(true);
    try {
      const data = await getPhysicalRightsAll();
      setPhysicalRights(data?.data?.physicalRights_collection);
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalLoading(false);
  };

  const getPhysicalRightsEscrowed = async () => {
    setPhysicalLoading(true);
    try {
      const data = await getPhysicalRightsAllEscrowed();
      setPhysicalRightsEscrowed(data?.data?.physicalRights_collection);
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalLoading(false);
  };

  const getPhysicalRightsUser = async () => {
    if (!address) return;
    setPhysicalUserLoading(true);
    try {
      const data = await getPhysicalRightsBuyer(address);
      setPhysicalRightsUser(data?.data?.physicalRights_collection);
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalUserLoading(false);
  };

  const getPhysicalRightsUserEscrowed = async () => {
    if (!address) return;
    setPhysicalUserLoading(true);
    try {
      const data = await getPhysicalRightsBuyerEscrowed(address);
      setPhysicalRightsUserEscrowed(data?.data?.physicalRights_collection);
    } catch (err: any) {
      console.error(err.message);
    }
    setPhysicalUserLoading(false);
  };

  useEffect(() => {
    if (physicalRights.length < 1) {
      getPhysicalRights();
      getPhysicalRightsEscrowed();
    }
  }, [context?.hideSuccess]);

  useEffect(() => {
    if (physicalRightsUser.length < 1 && address) {
      getPhysicalRightsUser();
      getPhysicalRightsUserEscrowed();
    }
  }, [address, context?.hideSuccess]);

  return {
    physicalRights,
    physicalLoading,
    physicalUserLoading,
    physicalRightsUser,
    physicalRightsEscrowed,
    physicalEscrowedLoading,
    physicalUserEscrowedLoading,
    physicalRightsUserEscrowed,
  };
};

export default usePhysicalRights;
