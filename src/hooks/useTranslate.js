"use client"

import { useContext } from "react"
import { I18nContext } from "@/i18n/I18nProvider"

export function useTranslate() {
  const { dictionary } = useContext(I18nContext)
  return dictionary
}