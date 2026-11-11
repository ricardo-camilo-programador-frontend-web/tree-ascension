import { type Language, t } from '../i18n'
import { uiText } from '../i18n/ui-text'
import { Button } from './ui/Button'

const STORAGE_KEY = 'idleTD_onboarding_v1'

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

export function dismissOnboarding(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Private mode can reject storage; the hint just returns next visit.
  }
}

export function OnboardingHint({ lang, onDismiss }: { lang: Language; onDismiss: () => void }) {
  const copy = t[lang]
  return (
    <div className="absolute top-3 left-3 z-20 max-w-[15rem] rounded-2xl border border-canopy-line bg-canopy-panel/95 p-2.5 shadow-xl">
      <p className="text-xs leading-snug text-canopy-text">{uiText(copy, 'onboarding')}</p>
      <Button variant="sap" className="mt-3" onClick={onDismiss}>
        {uiText(copy, 'gotIt')}
      </Button>
    </div>
  )
}
