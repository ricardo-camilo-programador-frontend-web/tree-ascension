import { type Language, t } from '../i18n'
import { uiText } from '../i18n/ui-text'
import { Button } from './ui/Button'
import { EmptyState } from './ui/EmptyState'
import { Modal } from './ui/Modal'

export interface SkillEvolutionOption {
  id: string
  name: string
  description: string
}

export interface SkillEvolutionModalProps {
  options: SkillEvolutionOption[]
  onSelect: (id: string) => void
  lang: Language
}

export default function SkillEvolutionModal({ options, onSelect, lang }: SkillEvolutionModalProps) {
  const copy = t[lang]
  return (
    <Modal
      title={copy.evolvePlant}
      onClose={() => undefined}
      closeLabel={copy.close}
      closeOnBackdrop={false}
      showClose={false}
    >
      <p className="mb-4 text-sm text-canopy-muted">{copy.chooseUpgradePath}</p>
      {options.length === 0 ? (
        <EmptyState title={copy.evolutions} body={uiText(copy, 'noEvolutions')} />
      ) : (
        <div className="flex flex-col gap-2">
          {options.map(option => (
            <Button
              key={option.id}
              variant="secondary"
              className="h-auto min-h-11 flex-col items-start py-3 text-left"
              onClick={() => onSelect(option.id)}
            >
              <span className="text-canopy-leaf">{option.name}</span>
              <span className="text-xs font-normal text-canopy-muted">{option.description}</span>
            </Button>
          ))}
        </div>
      )}
    </Modal>
  )
}
