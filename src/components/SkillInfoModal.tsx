import { type Language, t } from '../i18n'
import { uiText } from '../i18n/ui-text'
import { EmptyState } from './ui/EmptyState'
import { Modal } from './ui/Modal'

export interface SkillInfoModalProps {
  skillId: string | null
  onClose: () => void
  getSkillName: (id: string | null) => string
  getSkillLevel: (id: string | null) => number
  getSkillEffect: (id: string | null) => string
  getSkillCooldown: (id: string | null) => string | number
  getSkillDescription: (id: string | null) => string
  getSkillEvolutions: (id: string | null) => string[]
  formatEvolutionName: (id: string) => string
  lang: Language
}

export default function SkillInfoModal({
  skillId,
  onClose,
  getSkillName,
  getSkillLevel,
  getSkillEffect,
  getSkillCooldown,
  getSkillDescription,
  getSkillEvolutions,
  formatEvolutionName,
  lang,
}: SkillInfoModalProps) {
  const copy = t[lang]
  const evolutions = getSkillEvolutions(skillId)
  return (
    <Modal title={getSkillName(skillId)} onClose={onClose} closeLabel={copy.closeModal}>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-3 border-b border-canopy-line pb-2">
          <dt className="text-canopy-muted">{copy.level}</dt>
          <dd className="font-semibold text-canopy-text">{getSkillLevel(skillId)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-canopy-line pb-2">
          <dt className="text-canopy-muted">{copy.effect}</dt>
          <dd className="text-right font-semibold text-canopy-leaf">{getSkillEffect(skillId)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-canopy-line pb-2">
          <dt className="text-canopy-muted">{copy.cooldown}</dt>
          <dd className="font-semibold text-canopy-text">{getSkillCooldown(skillId)}s</dd>
        </div>
        <div>
          <dt className="text-canopy-muted">{copy.description}</dt>
          <dd className="mt-1 text-canopy-text">{getSkillDescription(skillId)}</dd>
        </div>
        <div>
          <dt className="mb-2 text-canopy-muted">{copy.unlockedEvolutions}</dt>
          <dd>
            {evolutions.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-canopy-leaf">
                {evolutions.map(evolution => (
                  <li key={evolution}>{formatEvolutionName(evolution)}</li>
                ))}
              </ul>
            ) : (
              <EmptyState title={copy.evolutions} body={uiText(copy, 'noEvolutions')} />
            )}
          </dd>
        </div>
      </dl>
    </Modal>
  )
}
