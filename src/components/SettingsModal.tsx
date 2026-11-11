import { Check, Copy, Download, Monitor, Save, Skull, Upload, Volume2, VolumeX } from 'lucide-react'
import type React from 'react'
import type { AudioSettings } from '../audio'
import { type Language, t } from '../i18n'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

export interface SettingsModalProps {
  audio: AudioSettings
  onToggleMute: () => void
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  lowPerformance: boolean
  onTogglePerformance: () => void
  onManualSave: () => void
  onExport: () => void
  exportString: string
  onCopyExport: () => void
  copySuccess: boolean
  importString: string
  onImportStringChange: (v: string) => void
  onImport: () => void
  importError: string
  onHardReset: () => void
  onClose: () => void
  lang: Language
}

export default function SettingsModal({
  audio,
  onToggleMute,
  onVolumeChange,
  lowPerformance,
  onTogglePerformance,
  onManualSave,
  onExport,
  exportString,
  onCopyExport,
  copySuccess,
  importString,
  onImportStringChange,
  onImport,
  importError,
  onHardReset,
  onClose,
  lang,
}: SettingsModalProps) {
  const copy = t[lang]
  return (
    <Modal title={copy.options} onClose={onClose} closeLabel={copy.closeModal}>
      <div className="space-y-3">
        <section className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-canopy-text">{copy.audio}</h3>
            <Button variant="secondary" onClick={onToggleMute} aria-pressed={audio.muted}>
              {audio.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {audio.muted ? copy.off : copy.on}
            </Button>
          </div>
          <label
            className="block text-xs font-semibold uppercase tracking-wide text-canopy-muted"
            htmlFor="volume"
          >
            {copy.volume} · {Math.round(audio.volume * 100)}%
          </label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.volume}
            onChange={onVolumeChange}
            className="mt-2 h-11 w-full accent-canopy-sap"
          />
        </section>

        <section className="flex items-center justify-between gap-3 rounded-xl border border-canopy-line bg-canopy-bg p-4">
          <div>
            <h3 className="font-semibold text-canopy-text">{copy.lowPerformance}</h3>
            <p className="text-sm text-canopy-muted">{copy.reducesVisualEffects}</p>
          </div>
          <Button
            variant={lowPerformance ? 'primary' : 'secondary'}
            onClick={onTogglePerformance}
            aria-pressed={lowPerformance}
          >
            <Monitor className="h-4 w-4" />
            {lowPerformance ? copy.on : copy.off}
          </Button>
        </section>

        <section className="flex items-center justify-between gap-3 rounded-xl border border-canopy-line bg-canopy-bg p-4">
          <div>
            <h3 className="font-semibold text-canopy-text">{copy.manualSave}</h3>
            <p className="text-sm text-canopy-muted">{copy.saveProgressImmediately}</p>
          </div>
          <Button onClick={onManualSave}>
            <Save className="h-4 w-4" /> {copy.save}
          </Button>
        </section>

        <section className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-canopy-text">{copy.exportSave}</h3>
              <p className="text-sm text-canopy-muted">{copy.getSaveCode}</p>
            </div>
            <Button variant="secondary" onClick={onExport}>
              <Download className="h-4 w-4" /> {copy.generate}
            </Button>
          </div>
          {exportString ? (
            <div className="relative mt-3">
              <textarea
                readOnly
                value={exportString}
                aria-label={copy.exportSave}
                className="h-24 w-full resize-none rounded-lg border border-canopy-line bg-canopy-panel p-2 pr-12 font-mono text-xs text-canopy-muted"
              />
              <Button
                variant="ghost"
                className="absolute top-2 right-2 min-h-10 px-2"
                onClick={onCopyExport}
                aria-label={copySuccess ? copy.saveSuccess : copy.exportSave}
              >
                {copySuccess ? (
                  <Check className="h-4 w-4 text-canopy-leaf" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
          <h3 className="font-semibold text-canopy-text">{copy.importSave}</h3>
          <p className="text-sm text-canopy-muted">{copy.pasteSaveCode}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={importString}
              onChange={event => onImportStringChange(event.target.value)}
              placeholder={copy.pasteSaveString}
              aria-label={copy.pasteSaveString}
              className="min-h-11 flex-1 rounded-lg border border-canopy-line bg-canopy-panel px-3 text-sm text-canopy-text"
            />
            <Button variant="secondary" onClick={onImport}>
              <Upload className="h-4 w-4" /> {copy.import}
            </Button>
          </div>
          {importError ? (
            <p className="mt-2 text-sm font-semibold text-canopy-hp" role="alert">
              {importError}
            </p>
          ) : null}
        </section>

        <section className="flex items-center justify-between gap-3 rounded-xl border border-canopy-danger/60 bg-canopy-danger/20 p-4">
          <div>
            <h3 className="font-semibold text-canopy-on-danger">{copy.hardReset}</h3>
            <p className="text-sm text-canopy-hp">{copy.wipeAllProgress}</p>
          </div>
          <Button variant="danger" onClick={onHardReset}>
            <Skull className="h-4 w-4" /> {copy.wipeSave}
          </Button>
        </section>
      </div>
    </Modal>
  )
}
