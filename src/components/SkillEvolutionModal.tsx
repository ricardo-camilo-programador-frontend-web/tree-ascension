export interface SkillEvolutionOption {
  id: string;
  name: string;
  description: string;
}

export interface SkillEvolutionModalProps {
  options: SkillEvolutionOption[];
  onSelect: (id: string) => void;
}

export default function SkillEvolutionModal({ options, onSelect }: SkillEvolutionModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Skill Evolution!
        </h2>
        <p className="text-stone-400 text-center text-sm mb-6">
          Choose an upgrade path for your skill.
        </p>
        <div className="flex flex-col gap-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-emerald-500 rounded-xl text-left transition-all group"
            >
              <div className="font-bold text-emerald-400 group-hover:text-emerald-300 mb-1">{opt.name}</div>
              <div className="text-xs text-stone-400 group-hover:text-stone-300">{opt.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
