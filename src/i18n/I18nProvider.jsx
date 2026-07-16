"use client"

import { createContext, useState } from "react"
import { locales } from "./locales"

export const I18nContext = createContext()

export function I18nProvider({ children }) {

  const [locale, setLocale] = useState("en")

  const dictionary = locales[locale]

  return (
    <I18nContext.Provider value={{ locale, setLocale, dictionary }}>
      {children}
    </I18nContext.Provider>
  )
}