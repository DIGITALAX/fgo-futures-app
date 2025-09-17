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
    depositLoading,
    withdrawLoading,
  } = useEscrow();

  const {
    orderCancelLoading,
    orderFillLoading,
    sellOrderLoading,
    handleSellOrder,
    handleFillOrder,
    handleCancelOrder,
    handleCancelFuture,
    futureCancelLoading,
  } = useTrade();

  const {
    physicalRights,
    physicalLoading,
    physicalUserLoading,
    physicalRightsUser,
    physicalRightsEscrowed,
    physicalEscrowedLoading,
    physicalUserEscrowedLoading,
    physicalRightsUserEscrowed,
  } = usePhysicalRights();

  return (
    <div className="w-full p-6 flex items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center gap-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 h-[45rem]">
          <Transfer
            dict={dict}
            physicalRights={physicalRights}
            physicalLoading={physicalLoading}
            physicalUserLoading={physicalUserLoading}
            physicalRightsUser={physicalRightsUser}
          />
          <Escrow
            dict={dict}
            handleDepositPhysicalRights={handleDepositPhysicalRights}
            depositLoading={depositLoading}
            physicalRightsEscrowed={physicalRightsEscrowed}
            physicalEscrowedLoading={physicalEscrowedLoading}
            physicalUserEscrowedLoading={physicalUserEscrowedLoading}
            physicalRightsUserEscrowed={physicalRightsUserEscrowed}
          />
          <Create
            dict={dict}
            escrowLoading={escrowLoading}
            escrowUserLoading={escrowUserLoading}
            escrowedRights={escrowedRights}
            escrowedRightsUser={escrowedRightsUser}
            handleWithdrawPhysicalRights={handleWithdrawPhysicalRights}
            withdrawLoading={withdrawLoading}
          />
        </div>
        <Orders
          dict={dict}
          orderCancelLoading={orderCancelLoading}
          orderFillLoading={orderFillLoading}
          sellOrderLoading={sellOrderLoading}
          handleSellOrder={handleSellOrder}
          handleFillOrder={handleFillOrder}
          handleCancelOrder={handleCancelOrder}
          handleCancelFuture={handleCancelFuture}
          futureCancelLoading={futureCancelLoading}
        />
      </div>
    </div>
  );
};

export default Trade;
