// import 'server-only'
"use-client"
 
const dictionaries: any = {
  en: () => import('./en.json').then((module) => module.default),
  mi: () => import('./mi.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: any) => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  } else {
    // Handle the case where the locale does not exist
    throw new Error(`No dictionary found for locale: ${locale}`);
  }
};