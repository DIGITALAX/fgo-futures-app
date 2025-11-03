import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  pt: () => import("./dictionaries/pt.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  gd: () => import("./dictionaries/gd.json").then((module) => module.default),
  yi: () => import("./dictionaries/yi.json").then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries?.[locale]?.();
