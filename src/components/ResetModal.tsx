import { type Language, t } from '../i18n'
import { formatNumber } from '../utils/number'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

export interface ResetModalProps {
  resets: number
  onCancel: () => void
  onConfirm: () => void
  lang: Language
}

export default function ResetModal({ resets, onCancel, onConfirm, lang }: ResetModalProps) {
  const copy = t[lang]
  return (
    <Modal
      title={copy.reset}
      onClose={onCancel}
      closeLabel={copy.closeModal}
      className="max-w-md text-center"
    >
      <p className="text-canopy-muted">{copy.resetYourProgress}</p>
      <dl className="mt-4 space-y-2 rounded-xl border border-canopy-line bg-canopy-bg p-4 text-left">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-canopy-muted">
            {copy.currentResets}
          </dt>
          <dd className="font-mono text-lg font-bold text-canopy-text">{resets}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-canopy-muted">
            {copy.startingEnergy}
          </dt>
          <dd className="font-mono text-lg font-bold text-canopy-sap">
            +{formatNumber((resets + 1) * 1000)}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          {copy.cancel}
        </Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm}>
          {copy.confirmReset}
        </Button>
      </div>
    </Modal>
  )
}
