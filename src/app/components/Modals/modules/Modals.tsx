"use client";

import { useContext } from "react";
import { Success } from "./Success";
import { Error } from "./Error";
import { AppContext } from "@/app/lib/providers/Providers";
import { OpenContract } from "./OpenContract";

export const Modals = ({ dict }: { dict: any }) => {
  const context = useContext(AppContext);

  if (!context) return null;

  return (
    <>
      {context?.openContract && <OpenContract dict={dict} />}
      {context.successData && <Success dict={dict} />}
      {context.errorData && <Error dict={dict} />}
    </>
  );
};
