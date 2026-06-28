import {
  AlertTriangle,
  Coffee,
  Globe,
  HeartPulse,
  Info,
  Leaf,
  ShieldCheck,
  Sparkles,
  Utensils,
  Zap,
} from 'lucide-react'
import type React from 'react'

const MoringaInfo: React.FC = () => {
  return (
    <section
      id="moringa-info"
      className="bg-stone-50 text-stone-900 py-16 px-4 md:px-8 lg:px-16 font-sans"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-emerald-800 mb-4 tracking-tight">
            Moringa Oleifera – A Árvore da Vida
          </h1>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* 1. Introdução */}
        <div className="mb-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-emerald-700 mb-6 flex items-center gap-3">
              <Info className="w-8 h-8" /> 1. Introdução
            </h2>
            <p className="text-lg leading-relaxed text-stone-700 mb-4">
              A <span className="font-bold italic">Moringa oleifera</span> é uma planta da família
              Moringaceae, amplamente conhecida por diversos nomes populares como{' '}
              <strong>moringa</strong>, <strong>acácia-branca</strong>,{' '}
              <strong>árvore-rabanete-de-cavalo</strong>, <strong>moringueiro</strong> e{' '}
              <strong>quiabo-de-quina</strong>.
            </p>
            <p className="text-lg leading-relaxed text-stone-700">
              Ela é carinhosamente chamada de <strong>"árvore da vida"</strong> devido à sua
              incrível capacidade de sobrevivência em condições adversas e, principalmente, pelo
              fato de quase todas as suas partes serem comestíveis e possuírem propriedades
              medicinais e nutricionais extraordinárias.
            </p>
          </div>
          <div className="bg-emerald-100 rounded-3xl p-8 flex items-center justify-center">
            <Leaf className="w-32 h-32 text-emerald-600 opacity-20 absolute" />
            <div className="relative z-10 text-center">
              <span className="text-5xl block mb-2">🌿</span>
              <p className="font-serif italic text-emerald-800 text-xl">
                "Uma solução natural para a saúde global."
              </p>
            </div>
          </div>
        </div>

        {/* 2. Origem e características */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <Globe className="w-8 h-8" /> 2. Origem e Características
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">
                Origem
              </div>
              <p className="text-stone-700">
                Nativa das planícies do Himalaia, no norte da <strong>Índia</strong>.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">
                Cultivo
              </div>
              <p className="text-stone-700">
                Adaptada a regiões <strong>tropicais e subtropicais</strong> em todo o mundo.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">
                Crescimento
              </div>
              <p className="text-stone-700">
                Extremamente <strong>rápido</strong>, podendo atingir 3 metros no primeiro ano.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <div className="text-emerald-500 mb-3 font-bold uppercase text-xs tracking-widest">
                Aparência
              </div>
              <p className="text-stone-700">
                Possui folhas pequenas e ovais, flores brancas perfumadas e vagens longas.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Valor nutricional */}
        <div className="mb-16 bg-emerald-900 text-white rounded-3xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" /> 3. Valor Nutricional
          </h2>
          <p className="text-xl mb-8 opacity-90">
            A moringa é considerada um <strong>superalimento</strong>. Suas folhas contêm uma
            densidade nutricional raramente encontrada em outras plantas.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <span>
                  <strong>Vitaminas:</strong> Rica em A, C, E e complexo B (especialmente B1, B2 e
                  B3).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <span>
                  <strong>Minerais:</strong> Alta concentração de Cálcio, Ferro, Potássio e
                  Magnésio.
                </span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <span>
                  <strong>Proteínas:</strong> Contém todos os aminoácidos essenciais, sendo uma
                  excelente fonte vegetal.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-emerald-800 p-1 rounded-full mt-1">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <span>
                  <strong>Antioxidantes:</strong> Rica em quercetina e ácido clorogênico.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Benefícios potenciais */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <HeartPulse className="w-8 h-8" /> 4. Benefícios Potenciais para a Saúde
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Sistema Imunológico',
                desc: 'Fortalece as defesas naturais do corpo contra infecções.',
              },
              {
                title: 'Ação Antioxidante',
                desc: 'Combate os radicais livres e retarda o envelhecimento celular.',
              },
              {
                title: 'Anti-inflamatório',
                desc: 'Ajuda a reduzir inflamações crônicas no organismo.',
              },
              {
                title: 'Saúde Cardiovascular',
                desc: 'Auxilia na manutenção de níveis saudáveis de colesterol.',
              },
              {
                title: 'Controle da Glicose',
                desc: 'Pode ajudar a estabilizar os níveis de açúcar no sangue.',
              },
              {
                title: 'Combate à Desnutrição',
                desc: 'Utilizada em programas humanitários devido ao seu alto valor nutritivo.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-stone-100 p-6 rounded-2xl border-l-4 border-emerald-500">
                <h3 className="font-bold text-emerald-800 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4 text-amber-800 text-sm italic">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p>
              Observação: O consumo de moringa é um complemento nutricional e não substitui
              tratamentos médicos convencionais.
            </p>
          </div>
        </div>

        {/* 5. Usos da planta */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <Utensils className="w-8 h-8" /> 5. Usos da Planta
          </h2>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                Uso Alimentar
              </h3>
              <ul className="list-disc list-inside text-stone-700 space-y-2">
                <li>
                  <strong>Folhas:</strong> Consumidas frescas em saladas ou secas em chás.
                </li>
                <li>
                  <strong>Pó:</strong> Adicionado a sucos, sopas e vitaminas.
                </li>
                <li>
                  <strong>Vagens:</strong> Cozidas de forma semelhante ao feijão-verde.
                </li>
              </ul>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                  Uso Medicinal
                </h3>
                <p className="text-stone-700">
                  Utilizada há milênios na medicina Ayurveda para tratar centenas de condições de
                  saúde.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                  Uso Industrial
                </h3>
                <ul className="list-disc list-inside text-stone-700 space-y-2">
                  <li>
                    <strong>Óleo:</strong> Extraído das sementes para culinária e cosméticos.
                  </li>
                  <li>
                    <strong>Purificação:</strong> Sementes moídas ajudam a limpar água turva.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Como consumir */}
        <div className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
              <Coffee className="w-8 h-8" /> 6. Como Consumir
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">Chá de Moringa</h4>
                  <p className="text-stone-600">Infusão das folhas secas em água quente.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">Folhas Frescas</h4>
                  <p className="text-stone-600">
                    Podem ser refogadas ou usadas em saladas e omeletes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">Pó em Vitaminas</h4>
                  <p className="text-stone-600">Uma colher de chá em sucos ou smoothies.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700 flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-stone-800">Cápsulas</h4>
                  <p className="text-stone-600">Forma prática de suplementação concentrada.</p>
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

        {/* 7. Cuidados e contraindicações */}
        <div className="mb-16 bg-red-50 border border-red-100 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" /> 7. Cuidados e Contraindicações
          </h2>
          <ul className="space-y-4 text-red-900">
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>
                <strong>Gestantes:</strong> Devem evitar o consumo sem orientação médica, pois
                algumas partes podem ter efeitos abortivos.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>
                <strong>Condições Médicas:</strong> Pessoas com doenças crônicas ou que usam
                medicamentos regulares devem consultar um profissional.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>
                <strong>Consumo Excessivo:</strong> Pode causar efeitos digestivos como diarreia ou
                desconforto estomacal.
              </span>
            </li>
          </ul>
        </div>

        {/* 8. Curiosidades */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8 flex items-center gap-3">
            <Sparkles className="w-8 h-8" /> 8. Curiosidades
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-emerald-900 font-medium">
                Chamada de <strong>"árvore milagrosa"</strong> em diversas culturas africanas.
              </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">♻️</div>
              <p className="text-emerald-900 font-medium">
                Praticamente <strong>todas as partes</strong> da planta (folhas, raízes, sementes,
                casca) são utilizáveis.
              </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">🏜️</div>
              <p className="text-emerald-900 font-medium">
                Cresce rapidamente mesmo em <strong>solos pobres</strong> e climas áridos.
              </p>
            </div>
          </div>
        </div>

        {/* Footer of Info Page */}
        <div className="text-center pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm">
            © 2026 Moringa Oleifera – Informações Educativas e Científicas.
          </p>
        </div>
      </div>
    </section>
  )
}

export default MoringaInfo
