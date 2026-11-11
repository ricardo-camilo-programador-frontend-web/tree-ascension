import {
  AlertTriangle,
  Coffee,
  Globe,
  HeartPulse,
  Info,
  Leaf,
  Sparkles,
  Utensils,
  Zap,
} from 'lucide-react'
import { type Language, t } from '../i18n'

const MoringaInfo = ({ lang }: { lang: Language }) => {
  const page = t[lang].moringa
  const benefits = [
    { title: page.benefit1Title, desc: page.benefit1Desc },
    { title: page.benefit2Title, desc: page.benefit2Desc },
    { title: page.benefit3Title, desc: page.benefit3Desc },
    { title: page.benefit4Title, desc: page.benefit4Desc },
    { title: page.benefit5Title, desc: page.benefit5Desc },
    { title: page.benefit6Title, desc: page.benefit6Desc },
  ]
  const facts = [
    { label: page.originLabel, text: page.originText },
    { label: page.cultivationLabel, text: page.cultivationText },
    { label: page.growthLabel, text: page.growthText },
    { label: page.appearanceLabel, text: page.appearanceText },
  ]
  const steps = [
    { title: page.consumptionTeaTitle, desc: page.consumptionTeaDesc },
    { title: page.consumptionLeafTitle, desc: page.consumptionLeafDesc },
    { title: page.consumptionPowderTitle, desc: page.consumptionPowderDesc },
    { title: page.consumptionCapsulesTitle, desc: page.consumptionCapsulesDesc },
  ]

  return (
    <section
      id="moringa-info"
      lang={lang}
      className="bg-canopy-bg px-4 py-12 text-canopy-text md:px-8"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '900px' }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-canopy-sap">
            {t[lang].title}
          </p>
          <h2 className="mt-2 font-display text-3xl text-canopy-text md:text-5xl">{page.title}</h2>
        </header>

        <div className="mb-10 grid items-center gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold text-canopy-leaf">
              <Info className="h-6 w-6" aria-hidden="true" /> {page.introTitle}
            </h3>
            <p className="mb-3 leading-relaxed text-canopy-muted">{page.introText1}</p>
            <p className="leading-relaxed text-canopy-muted">{page.introText2}</p>
          </div>
          <figure className="rounded-3xl border border-canopy-line bg-canopy-panel p-8 text-center">
            <Leaf className="mx-auto h-14 w-14 text-canopy-leaf" aria-hidden="true" />
            <blockquote className="mt-4 font-display text-xl text-canopy-sap">
              {page.introQuote}
            </blockquote>
          </figure>
        </div>

        <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-canopy-leaf">
          <Globe className="h-6 w-6" aria-hidden="true" /> {page.originTitle}
        </h3>
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(fact => (
            <article
              key={fact.label}
              className="rounded-2xl border border-canopy-line bg-canopy-panel p-4"
            >
              <h4 className="text-xs font-semibold uppercase tracking-wide text-canopy-sap">
                {fact.label}
              </h4>
              <p className="mt-2 text-sm text-canopy-muted">{fact.text}</p>
            </article>
          ))}
        </div>

        <div className="mb-10 rounded-3xl border border-canopy-line bg-canopy-panel p-6 md:p-8">
          <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
            <Zap className="h-6 w-6 text-canopy-sap" aria-hidden="true" /> {page.nutritionTitle}
          </h3>
          <p className="mb-4 text-canopy-muted">{page.nutritionText}</p>
          <ul className="grid gap-2 text-sm text-canopy-text md:grid-cols-2">
            {[
              page.nutritionVitamins,
              page.nutritionMinerals,
              page.nutritionProteins,
              page.nutritionAntioxidants,
            ].map(item => (
              <li key={item} className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-canopy-leaf" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-canopy-leaf">
          <HeartPulse className="h-6 w-6" aria-hidden="true" /> {page.benefitsTitle}
        </h3>
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          {benefits.map(item => (
            <article
              key={item.title}
              className="rounded-2xl border-l-4 border-canopy-leaf bg-canopy-panel p-4"
            >
              <h4 className="font-semibold text-canopy-text">{item.title}</h4>
              <p className="mt-1 text-sm text-canopy-muted">{item.desc}</p>
            </article>
          ))}
        </div>
        <p className="mb-10 flex gap-3 rounded-xl border border-canopy-warn/50 bg-canopy-raised p-4 text-sm text-canopy-warn">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
          {page.medicalNote}
        </p>

        <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-canopy-leaf">
          <Utensils className="h-6 w-6" aria-hidden="true" /> {page.usesTitle}
        </h3>
        <div className="mb-10 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-canopy-line bg-canopy-panel p-4 md:col-span-1">
            <h4 className="font-semibold text-canopy-sap">{page.useFoodTitle}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-canopy-muted">
              <li>{page.useFoodLeaf}</li>
              <li>{page.useFoodPowder}</li>
              <li>{page.useFoodPods}</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-canopy-line bg-canopy-panel p-4">
            <h4 className="font-semibold text-canopy-sap">{page.useMedicinalTitle}</h4>
            <p className="mt-2 text-sm text-canopy-muted">{page.useMedicinalText}</p>
          </article>
          <article className="rounded-2xl border border-canopy-line bg-canopy-panel p-4">
            <h4 className="font-semibold text-canopy-sap">{page.useIndustrialTitle}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-canopy-muted">
              <li>{page.useIndustrialOil}</li>
              <li>{page.useIndustrialPurification}</li>
            </ul>
          </article>
        </div>

        <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-canopy-leaf">
          <Coffee className="h-6 w-6" aria-hidden="true" /> {page.consumptionTitle}
        </h3>
        <ol className="mb-10 grid gap-3 md:grid-cols-2">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-3 rounded-2xl border border-canopy-line bg-canopy-panel p-4"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canopy-raised font-mono text-canopy-sap">
                {index + 1}
              </span>
              <span>
                <span className="block font-semibold">{step.title}</span>
                <span className="text-sm text-canopy-muted">{step.desc}</span>
              </span>
            </li>
          ))}
        </ol>

        <div
          className="mb-10 rounded-3xl border border-canopy-danger/50 bg-canopy-danger/15 p-6"
          role="note"
        >
          <h3 className="mb-3 text-2xl font-semibold text-canopy-hp">{page.precautionsTitle}</h3>
          <ul className="space-y-2 text-sm text-canopy-text">
            <li>{page.precautionPregnant}</li>
            <li>{page.precautionMedical}</li>
            <li>{page.precautionExcessive}</li>
          </ul>
        </div>

        <h3 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-canopy-leaf">
          <Sparkles className="h-6 w-6" aria-hidden="true" /> {page.curiositiesTitle}
        </h3>
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {[page.curiosity1, page.curiosity2, page.curiosity3].map(item => (
            <p
              key={item}
              className="rounded-2xl border border-canopy-line bg-canopy-panel p-4 text-sm text-canopy-muted"
            >
              {item}
            </p>
          ))}
        </div>
        <p className="border-t border-canopy-line pt-4 text-center text-sm text-canopy-muted">
          {page.footer}
        </p>
      </div>
    </section>
  )
}

export default MoringaInfo
