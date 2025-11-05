"use client";

import { JSX } from "react";
import { Modals } from "../../Modals/modules/Modals";
import Header from "./Header";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <div className="flex relative bg-trading-hero w-full flex-col gap-3 py-4 min-h-screen">
      <Header dict={dict} lang={"en"} />
      {page}
      <Modals dict={dict} lang={"en"} />
    </div>
  );
}
