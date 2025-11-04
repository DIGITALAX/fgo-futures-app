import { tParams } from "@/app/[lang]/layout";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Header from "./Header";

export default async function HeaderEntry({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(
    lang ?? "en"
  );
  return <Header dict={dict} lang={lang ?? "en"} />;
}
