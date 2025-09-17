import { getDictionary } from "@/app/[lang]/dictionaries";
import Entry from "../components/Layout/modules/Entry";

export default async function Home({
  params,
}: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Entry dict={dict} />;
}
