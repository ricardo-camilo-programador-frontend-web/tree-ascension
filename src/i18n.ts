export type Language = 'en' | 'zh' | 'hi' | 'es' | 'fr' | 'ar' | 'bn' | 'ru' | 'pt' | 'ur' | 'id' | 'de' | 'ja' | 'mr' | 'te' | 'tr' | 'ta' | 'yue' | 'vi' | 'tl';

export const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ru', name: 'Русский' },
  { code: 'pt', name: 'Português' },
  { code: 'ur', name: 'اردو' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'mr', name: 'मराठी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'yue', name: '粵語' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'tl', name: 'Tagalog' },
];

type Translations = {
  [key in Language]: {
    title: string;
    energy: string;
    wave: string;
    plantLevel: string;
    upgrades: string;
    damage: string;
    attackSpeed: string;
    clickDamage: string;
    energyMultiplier: string;
    evolutionSpeed: string;
    grassDamage: string;
    abilities: string;
    autoEvolution: string;
    bossWave: string;
    evolvePlant: string;
    nextStage: string;
    level: string;
    cost: string;
    saveGame: string;
    loadGame: string;
    resetGame: string;
    options: string;
    stats: string;
    totalEnergy: string;
    zombiesKilled: string;
    developedBy: string;
    grassInfo: string;
    ability1: string;
    ability2: string;
    ability3: string;
  };
};

