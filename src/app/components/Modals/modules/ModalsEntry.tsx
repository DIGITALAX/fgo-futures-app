import { tParams } from "@/app/[lang]/layout";
import { Modals } from "./Modals";
import { getDictionary } from "@/app/[lang]/dictionaries";

export default async function ModalsEntry({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(
    lang ?? "en"
  );
  return <Modals dict={dict} />;
}
