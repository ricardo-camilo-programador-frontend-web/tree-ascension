import React from 'react';
import { Info, Globe, Zap, HeartPulse, Utensils, Coffee, AlertTriangle, Sparkles, Leaf, Droplets, FlaskConical, ShieldCheck } from 'lucide-react';
import { t, Language } from '../i18n';

const MoringaInfo: React.FC<{ lang: Language }> = ({ lang }) => {
  const m = t[lang].moringa;

  return (
    <section id="moringa-info" className="bg-stone-50 text-stone-900 py-16 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-emerald-800 mb-4 tracking-tight">
            {m.title}
          </h1>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* 1. Introduction */}
        <div className="mb-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-emerald-700 mb-6 flex items-center gap-3">
              <Info className="w-8 h-8" /> {m.introTitle}
            </h2>
            <p className="text-lg leading-relaxed text-stone-700 mb-4">
              {m.introText1}
            </p>
            <p className="text-lg leading-relaxed text-stone-700">
              {m.introText2}
            </p>
          </div>
          <div className="relative bg-emerald-100 rounded-3xl p-8 flex items-center justify-center">
            <Leaf className="w-32 h-32 text-emerald-600 opacity-20 absolute" />
            <div className="relative z-10 text-center">
              <span className="text-5xl block mb-2">🌿</span>
              <p className="font-serif italic text-emerald-800 text-xl">{m.introQuote}</p>
            </div>
          </div>
        </div>

        {/* 2. Origin and Characteristics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <Globe className="w-8 h-8" /> {m.originTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">{m.originLabel}</div>
              <p className="text-stone-700">{m.originText}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">{m.cultivationLabel}</div>
              <p className="text-stone-700">{m.cultivationText}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">{m.growthLabel}</div>
              <p className="text-stone-700">{m.growthText}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">{m.appearanceLabel}</div>
              <p className="text-stone-700">{m.appearanceText}</p>
            </div>
          </div>
        </div>

        {/* 3. Nutritional Value */}
        <div className="mb-16 bg-emerald-900 text-white rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" /> {m.nutritionTitle}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {m.nutritionText}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1"><Sparkles className="w-4 h-4 text-emerald-300" /></div>
                <span>{m.nutritionVitamins}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1"><Sparkles className="w-4 h-4 text-emerald-300" /></div>
                <span>{m.nutritionMinerals}</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1"><Sparkles className="w-4 h-4 text-emerald-300" /></div>
                <span>{m.nutritionProteins}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1"><Sparkles className="w-4 h-4 text-emerald-300" /></div>
                <span>{m.nutritionAntioxidants}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Potential Health Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <HeartPulse className="w-8 h-8" /> {m.benefitsTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: m.benefit1Title, desc: m.benefit1Desc },
              { title: m.benefit2Title, desc: m.benefit2Desc },
              { title: m.benefit3Title, desc: m.benefit3Desc },
              { title: m.benefit4Title, desc: m.benefit4Desc },
              { title: m.benefit5Title, desc: m.benefit5Desc },
              { title: m.benefit6Title, desc: m.benefit6Desc },
            ].map((item, i) => (
              <div key={i} className="bg-stone-100 p-6 rounded-2xl border-l-4 border-emerald-500">
                <h3 className="font-bold text-emerald-800 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4 text-amber-800 text-sm italic">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p>{m.medicalNote}</p>
          </div>
        </div>

        {/* 5. Uses of the Plant */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <Utensils className="w-8 h-8" /> {m.usesTitle}
          </h2>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">{m.useFoodTitle}</h3>
              <ul className="list-disc list-inside text-stone-700 space-y-2">
                <li>{m.useFoodLeaf}</li>
                <li>{m.useFoodPowder}</li>
                <li>{m.useFoodPods}</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">{m.useMedicinalTitle}</h3>
                <p className="text-stone-700">{m.useMedicinalText}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">{m.useIndustrialTitle}</h3>
                <ul className="list-disc list-inside text-stone-700 space-y-2">
                  <li>{m.useIndustrialOil}</li>
                  <li>{m.useIndustrialPurification}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 6. How to Consume */}
        <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
              <Coffee className="w-8 h-8" /> {m.consumptionTitle}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-stone-800">{m.consumptionTeaTitle}</h4>
                  <p className="text-stone-600">{m.consumptionTeaDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-stone-800">{m.consumptionLeafTitle}</h4>
                  <p className="text-stone-600">{m.consumptionLeafDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-stone-800">{m.consumptionPowderTitle}</h4>
                  <p className="text-stone-600">{m.consumptionPowderDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-stone-800">{m.consumptionCapsulesTitle}</h4>
                  <p className="text-stone-600">{m.consumptionCapsulesDesc}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 bg-stone-200 rounded-3xl h-64 md:h-full flex items-center justify-center overflow-hidden">
             <img
               src="https://picsum.photos/seed/moringa/800/600"
               alt="Moringa Leaves"
               className="w-full h-full object-cover opacity-80"
               referrerPolicy="no-referrer"
             />
          </div>
        </div>

        {/* 7. Precautions and Contraindications */}
        <div className="mb-16 bg-red-50 border border-red-100 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" /> {m.precautionsTitle}
          </h2>
          <ul className="space-y-4 text-red-900">
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>{m.precautionPregnant}</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>{m.precautionMedical}</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>{m.precautionExcessive}</span>
            </li>
          </ul>
        </div>

        {/* 8. Curiosities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <Sparkles className="w-8 h-8" /> {m.curiositiesTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-emerald-900 font-medium">{m.curiosity1}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">♻️</div>
              <p className="text-emerald-900 font-medium">{m.curiosity2}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">🏜️</div>
              <p className="text-emerald-900 font-medium">{m.curiosity3}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm">
            {m.footer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MoringaInfo;
