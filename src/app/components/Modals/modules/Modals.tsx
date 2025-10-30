"use client";

import { useContext } from "react";
import { Success } from "./Success";
import { Error } from "./Error";
import { AppContext } from "@/app/lib/providers/Providers";
import { OpenContract } from "./OpenContract";
import { SellOrder } from "./SellOrder";
import { FillOrder } from "./FillOrder";

export const Modals = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);

  if (!context) return null;

  return (
    <>
      {context?.openContract && <OpenContract dict={dict} />}
      {context?.sellOrder && <SellOrder dict={dict} />}
      {context?.fillOrder && <FillOrder dict={dict} />}
      {context.successData && <Success />}
      {context.errorData && <Error />}
    </>
  );
};
