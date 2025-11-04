import { getDictionary } from "./[lang]/dictionaries";
import Entry from "./components/Layout/modules/Entry";
import Wrapper from "./components/Layout/modules/Wrapper";

export default async function Home() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper dict={dict} page={<Entry dict={dict} lang={"en"} />}></Wrapper>
  );
}
