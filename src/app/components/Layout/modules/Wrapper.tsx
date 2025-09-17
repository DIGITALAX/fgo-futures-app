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
    <div className="flex relative w-full flex-col gap-3 py-4 min-h-screen">
      <Header dict={dict} />
      {page}
      <Modals dict={dict} />
    </div>
  );
}
