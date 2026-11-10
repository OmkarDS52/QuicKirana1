import { useCallback } from 'react'
import { t, type TranslationKey } from '../i18n/translations'
import { useApp } from '../context/AppContext'

export function useTranslation() {
  const { language } = useApp()
  const tr = useCallback((key: TranslationKey) => t(language, key), [language])
  return { t: tr, language }
}
