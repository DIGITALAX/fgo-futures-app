import HeaderEntry from "../components/Layout/modules/HeaderEntry";
import ModalsEntry from "../components/Modals/modules/ModalsEntry";

export type tParams = Promise<{ lang: string }>;
export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "es" },
    { lang: "pt" },
    { lang: "yi" },
    { lang: "fr" },
    { lang: "gd" },
  ];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <div className="flex relative bg-trading-hero w-full flex-col gap-3 py-4 min-h-screen">
      <HeaderEntry params={params} />
      {children}
      <ModalsEntry params={params} />
    </div>
  );
}
