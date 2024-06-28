// import 'server-only'
"use-client"
 
const dictionaries: any = {
  en: () => import('./en.json').then((module) => module.default),
  // nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: any) => dictionaries[locale]()