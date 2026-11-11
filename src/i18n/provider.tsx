import { type ReactNode, useEffect, useState } from 'react'
import { type Language, loadLanguage } from './index'

export function I18nProvider({ lang, children }: { lang: Language; children: ReactNode }) {
  const [, setRevision] = useState(0)

  useEffect(() => {
    let live = true
    document.documentElement.lang = lang
    void loadLanguage(lang).then(() => {
      if (live) setRevision(value => value + 1)
    })
    return () => {
      live = false
    }
  }, [lang])

  return children
}
