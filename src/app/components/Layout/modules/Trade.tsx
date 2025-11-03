"use client";

import { FunctionComponent } from "react";
import Create from "./Create";
import Orders from "./Orders";
import Escrow from "./Escrow";
import Transfer from "./Transfer";
import useEscrow from "./../hooks/useEscrow";
import useTrade from "../hooks/useTrade";
import usePhysicalRights from "../hooks/usePhysicalRights";

const Trade: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const {
    escrowLoading,
    escrowUserLoading,
    escrowedRights,
    escrowedRightsUser,
    handleDepositPhysicalRights,
    handleWithdrawPhysicalRights,
    depositLoadingKey,
    withdrawLoadingKey,
    hasMoreEscrowedRights,
    hasMoreEscrowedRightsUser,
    loadMoreEscrowedRights,
    loadMoreEscrowedRightsUser,
  } = useEscrow(dict);

  const {
    loadingKeys,
    handleCancelOrder,
    handleCancelFuture,
  } = useTrade(dict);

  const {
    physicalRights,
    physicalLoading,
    physicalUserLoading,
    physicalRightsUser,
    physicalRightsEscrowed,
    physicalEscrowedLoading,
    physicalUserEscrowedLoading,
    physicalRightsUserEscrowed,
    hasMorePhysicalRights,
    hasMorePhysicalRightsUser,
    hasMorePhysicalRightsEscrowed,
    hasMorePhysicalRightsUserEscrowed,
    loadMorePhysicalRights,
    loadMorePhysicalRightsUser,
    loadMorePhysicalRightsEscrowed,
    loadMorePhysicalRightsUserEscrowed,
  } = usePhysicalRights();

  return (
    <div className="w-full p-2 sm:p-4 lg:p-6 flex items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-6">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 h-fit md:h-[45rem]">
          <Transfer
            dict={dict}
            physicalRights={physicalRights}
            physicalLoading={physicalLoading}
            physicalUserLoading={physicalUserLoading}
            physicalRightsUser={physicalRightsUser}
            hasMorePhysicalRights={hasMorePhysicalRights}
            hasMorePhysicalRightsUser={hasMorePhysicalRightsUser}
            loadMorePhysicalRights={loadMorePhysicalRights}
            loadMorePhysicalRightsUser={loadMorePhysicalRightsUser}
          />
          <Escrow
            dict={dict}
            handleDepositPhysicalRights={handleDepositPhysicalRights}
            depositLoadingKey={depositLoadingKey}
            physicalRightsEscrowed={physicalRightsEscrowed}
            physicalEscrowedLoading={physicalEscrowedLoading}
            physicalUserEscrowedLoading={physicalUserEscrowedLoading}
            physicalRightsUserEscrowed={physicalRightsUserEscrowed}
            hasMorePhysicalRightsEscrowed={hasMorePhysicalRightsEscrowed}
            hasMorePhysicalRightsUserEscrowed={
              hasMorePhysicalRightsUserEscrowed
            }
            loadMorePhysicalRightsEscrowed={loadMorePhysicalRightsEscrowed}
            loadMorePhysicalRightsUserEscrowed={
              loadMorePhysicalRightsUserEscrowed
            }
          />
          <Create
            dict={dict}
            escrowLoading={escrowLoading}
            escrowUserLoading={escrowUserLoading}
            escrowedRights={escrowedRights}
            escrowedRightsUser={escrowedRightsUser}
            handleWithdrawPhysicalRights={handleWithdrawPhysicalRights}
            withdrawLoadingKey={withdrawLoadingKey}
            hasMoreEscrowedRights={hasMoreEscrowedRights}
            hasMoreEscrowedRightsUser={hasMoreEscrowedRightsUser}
            loadMoreEscrowedRights={loadMoreEscrowedRights}
            loadMoreEscrowedRightsUser={loadMoreEscrowedRightsUser}
            handleCancelFuture={handleCancelFuture}
            loadingKeys={loadingKeys}
          />
        </div>
        <Orders
          dict={dict}
          loadingKeys={loadingKeys}
          handleCancelOrder={handleCancelOrder}
        />
      </div>
    </div>
  );
};

export default Trade;