export const t: Translations = {
  en: {
    title: 'Idle Tower Defense', energy: 'Energy', wave: 'Wave', plantLevel: 'Plant Level', upgrades: 'Upgrades',
    damage: 'Plant Damage', attackSpeed: 'Attack Speed', clickDamage: 'Click Damage', energyMultiplier: 'Energy Multiplier',
    evolutionSpeed: 'Evolution Speed', grassDamage: 'Sharp Grass (Auto-Click)', abilities: 'Abilities', autoEvolution: 'Auto Evolution',
    bossWave: 'Boss Wave', evolvePlant: 'Evolve Plant', nextStage: 'Next Stage', level: 'Level', cost: 'Cost',
    saveGame: 'Save', loadGame: 'Load', resetGame: 'Reset', options: 'Options', stats: 'Stats',
    totalEnergy: 'Total Energy', zombiesKilled: 'Zombies Killed', developedBy: 'Developed by', grassInfo: 'Damages walking zombies',
    ability1: 'Sun Burst', ability2: 'Root Entangle', ability3: 'Poison Cloud'
  },
  pt: {
    title: 'Defesa de Torre Idle', energy: 'Energia', wave: 'Onda', plantLevel: 'Nível da Planta', upgrades: 'Melhorias',
    damage: 'Dano da Planta', attackSpeed: 'Velocidade de Ataque', clickDamage: 'Dano de Clique', energyMultiplier: 'Multiplicador de Energia',
    evolutionSpeed: 'Velocidade de Evolução', grassDamage: 'Grama Afiada (Auto-Clique)', abilities: 'Habilidades', autoEvolution: 'Evolução Automática',
    bossWave: 'Onda do Chefe', evolvePlant: 'Evoluir Planta', nextStage: 'Próximo Estágio', level: 'Nível', cost: 'Custo',
    saveGame: 'Salvar', loadGame: 'Carregar', resetGame: 'Resetar', options: 'Opções', stats: 'Estatísticas',
    totalEnergy: 'Energia Total', zombiesKilled: 'Zumbis Mortos', developedBy: 'Desenvolvido por', grassInfo: 'Causa dano em zumbis andando',
    ability1: 'Explosão Solar', ability2: 'Enraizar', ability3: 'Nuvem de Veneno'
  },
  es: {
    title: 'Defensa de Torre Idle', energy: 'Energía', wave: 'Oleada', plantLevel: 'Nivel de Planta', upgrades: 'Mejoras',
    damage: 'Daño de Planta', attackSpeed: 'Velocidad de Ataque', clickDamage: 'Daño de Clic', energyMultiplier: 'Multiplicador de Energía',
    evolutionSpeed: 'Velocidad de Evolución', grassDamage: 'Hierba Afilada (Auto-Clic)', abilities: 'Habilidades', autoEvolution: 'Evolución Automática',
    bossWave: 'Oleada de Jefe', evolvePlant: 'Evolucionar Planta', nextStage: 'Siguiente Etapa', level: 'Nivel', cost: 'Costo',
    saveGame: 'Guardar', loadGame: 'Cargar', resetGame: 'Reiniciar', options: 'Opciones', stats: 'Estadísticas',
    totalEnergy: 'Energía Total', zombiesKilled: 'Zombis Muertos', developedBy: 'Desarrollado por', grassInfo: 'Daña a los zombis que caminan',
    ability1: 'Estallido Solar', ability2: 'Enredo de Raíces', ability3: 'Nube de Veneno'
  },
  zh: {
    title: '放置塔防', energy: '能量', wave: '波数', plantLevel: '植物等级', upgrades: '升级',
    damage: '植物伤害', attackSpeed: '攻击速度', clickDamage: '点击伤害', energyMultiplier: '能量倍数',
    evolutionSpeed: '进化速度', grassDamage: '锋利草丛 (自动点击)', abilities: '技能', autoEvolution: '自动进化',
    bossWave: '首领波', evolvePlant: '进化植物', nextStage: '下一阶段', level: '等级', cost: '花费',
    saveGame: '保存', loadGame: '加载', resetGame: '重置', options: '选项', stats: '统计',
    totalEnergy: '总能量', zombiesKilled: '击杀僵尸', developedBy: '开发者', grassInfo: '对行走的僵尸造成伤害',
    ability1: '太阳爆发', ability2: '根须缠绕', ability3: '毒云'
  },
  hi: {
    title: 'आइडल टावर डिफेंस', energy: 'ऊर्जा', wave: 'लहर', plantLevel: 'पौधे का स्तर', upgrades: 'उन्नयन',
    damage: 'पौधे की क्षति', attackSpeed: 'हमले की गति', clickDamage: 'क्लिक क्षति', energyMultiplier: 'ऊर्जा गुणक',
    evolutionSpeed: 'विकास की गति', grassDamage: 'तेज घास (ऑटो-क्लिक)', abilities: 'क्षमताएं', autoEvolution: 'ऑटो विकास',
    bossWave: 'बॉस लहर', evolvePlant: 'पौधे को विकसित करें', nextStage: 'अगला चरण', level: 'स्तर', cost: 'लागत',
    saveGame: 'सहेजें', loadGame: 'लोड करें', resetGame: 'रीसेट करें', options: 'विकल्प', stats: 'आंकड़े',
    totalEnergy: 'कुल ऊर्जा', zombiesKilled: 'मारे गए ज़ॉम्बी', developedBy: 'द्वारा विकसित', grassInfo: 'चलने वाले ज़ॉम्बी को नुकसान पहुंचाता है',
    ability1: 'सूर्य विस्फोट', ability2: 'जड़ उलझाव', ability3: 'जहर बादल'
  },
  fr: {
    title: 'Idle Tower Defense', energy: 'Énergie', wave: 'Vague', plantLevel: 'Niveau de Plante', upgrades: 'Améliorations',
    damage: 'Dégâts de Plante', attackSpeed: 'Vitesse d\'Attaque', clickDamage: 'Dégâts de Clic', energyMultiplier: 'Multiplicateur d\'Énergie',
    evolutionSpeed: 'Vitesse d\'Évolution', grassDamage: 'Herbe Tranchante (Auto-Clic)', abilities: 'Compétences', autoEvolution: 'Évolution Auto',
    bossWave: 'Vague de Boss', evolvePlant: 'Évoluer Plante', nextStage: 'Prochaine Étape', level: 'Niveau', cost: 'Coût',
    saveGame: 'Sauvegarder', loadGame: 'Charger', resetGame: 'Réinitialiser', options: 'Options', stats: 'Statistiques',
    totalEnergy: 'Énergie Totale', zombiesKilled: 'Zombies Tués', developedBy: 'Développé par', grassInfo: 'Blesse les zombies qui marchent',
    ability1: 'Éclat Solaire', ability2: 'Enchevêtrement', ability3: 'Nuage de Poison'
  },
  ar: {
    title: 'الدفاع عن البرج الخامل', energy: 'طاقة', wave: 'موجة', plantLevel: 'مستوى النبات', upgrades: 'ترقيات',
    damage: 'ضرر النبات', attackSpeed: 'سرعة الهجوم', clickDamage: 'ضرر النقر', energyMultiplier: 'مضاعف الطاقة',
    evolutionSpeed: 'سرعة التطور', grassDamage: 'عشب حاد (نقر تلقائي)', abilities: 'قدرات', autoEvolution: 'تطور تلقائي',
    bossWave: 'موجة الزعيم', evolvePlant: 'تطوير النبات', nextStage: 'المرحلة التالية', level: 'مستوى', cost: 'تكلفة',
    saveGame: 'حفظ', loadGame: 'تحميل', resetGame: 'إعادة ضبط', options: 'خيارات', stats: 'إحصائيات',
    totalEnergy: 'إجمالي الطاقة', zombiesKilled: 'الزومبي المقتولين', developedBy: 'تم التطوير بواسطة', grassInfo: 'يلحق الضرر بالزومبي الماشي',
    ability1: 'انفجار شمسي', ability2: 'تشابك الجذور', ability3: 'سحابة سامة'
  },
  bn: {
    title: 'আইডল টাওয়ার ডিফেন্স', energy: 'শক্তি', wave: 'তরঙ্গ', plantLevel: 'উদ্ভিদের স্তর', upgrades: 'আপগ্রেড',
    damage: 'উদ্ভিদের ক্ষতি', attackSpeed: 'আক্রমণের গতি', clickDamage: 'ক্লিক ক্ষতি', energyMultiplier: 'শক্তি গুণক',
    evolutionSpeed: 'বিবর্তনের গতি', grassDamage: 'তীক্ষ্ণ ঘাস (অটো-ক্লিক)', abilities: 'ক্ষমতা', autoEvolution: 'অটো বিবর্তন',
    bossWave: 'বস তরঙ্গ', evolvePlant: 'উদ্ভিদ বিবর্তিত করুন', nextStage: 'পরবর্তী পর্যায়', level: 'স্তর', cost: 'খরচ',
    saveGame: 'সংরক্ষণ করুন', loadGame: 'লোড করুন', resetGame: 'রিসেট করুন', options: 'বিকল্প', stats: 'পরিসংখ্যান',
    totalEnergy: 'মোট শক্তি', zombiesKilled: 'নিহত জম্বি', developedBy: 'দ্বারা তৈরি', grassInfo: 'হাঁটা জম্বিদের ক্ষতি করে',
    ability1: 'সূর্য বিস্ফোরণ', ability2: 'শিকড় জড়ানো', ability3: 'বিষ মেঘ'
  },
  ru: {
    title: 'Idle Tower Defense', energy: 'Энергия', wave: 'Волна', plantLevel: 'Уровень Растения', upgrades: 'Улучшения',
    damage: 'Урон Растения', attackSpeed: 'Скорость Атаки', clickDamage: 'Урон от Клика', energyMultiplier: 'Множитель Энергии',
    evolutionSpeed: 'Скорость Эволюции', grassDamage: 'Острая Трава (Авто-Клик)', abilities: 'Способности', autoEvolution: 'Авто Эволюция',
    bossWave: 'Волна Босса', evolvePlant: 'Эволюционировать', nextStage: 'Следующая Стадия', level: 'Уровень', cost: 'Стоимость',
    saveGame: 'Сохранить', loadGame: 'Загрузить', resetGame: 'Сброс', options: 'Опции', stats: 'Статистика',
    totalEnergy: 'Всего Энергии', zombiesKilled: 'Убито Зомби', developedBy: 'Разработано', grassInfo: 'Наносит урон идущим зомби',
    ability1: 'Солнечный Взрыв', ability2: 'Опутывание Корнями', ability3: 'Ядовитое Облако'
  },
  ur: {
    title: 'آئیڈل ٹاور ڈیفنس', energy: 'توانائی', wave: 'لہر', plantLevel: 'پودے کی سطح', upgrades: 'اپ گریڈز',
    damage: 'پودے کا نقصان', attackSpeed: 'حملے کی رفتار', clickDamage: 'کلک کا نقصان', energyMultiplier: 'توانائی کا ضرب',
    evolutionSpeed: 'ارتقاء کی رفتار', grassDamage: 'تیز گھاس (آٹو کلک)', abilities: 'صلاحیتیں', autoEvolution: 'آٹو ارتقاء',
    bossWave: 'باس کی لہر', evolvePlant: 'پودا تیار کریں', nextStage: 'اگلا مرحلہ', level: 'سطح', cost: 'قیمت',
    saveGame: 'محفوظ کریں', loadGame: 'لوڈ کریں', resetGame: 'ری سیٹ کریں', options: 'اختیارات', stats: 'اعداد و شمار',
    totalEnergy: 'کل توانائی', zombiesKilled: 'مارے گئے زومبی', developedBy: 'تیار کردہ', grassInfo: 'چلنے والے زومبی کو نقصان پہنچاتا ہے',
    ability1: 'سورج کا دھماکہ', ability2: 'جڑوں کا الجھاؤ', ability3: 'زہریلا بادل'
  },
  id: {
    title: 'Idle Tower Defense', energy: 'Energi', wave: 'Gelombang', plantLevel: 'Level Tanaman', upgrades: 'Peningkatan',
    damage: 'Kerusakan Tanaman', attackSpeed: 'Kecepatan Serangan', clickDamage: 'Kerusakan Klik', energyMultiplier: 'Pengganda Energi',
    evolutionSpeed: 'Kecepatan Evolusi', grassDamage: 'Rumput Tajam (Klik Otomatis)', abilities: 'Kemampuan', autoEvolution: 'Evolusi Otomatis',
    bossWave: 'Gelombang Bos', evolvePlant: 'Evolusi Tanaman', nextStage: 'Tahap Selanjutnya', level: 'Level', cost: 'Biaya',
    saveGame: 'Simpan', loadGame: 'Muat', resetGame: 'Atur Ulang', options: 'Opsi', stats: 'Statistik',
    totalEnergy: 'Total Energi', zombiesKilled: 'Zombi Terbunuh', developedBy: 'Dikembangkan oleh', grassInfo: 'Merusak zombi yang berjalan',
    ability1: 'Ledakan Matahari', ability2: 'Jeratan Akar', ability3: 'Awan Beracun'
  },
  de: {
    title: 'Idle Tower Defense', energy: 'Energie', wave: 'Welle', plantLevel: 'Pflanzenlevel', upgrades: 'Verbesserungen',
    damage: 'Pflanzenschaden', attackSpeed: 'Angriffsgeschwindigkeit', clickDamage: 'Klickschaden', energyMultiplier: 'Energiemultiplikator',
    evolutionSpeed: 'Evolutionsgeschwindigkeit', grassDamage: 'Scharfes Gras (Auto-Klick)', abilities: 'Fähigkeiten', autoEvolution: 'Auto-Evolution',
    bossWave: 'Boss-Welle', evolvePlant: 'Pflanze Entwickeln', nextStage: 'Nächste Stufe', level: 'Level', cost: 'Kosten',
    saveGame: 'Speichern', loadGame: 'Laden', resetGame: 'Zurücksetzen', options: 'Optionen', stats: 'Statistiken',
    totalEnergy: 'Gesamtenergie', zombiesKilled: 'Getötete Zombies', developedBy: 'Entwickelt von', grassInfo: 'Fügt gehenden Zombies Schaden zu',
    ability1: 'Sonnenexplosion', ability2: 'Wurzelverschlingung', ability3: 'Giftwolke'
  },
  ja: {
    title: '放置タワーディフェンス', energy: 'エネルギー', wave: 'ウェーブ', plantLevel: '植物レベル', upgrades: 'アップグレード',
    damage: '植物のダメージ', attackSpeed: '攻撃速度', clickDamage: 'クリックダメージ', energyMultiplier: 'エネルギー倍率',
    evolutionSpeed: '進化速度', grassDamage: '鋭い草 (自動クリック)', abilities: '能力', autoEvolution: '自動進化',
    bossWave: 'ボスウェーブ', evolvePlant: '植物を進化', nextStage: '次のステージ', level: 'レベル', cost: 'コスト',
    saveGame: 'セーブ', loadGame: 'ロード', resetGame: 'リセット', options: 'オプション', stats: '統計',
    totalEnergy: '合計エネルギー', zombiesKilled: '倒したゾンビ', developedBy: '開発者', grassInfo: '歩くゾンビにダメージを与える',
    ability1: 'サンバースト', ability2: 'ルートエンタングル', ability3: 'ポイズンクラウド'
  },
  mr: {
    title: 'आइडल टावर डिफेन्स', energy: 'ऊर्जा', wave: 'लाट', plantLevel: 'वनस्पती पातळी', upgrades: 'सुधारणा',
    damage: 'वनस्पतीचे नुकसान', attackSpeed: 'हल्ल्याचा वेग', clickDamage: 'क्लिक नुकसान', energyMultiplier: 'ऊर्जा गुणक',
    evolutionSpeed: 'उत्क्रांतीचा वेग', grassDamage: 'तीक्ष्ण गवत (ऑटो-क्लिक)', abilities: 'क्षमता', autoEvolution: 'ऑटो उत्क्रांती',
    bossWave: 'बॉस लाट', evolvePlant: 'वनस्पती विकसित करा', nextStage: 'पुढील टप्पा', level: 'पातळी', cost: 'किंमत',
    saveGame: 'जतन करा', loadGame: 'लोड करा', resetGame: 'रीसेट करा', options: 'पर्याय', stats: 'आकडेवारी',
    totalEnergy: 'एकूण ऊर्जा', zombiesKilled: 'मारलेले झोम्बी', developedBy: 'द्वारे विकसित', grassInfo: 'चालणाऱ्या झोम्बींना नुकसान पोहोचवते',
    ability1: 'सूर्य स्फोट', ability2: 'मूळ गुंता', ability3: 'विषारी ढग'
  },
  te: {
    title: 'ఐడిల్ టవర్ డిఫెన్స్', energy: 'శక్తి', wave: 'వేవ్', plantLevel: 'మొక్క స్థాయి', upgrades: 'నవీకరణలు',
    damage: 'మొక్క నష్టం', attackSpeed: 'దాడి వేగం', clickDamage: 'క్లిక్ నష్టం', energyMultiplier: 'శక్తి గుణకం',
    evolutionSpeed: 'పరిణామ వేగం', grassDamage: 'పదునైన గడ్డి (ఆటో-క్లిక్)', abilities: 'సామర్థ్యాలు', autoEvolution: 'ఆటో పరిణామం',
    bossWave: 'బాస్ వేవ్', evolvePlant: 'మొక్కను అభివృద్ధి చేయండి', nextStage: 'తదుపరి దశ', level: 'స్థాయి', cost: 'ఖర్చు',
    saveGame: 'సేవ్ చేయండి', loadGame: 'లోడ్ చేయండి', resetGame: 'రీసెట్ చేయండి', options: 'ఎంపికలు', stats: 'గణాంకాలు',
    totalEnergy: 'మొత్తం శక్తి', zombiesKilled: 'చంపబడిన జాంబీస్', developedBy: 'అభివృద్ధి చేసినవారు', grassInfo: 'నడిచే జాంబీస్‌కు నష్టం కలిగిస్తుంది',
    ability1: 'సూర్య పేలుడు', ability2: 'రూట్ చిక్కు', ability3: 'విష మేఘం'
  },
  tr: {
    title: 'Boşta Kule Savunması', energy: 'Enerji', wave: 'Dalga', plantLevel: 'Bitki Seviyesi', upgrades: 'Yükseltmeler',
    damage: 'Bitki Hasarı', attackSpeed: 'Saldırı Hızı', clickDamage: 'Tıklama Hasarı', energyMultiplier: 'Enerji Çarpanı',
    evolutionSpeed: 'Evrim Hızı', grassDamage: 'Keskin Çimen (Oto-Tıklama)', abilities: 'Yetenekler', autoEvolution: 'Oto Evrim',
    bossWave: 'Patron Dalgası', evolvePlant: 'Bitkiyi Evrimleştir', nextStage: 'Sonraki Aşama', level: 'Seviye', cost: 'Maliyet',
    saveGame: 'Kaydet', loadGame: 'Yükle', resetGame: 'Sıfırla', options: 'Seçenekler', stats: 'İstatistikler',
    totalEnergy: 'Toplam Enerji', zombiesKilled: 'Öldürülen Zombiler', developedBy: 'Geliştiren', grassInfo: 'Yürüyen zombilere hasar verir',
    ability1: 'Güneş Patlaması', ability2: 'Kök Dolaşması', ability3: 'Zehir Bulutu'
  },
  ta: {
    title: 'ஐடல் டவர் டிஃபென்ஸ்', energy: 'ஆற்றல்', wave: 'அலை', plantLevel: 'தாவர நிலை', upgrades: 'மேம்படுத்தல்கள்',
    damage: 'தாவர சேதம்', attackSpeed: 'தாக்குதல் வேகம்', clickDamage: 'கிளிக் சேதம்', energyMultiplier: 'ஆற்றல் பெருக்கி',
    evolutionSpeed: 'பரிணாம வேகம்', grassDamage: 'கூர்மையான புல் (ஆட்டோ-கிளிக்)', abilities: 'திறன்கள்', autoEvolution: 'ஆட்டோ பரிணாமம்',
    bossWave: 'பாஸ் அலை', evolvePlant: 'தாவரத்தை உருவாக்குங்கள்', nextStage: 'அடுத்த கட்டம்', level: 'நிலை', cost: 'செலவு',
    saveGame: 'சேமி', loadGame: 'சுமை', resetGame: 'மீட்டமை', options: 'விருப்பங்கள்', stats: 'புள்ளிவிவரங்கள்',
    totalEnergy: 'மொத்த ஆற்றல்', zombiesKilled: 'கொல்லப்பட்ட ஜோம்பிஸ்', developedBy: 'உருவாக்கியவர்', grassInfo: 'நடக்கும் ஜோம்பிஸுக்கு சேதம் விளைவிக்கும்',
    ability1: 'சூரிய வெடிப்பு', ability2: 'ரூட் சிக்கல்', ability3: 'விஷ மேகம்'
  },
  yue: {
    title: '放置塔防', energy: '能量', wave: '波數', plantLevel: '植物等級', upgrades: '升級',
    damage: '植物傷害', attackSpeed: '攻擊速度', clickDamage: '點擊傷害', energyMultiplier: '能量倍數',
    evolutionSpeed: '進化速度', grassDamage: '鋒利草叢 (自動點擊)', abilities: '技能', autoEvolution: '自動進化',
    bossWave: '首領波', evolvePlant: '進化植物', nextStage: '下一階段', level: '等級', cost: '花費',
    saveGame: '保存', loadGame: '加載', resetGame: '重置', options: '選項', stats: '統計',
    totalEnergy: '總能量', zombiesKilled: '擊殺殭屍', developedBy: '開發者', grassInfo: '對行走的殭屍造成傷害',
    ability1: '太陽爆發', ability2: '根鬚纏繞', ability3: '毒雲'
  },
  vi: {
    title: 'Phòng Thủ Tháp Nhàn Rỗi', energy: 'Năng lượng', wave: 'Làn sóng', plantLevel: 'Cấp độ Cây', upgrades: 'Nâng cấp',
    damage: 'Sát thương Cây', attackSpeed: 'Tốc độ Đánh', clickDamage: 'Sát thương Nhấp chuột', energyMultiplier: 'Hệ số Năng lượng',
    evolutionSpeed: 'Tốc độ Tiến hóa', grassDamage: 'Cỏ Sắc (Tự động Nhấp)', abilities: 'Kỹ năng', autoEvolution: 'Tiến hóa Tự động',
    bossWave: 'Làn sóng Boss', evolvePlant: 'Tiến hóa Cây', nextStage: 'Giai đoạn Tiếp theo', level: 'Cấp độ', cost: 'Chi phí',
    saveGame: 'Lưu', loadGame: 'Tải', resetGame: 'Đặt lại', options: 'Tùy chọn', stats: 'Thống kê',
    totalEnergy: 'Tổng Năng lượng', zombiesKilled: 'Zombie Đã giết', developedBy: 'Phát triển bởi', grassInfo: 'Gây sát thương cho zombie đang đi',
    ability1: 'Bùng nổ Mặt trời', ability2: 'Rễ Trói buộc', ability3: 'Đám mây Độc'
  },
  tl: {
    title: 'Idle Tower Defense', energy: 'Enerhiya', wave: 'Alon', plantLevel: 'Antas ng Halaman', upgrades: 'Mga Upgrade',
    damage: 'Pinsala ng Halaman', attackSpeed: 'Bilis ng Pag-atake', clickDamage: 'Pinsala ng Pag-click', energyMultiplier: 'Multiplier ng Enerhiya',
    evolutionSpeed: 'Bilis ng Ebolusyon', grassDamage: 'Matalim na Damo (Auto-Click)', abilities: 'Mga Kakayahan', autoEvolution: 'Auto Ebolusyon',
    bossWave: 'Alon ng Boss', evolvePlant: 'I-evolve ang Halaman', nextStage: 'Susunod na Yugto', level: 'Antas', cost: 'Halaga',
    saveGame: 'I-save', loadGame: 'I-load', resetGame: 'I-reset', options: 'Mga Opsyon', stats: 'Mga Istatistika',
    totalEnergy: 'Kabuuang Enerhiya', zombiesKilled: 'Mga Zombing Napatay', developedBy: 'Binuo ni', grassInfo: 'Pinipinsala ang mga naglalakad na zombie',
    ability1: 'Pagsabog ng Araw', ability2: 'Paggapos ng Ugat', ability3: 'Nakakalasong Ulap'
  }
};
