import { X, Sparkles } from 'lucide-react';
import { t, Language } from '../i18n';

export interface SkillInfoModalProps {
 skillId: string | null;
 onClose: () => void;
 getSkillName: (id: string | null) => string;
 getSkillLevel: (id: string | null) => number;
 getSkillEffect: (id: string | null) => string;
 getSkillCooldown: (id: string | null) => string | number;
 getSkillDescription: (id: string | null) => string;
 getSkillEvolutions: (id: string | null) => string[];
 formatEvolutionName: (id: string) => string;
 lang: Language;
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
 return (
 <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => onClose()}>
 <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
 <div className="flex justify-between items-start mb-4 sticky top-0 bg-stone-900 z-10 pb-2">
 <h2 className="text-2xl font-black text-emerald-400">
 {getSkillName(skillId)}
 </h2>
 <button onClick={() => onClose()} className="text-stone-400 hover:text-white">
 <X className="w-6 h-6" />
 </button>
 </div>

 <div className="space-y-4 text-stone-300">
 <div className="flex justify-between border-b border-stone-800 pb-2">
 <span className="text-stone-500">{t[lang].level}</span>
 <span className="font-bold">{getSkillLevel(skillId)}</span>
 </div>

 <div className="flex justify-between border-b border-stone-800 pb-2">
 <span className="text-stone-500">{t[lang].effect}</span>
 <span className="font-bold">{getSkillEffect(skillId)}</span>
 </div>

 <div className="flex justify-between border-b border-stone-800 pb-2">
 <span className="text-stone-500">{t[lang].cooldown}</span>
 <span className="font-bold">{getSkillCooldown(skillId)}s</span>
 </div>

 <div>
 <h3 className="text-stone-500 mb-1">{t[lang].description}</h3>
 <p className="text-sm">{getSkillDescription(skillId)}</p>
 </div>

 {getSkillEvolutions(skillId).length > 0 && (
 <div>
 <h3 className="text-stone-500 mb-1">{t[lang].unlockedEvolutions}</h3>
 <ul className="list-disc list-inside text-sm text-emerald-300">
 {getSkillEvolutions(skillId).map((evo: string) => (
 <li key={evo}>{formatEvolutionName(evo)}</li>
 ))}
 </ul>
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
