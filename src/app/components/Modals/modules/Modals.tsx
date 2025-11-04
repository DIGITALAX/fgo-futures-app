"use client";

import { useContext } from "react";
import { Success } from "./Success";
import { Error } from "./Error";
import { AppContext } from "@/app/lib/providers/Providers";
import { OpenContract } from "./OpenContract";
import { SellOrder } from "./SellOrder";
import { FillOrder } from "./FillOrder";

export const Modals = ({ dict, lang }: { dict: any; lang: string }) => {
  const context = useContext(AppContext);

  if (!context) return null;

  return (
    <>
      {context?.openContract && <OpenContract lang={lang} dict={dict} />}
      {context?.sellOrder && <SellOrder lang={lang} dict={dict} />}
      {context?.fillOrder && <FillOrder lang={lang} dict={dict} />}
      {context.successData && <Success lang={lang} />}
      {context.errorData && <Error lang={lang} />}
    </>
  );
};
