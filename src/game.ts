import { playShootSound, playHitSound, playDeathSound, playSunSound, playSunBurstSound, playPortalSound } from './audio';

export const INTERNAL_W = 1024;
export const INTERNAL_H = 576;

export type ZombieType = 'basic' | 'fast' | 'tank' | 'shield' | 'mutant' | 'boss';

export interface Zombie {
  id: string;
  type: ZombieType;
  level: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  reward: number;
  color: string;
  size: number;
  wobbleOffset: number;
  hitTimer?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  speed: number;
  damage: number;
  size: number;
  color: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  color: string;
  isCrit?: boolean;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  value: number;
}

export interface Sun {
  id: string;
  x: number;
  y: number;
  targetY: number;
  speed: number;
  value: number;
  size: number;
  life: number;
  maxLife: number;
}

export interface SunBurst {
  id: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

export interface GameState {
  energy: number;
  totalEnergyGenerated: number;
  wave: number;
  plant: {
    level: number;
    stage: number;
    baseDamage: number;
    damageMultiplier: number;
    baseAttackSpeed: number;
    attackSpeedMultiplier: number;
    projectileSize: number;
    hp: number;
    maxHp: number;
    evolutionProgress: number;
  };
  clickDamage: number;
  energyMultiplier: number;

  zombies: Zombie[];
  projectiles: Projectile[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  coins: Coin[];
  suns: Sun[];
  sunBursts: SunBurst[];

  timers: {
    lastShot: number;
    lastSpawn: number;
    gameTime: number;
    lastGrassTick: number;
    lastSunSpawn: number;
  };

  waveState: {
    spawned: number;
    killed: number;
    totalToSpawn: number;
    isBoss: boolean;
    spawnRate: number;
  };

  upgrades: {
    damageLevel: number;
    speedLevel: number;
    clickLevel: number;
    energyLevel: number;
    evolutionSpeedLevel: number;
    grassLevel: number;
  };

  abilities: {
    sunBurst: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    rootEntangle: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    poisonCloud: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
  };

  modal: {
    isOpen: boolean;
    type: 'skillEvolution' | null;
    skillId: string | null;
    options: { id: string; name: string; description: string }[];
  };
  lastTimestamp: number;
}

export const createInitialState = (): GameState => ({
  energy: 0,
  totalEnergyGenerated: 0,
  wave: 1,
  plant: {
    level: 1,
    stage: 1,
    baseDamage: 5,
    damageMultiplier: 1,
    baseAttackSpeed: 1,
    attackSpeedMultiplier: 1,
    projectileSize: 10,
    hp: 100,
    maxHp: 100,
    evolutionProgress: 0,
  },
  clickDamage: 1,
  energyMultiplier: 1,
  zombies: [],
  projectiles: [],
  particles: [],
  floatingTexts: [],
  coins: [],
  suns: [],
  sunBursts: [],
  timers: {
    lastShot: 0,
    lastSpawn: 0,
    gameTime: 0,
    lastGrassTick: 0,
    lastSunSpawn: 0,
  },
  waveState: {
    spawned: 0,
    killed: 0,
    totalToSpawn: 10,
    isBoss: false,
    spawnRate: 1,
  },
  upgrades: {
    damageLevel: 1,
    speedLevel: 1,
    clickLevel: 1,
    energyLevel: 1,
    evolutionSpeedLevel: 1,
    grassLevel: 0,
  },
  abilities: {
    sunBurst: { level: 0, cooldown: 0, maxCooldown: 30, active: false, evolutions: [] },
    rootEntangle: { level: 0, cooldown: 0, maxCooldown: 45, active: false, evolutions: [] },
    poisonCloud: { level: 0, cooldown: 0, maxCooldown: 60, active: false, evolutions: [] },
  },
  modal: {
    isOpen: false,
    type: null,
    skillId: null,
    options: [],
  },
  lastTimestamp: Date.now(),
});

const generateHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

const SECRET_SALT = "idle_td_secret_salt_2026";

export const saveGame = (state: GameState) => {
  try {
    const dataStr = JSON.stringify(state);
    const hash = generateHash(dataStr + SECRET_SALT);
    const saveObj = { data: state, hash };
    localStorage.setItem('idleTD_save', JSON.stringify(saveObj));
  } catch (e) {
    console.error('Failed to save game', e);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const saved = localStorage.getItem('idleTD_save');
    if (saved) {
      const parsedObj = JSON.parse(saved);
      
      // Handle old saves (without hash)
      let parsed = parsedObj;
      if (parsedObj.data && parsedObj.hash) {
        const dataStr = JSON.stringify(parsedObj.data);
        const expectedHash = generateHash(dataStr + SECRET_SALT);
        if (expectedHash !== parsedObj.hash) {
          console.warn('Save file corrupted or tampered with!');
          return null;
        }
        parsed = parsedObj.data;
      }

      // Validation
      if (typeof parsed.energy !== 'number' || parsed.energy < 0 || isNaN(parsed.energy)) parsed.energy = 0;
      if (parsed.wave < 1 || isNaN(parsed.wave)) parsed.wave = 1;

      // Ensure new properties exist in old saves
      if (!parsed.upgrades.grassLevel) parsed.upgrades.grassLevel = 0;
      if (!parsed.timers.lastGrassTick) parsed.timers.lastGrassTick = 0;
      if (!parsed.timers.lastSunSpawn) parsed.timers.lastSunSpawn = 0;
      if (!parsed.suns) parsed.suns = [];
      if (!parsed.coins) parsed.coins = [];
      if (!parsed.sunBursts) parsed.sunBursts = [];
      if (!parsed.abilities) {
        parsed.abilities = {
          sunBurst: { level: 0, cooldown: 0, maxCooldown: 30, active: false, evolutions: [] },
          rootEntangle: { level: 0, cooldown: 0, maxCooldown: 45, active: false, evolutions: [] },
          poisonCloud: { level: 0, cooldown: 0, maxCooldown: 60, active: false, evolutions: [] },
        };
      } else {
        if (!parsed.abilities.sunBurst.evolutions) parsed.abilities.sunBurst.evolutions = [];
        if (!parsed.abilities.rootEntangle.evolutions) parsed.abilities.rootEntangle.evolutions = [];
        if (!parsed.abilities.poisonCloud.evolutions) parsed.abilities.poisonCloud.evolutions = [];
      }
      if (!parsed.modal) {
        parsed.modal = { isOpen: false, type: null, skillId: null, options: [] };
      }
      if (!parsed.lastTimestamp) parsed.lastTimestamp = Date.now();
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load game', e);
  }
  return null;
};


const resetWave = (state: GameState) => {
  state.zombies = [];
  state.projectiles = [];
  state.waveState.spawned = 0;
  state.waveState.killed = 0;
  state.waveState.isBoss = state.wave % 5 === 0;
  state.waveState.totalToSpawn = state.waveState.isBoss ? 1 : 10 + Math.floor(state.wave * 1.5);
  state.waveState.spawnRate = state.waveState.isBoss ? 0.5 : 1 + state.wave * 0.1;
};

const spawnZombie = (state: GameState) => {
  state.waveState.spawned++;
  const isBoss = state.waveState.isBoss;

  playPortalSound();

  const baseHp = 10 * Math.pow(1.2, state.wave);
  const baseReward = 2 * Math.pow(1.15, state.wave);
  const baseSpeed = 30 + state.wave * 2;

  let type: ZombieType = 'basic';
  const rand = Math.random();
  if (isBoss) type = 'boss';
  else if (rand < 0.2) type = 'fast';
  else if (rand < 0.4) type = 'tank';
  else if (rand < 0.6) type = 'shield';
  else if (rand < 0.8) type = 'mutant';

  let hp = baseHp;
  let speed = baseSpeed;
  let size = 40;
  let color = '#22c55e';
  let reward = baseReward;

  switch (type) {
    case 'fast': hp *= 0.6; speed *= 1.5; color = '#eab308'; size = 30; break;
    case 'tank': hp *= 3; speed *= 0.6; color = '#64748b'; size = 60; reward *= 2; break;
    case 'shield': hp *= 2; speed *= 0.8; color = '#3b82f6'; break;
    case 'mutant': hp *= 1.5; speed *= 1.2; color = '#a855f7'; reward *= 1.5; break;
    case 'boss': 
      // Boss stats inspired by player progression
      hp *= 30; 
      speed *= 0.3; // Much slower
      color = '#ef4444'; 
      size = 120; 
      reward *= 100; 
      break;
  }

  state.zombies.push({
    id: Math.random().toString(),
    type,
    level: state.wave,
    x: INTERNAL_W + 50,
    y: INTERNAL_H - 100,
    hp, maxHp: hp,
    speed,
    damage: isBoss ? 50 : 10,
    reward,
    color,
    size,
    wobbleOffset: Math.random() * Math.PI * 2,
    hitTimer: 0,
  });
};

export const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  if (num >= 1e15) return num.toExponential(2).replace('e+', 'e');
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toLocaleString();
};

export const getCooldownForLevel = (baseCooldown: number, level: number) => {
  // Reduces cooldown by ~1% per level, with diminishing returns, capped at 50% reduction
  const reduction = 1 - (0.5 * (1 - Math.exp(-0.01 * level)));
  return baseCooldown * reduction;
};

export const updateGame = (state: GameState, _unused_dt: number) => {
  const now = Date.now();
  const realDt = (now - state.lastTimestamp) / 1000;
  state.lastTimestamp = now;

  if (state.modal.isOpen) return;

  const maxDt = 3600; 
  let effectiveDt = Math.min(realDt, maxDt);

  // If dt is very small (e.g. < 1ms), skip to avoid precision issues
  if (effectiveDt < 0.001) return;

  const subStepSize = 0.05; // 50ms chunks for better stability
  while (effectiveDt > 0) {
    const step = Math.min(effectiveDt, subStepSize);
    runUpdateStep(state, step);
    effectiveDt -= step;
  }
};

const runUpdateStep = (state: GameState, dt: number) => {
  state.timers.gameTime += dt;

  // Evolution
  const totalEvolutions = (state.plant.level - 1) * 5 + (state.plant.stage - 1);
  const requiredProgress = 100 * Math.pow(1.2, totalEvolutions);
  const evolutionSpeed = 5 * Math.pow(1.5, state.upgrades.evolutionSpeedLevel - 1);
  
  state.plant.evolutionProgress += dt * evolutionSpeed;

  if (state.plant.evolutionProgress >= requiredProgress) {
    state.plant.evolutionProgress -= requiredProgress;
    state.plant.stage++;
    if (state.plant.stage > 5) {
      state.plant.stage = 1;
      state.plant.level++;
    }
    state.plant.baseDamage *= 2;
    state.plant.maxHp *= 2;
    state.plant.hp = state.plant.maxHp;
    
    // Level up effect
    for (let k = 0; k < 30; k++) {
      state.particles.push({
        id: Math.random().toString(),
        x: 150, y: INTERNAL_H - 100,
        vx: (Math.random() - 0.5) * 400,
        vy: (Math.random() - 0.5) * 400,
        life: 0, maxLife: 1,
        color: '#a3e635', size: 6,
      });
    }
  }

  // Abilities Cooldowns
  if (state.abilities.sunBurst.cooldown > 0) state.abilities.sunBurst.cooldown -= dt;
  if (state.abilities.rootEntangle.cooldown > 0) state.abilities.rootEntangle.cooldown -= dt;
  if (state.abilities.poisonCloud.cooldown > 0) state.abilities.poisonCloud.cooldown -= dt;

  // Auto-activate abilities if off cooldown and level > 0
  if (state.abilities.sunBurst.level > 0 && state.abilities.sunBurst.cooldown <= 0 && state.zombies.length > 0) {
    state.abilities.sunBurst.cooldown = getCooldownForLevel(state.abilities.sunBurst.maxCooldown, state.abilities.sunBurst.level);
    
    let damage = state.plant.baseDamage * state.plant.damageMultiplier * 5 * state.abilities.sunBurst.level;
    let radius = 1.0;
    
    if (state.abilities.sunBurst.evolutions.includes('larger_radius')) radius = 1.5;
    if (state.abilities.sunBurst.evolutions.includes('double_burst')) damage *= 1.5; // Simplified double burst

    state.sunBursts.push({ id: Math.random().toString(), x: 150, y: INTERNAL_H - 100, life: 0, maxLife: radius });
    playSunBurstSound();

    state.zombies.forEach(z => {
      z.hp -= damage;
      if (state.abilities.sunBurst.evolutions.includes('lingering_damage')) {
        // Apply a simple DoT effect by adding a floating text and dealing extra damage
        z.hp -= damage * 0.2;
      }
      for (let k = 0; k < 5; k++) {
        state.particles.push({
          id: Math.random().toString(), x: z.x, y: z.y,
          vx: (Math.random() - 0.5) * 400 * radius, vy: (Math.random() - 0.5) * 400 * radius,
          life: 0, maxLife: 0.8, color: '#fef08a', size: 5,
        });
      }
    });
  }

  if (state.abilities.rootEntangle.level > 0 && state.abilities.rootEntangle.cooldown <= 0 && state.zombies.length > 0) {
    state.abilities.rootEntangle.cooldown = getCooldownForLevel(state.abilities.rootEntangle.maxCooldown, state.abilities.rootEntangle.level);
    state.zombies.forEach(z => {
      z.speed *= 0.5; // Slow down
      setTimeout(() => { if (z) z.speed *= 2; }, 5000); // Reset after 5s (approximate in game loop)
      for (let k = 0; k < 5; k++) {
        state.particles.push({
          id: Math.random().toString(), x: z.x, y: z.y,
          vx: (Math.random() - 0.5) * 100, vy: (Math.random() - 0.5) * 100,
          life: 0, maxLife: 0.5, color: '#84cc16', size: 4,
        });
      }
    });
  }

  if (state.abilities.poisonCloud.level > 0 && state.abilities.poisonCloud.cooldown <= 0 && state.zombies.length > 0) {
    state.abilities.poisonCloud.cooldown = getCooldownForLevel(state.abilities.poisonCloud.maxCooldown, state.abilities.poisonCloud.level);
    const damage = state.plant.baseDamage * state.plant.damageMultiplier * 0.5 * state.abilities.poisonCloud.level;
    // Apply poison over time (simplified as immediate damage for now, or could add a poison status)
    state.zombies.forEach(z => {
      z.hp -= damage * 5; // 5 ticks worth of damage
      for (let k = 0; k < 10; k++) {
        state.particles.push({
          id: Math.random().toString(), x: z.x, y: z.y,
          vx: (Math.random() - 0.5) * 150, vy: (Math.random() - 0.5) * 150,
          life: 0, maxLife: 1, color: '#a855f7', size: 6,
        });
      }
    });
  }

  // Grass Auto-Clicker (Now Global Ground Damage)
  if (state.upgrades.grassLevel > 0) {
    state.timers.lastGrassTick += dt;
    
    let tickRate = 1;
    if (state.abilities.sunBurst.evolutions.includes('faster_ticks')) tickRate = 0.5; // Assuming this evolution is shared or we add specific grass evolutions later

    if (state.timers.lastGrassTick >= tickRate) {
      state.timers.lastGrassTick = 0;
      // Base damage equivalent to auto-click, but scales independently
      let grassDamage = 5 * Math.pow(1.2, state.upgrades.grassLevel); 
      
      if (state.abilities.sunBurst.evolutions.includes('poison_grass')) {
        grassDamage *= 1.5;
      }

      for (let i = state.zombies.length - 1; i >= 0; i--) {
        const z = state.zombies[i];
        z.hp -= grassDamage;
        
        if (state.abilities.sunBurst.evolutions.includes('slow_thorns')) {
           z.x += z.speed * dt * 0.5; // Counteract some movement to simulate slow
        }
        
        // Grass spikes emerging effect
        if (Math.random() > 0.3) {
          state.particles.push({
            id: Math.random().toString(),
            x: z.x + (Math.random() - 0.5) * z.size, 
            y: INTERNAL_H - 100, // Ground level
            vx: 0, vy: -100 - Math.random() * 50,
            life: 0, maxLife: 0.4,
            color: state.abilities.sunBurst.evolutions.includes('poison_grass') ? '#a855f7' : '#4ade80', size: 4,
          });
        }
      }
    }
  }

  // Sun spawning
  state.timers.lastSunSpawn += dt;
  if (state.timers.lastSunSpawn >= 10 + Math.random() * 10) { // Every 10-20 seconds
    state.timers.lastSunSpawn = 0;
    const x = 200 + Math.random() * (INTERNAL_W - 400);
    const targetY = 100 + Math.random() * (INTERNAL_H - 300);
    const baseReward = 50 * Math.pow(1.3, state.wave); // Significant reward
    state.suns.push({
      id: Math.random().toString(),
      x,
      y: -50,
      targetY,
      speed: 100,
      value: baseReward,
      size: 40,
      life: 0,
      maxLife: 10, // Stays for 10 seconds after landing
    });
  }

  // Update suns
  for (let i = state.suns.length - 1; i >= 0; i--) {
    const s = state.suns[i];
    if (s.y < s.targetY) {
      s.y += s.speed * dt;
    } else {
      s.life += dt;
      if (s.life >= s.maxLife) {
        state.suns.splice(i, 1);
      }
    }
  }

  // Update coins
  for (let i = state.coins.length - 1; i >= 0; i--) {
    const c = state.coins[i];
    c.life += dt;
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    c.vy += 800 * dt; // Gravity
    
    if (c.y > INTERNAL_H - 100) {
      c.y = INTERNAL_H - 100;
      c.vy *= -0.5; // Bounce
      c.vx *= 0.8; // Friction
    }
    
    if (c.life >= c.maxLife) {
      state.energy += c.value;
      state.totalEnergyGenerated += c.value;
      state.coins.splice(i, 1);
    }
  }

  // Plant shooting
  const actualAttackSpeed = state.plant.baseAttackSpeed * state.plant.attackSpeedMultiplier;
  const shotInterval = 1 / actualAttackSpeed;
  state.timers.lastShot += dt;

  if (state.timers.lastShot >= shotInterval) {
    state.timers.lastShot = 0;
    // Find target
    const target = state.zombies.reduce((closest, z) => {
      if (!closest) return z;
      return z.x < closest.x ? z : closest;
    }, null as Zombie | null);

    if (target) {
      playShootSound();
      state.projectiles.push({
        id: Math.random().toString(),
        x: 150,
        y: INTERNAL_H - 120,
        speed: 400,
        damage: state.plant.baseDamage * state.plant.damageMultiplier,
        size: state.plant.projectileSize,
        color: '#84cc16',
      });
    }
  }

  // Update projectiles
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const p = state.projectiles[i];
    p.x += p.speed * dt;

    let hit = false;
    for (let j = state.zombies.length - 1; j >= 0; j--) {
      const z = state.zombies[j];
      if (p.x > z.x - z.size / 2 && p.x < z.x + z.size / 2 && p.y > z.y - z.size && p.y < z.y) {
        const isCrit = Math.random() < 0.05; // 5% crit chance
        const damage = isCrit ? p.damage * 2 : p.damage;
        z.hp -= damage;
        z.hitTimer = 0.15; // 150ms flash and squish
        hit = true;
        playHitSound();

        for (let k = 0; k < 5; k++) {
          state.particles.push({
            id: Math.random().toString(),
            x: p.x, y: p.y,
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            life: 0, maxLife: 0.3,
            color: '#84cc16', size: 3,
          });
        }

        state.floatingTexts.push({
          id: Math.random().toString(),
          text: formatNumber(damage),
          x: z.x, y: z.y - z.size - 10,
          life: 0, maxLife: 0.8,
          color: isCrit ? '#ef4444' : '#ffffff',
          isCrit
        });
        break;
      }
    }

    if (hit || p.x > INTERNAL_W + 100) {
      state.projectiles.splice(i, 1);
    }
  }

  // Update zombies and check deaths
  for (let i = state.zombies.length - 1; i >= 0; i--) {
    const z = state.zombies[i];
    
    if (z.hitTimer !== undefined && z.hitTimer > 0) {
      z.hitTimer -= dt;
    }

    if (z.hp <= 0) {
      playDeathSound();
      const reward = z.reward * state.energyMultiplier;
      state.energy += reward;
      state.totalEnergyGenerated += reward;
      state.waveState.killed++;
      state.zombies.splice(i, 1);

      state.floatingTexts.push({
        id: Math.random().toString(),
        text: `+${Math.floor(reward)}`,
        x: z.x, y: z.y - z.size - 20,
        life: 0, maxLife: 1,
        color: '#fbbf24',
      });
      continue;
    }

    z.x -= z.speed * dt;

    if (z.x <= 180) {
      state.plant.hp -= z.damage;
      state.zombies.splice(i, 1);
      state.waveState.killed++;

      for (let k = 0; k < 10; k++) {
        state.particles.push({
          id: Math.random().toString(),
          x: 150, y: INTERNAL_H - 100,
          vx: (Math.random() - 0.5) * 300,
          vy: (Math.random() - 0.5) * 300 - 100,
          life: 0, maxLife: 0.5,
          color: '#ef4444', size: 4,
        });
      }

      if (state.plant.hp <= 0) {
        state.plant.hp = state.plant.maxHp;
        state.wave = Math.max(1, state.wave - 1);
        resetWave(state);
        break;
      }
    }
  }

  // Spawning
  state.timers.lastSpawn += dt;
  if (state.timers.lastSpawn >= 1 / state.waveState.spawnRate && state.waveState.spawned < state.waveState.totalToSpawn) {
    state.timers.lastSpawn = 0;
    spawnZombie(state);
  }

  // Wave progression
  if (state.waveState.killed >= state.waveState.totalToSpawn) {
    state.wave++;
    resetWave(state);
  }

  // Update sunBursts
  for (let i = state.sunBursts.length - 1; i >= 0; i--) {
    const sb = state.sunBursts[i];
    sb.life += dt;
    if (sb.life >= sb.maxLife) state.sunBursts.splice(i, 1);
  }

  // Update particles
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.life += dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.life >= p.maxLife) state.particles.splice(i, 1);
  }

  // Update floating texts
  for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
    const ft = state.floatingTexts[i];
    ft.life += dt;
    ft.y -= 50 * dt;
    if (ft.life >= ft.maxLife) state.floatingTexts.splice(i, 1);
  }
};

export const handleCanvasClick = (state: GameState, x: number, y: number, canvasW: number, canvasH: number) => {
  const scale = Math.min(canvasW / INTERNAL_W, canvasH / INTERNAL_H);
  const offsetX = (canvasW - INTERNAL_W * scale) / 2;
  const offsetY = (canvasH - INTERNAL_H * scale) / 2;

  const internalX = (x - offsetX) / scale;
  const internalY = (y - offsetY) / scale;

  // Check suns
  for (let i = state.suns.length - 1; i >= 0; i--) {
    const s = state.suns[i];
    const dx = internalX - s.x;
    const dy = internalY - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < s.size) {
      playSunSound();
      const reward = s.value * state.energyMultiplier;
      state.energy += reward;
      state.totalEnergyGenerated += reward;
      state.suns.splice(i, 1);
      
      state.floatingTexts.push({
        id: Math.random().toString(),
        text: `+${Math.floor(reward)}`,
        x: s.x, y: s.y,
        life: 0, maxLife: 1.5,
        color: '#fbbf24',
      });

      for (let k = 0; k < 20; k++) {
        state.particles.push({
          id: Math.random().toString(),
          x: s.x, y: s.y,
          vx: (Math.random() - 0.5) * 400,
          vy: (Math.random() - 0.5) * 400,
          life: 0, maxLife: 0.8,
          color: '#fbbf24', size: 6,
        });
      }
      return; // Stop here if we clicked a sun
    }
  }

  let hitZombie = false;
  for (let i = state.zombies.length - 1; i >= 0; i--) {
    const z = state.zombies[i];
    if (internalX > z.x - z.size && internalX < z.x + z.size &&
        internalY > z.y - z.size * 1.5 && internalY < z.y + z.size * 0.5) {

      const isCrit = Math.random() < 0.05;
      const damage = isCrit ? state.clickDamage * 2 : state.clickDamage;
      z.hp -= damage;
      hitZombie = true;

      for (let k = 0; k < 5; k++) {
        state.particles.push({
          id: Math.random().toString(),
          x: internalX, y: internalY,
          vx: (Math.random() - 0.5) * 200,
          vy: (Math.random() - 0.5) * 200,
          life: 0, maxLife: 0.3,
          color: '#fbbf24', size: 4,
        });
      }

      state.floatingTexts.push({
        id: Math.random().toString(),
        text: formatNumber(damage),
        x: internalX, y: internalY - 20,
        life: 0, maxLife: 0.8,
        color: isCrit ? '#ef4444' : '#ffffff',
        isCrit
      });

      if (z.hp <= 0) {
        playDeathSound();
        const reward = z.reward * state.energyMultiplier;
        
        // Spawn coins
        const numCoins = Math.min(10, Math.max(3, Math.floor(reward / 10)));
        const valuePerCoin = reward / numCoins;
        for (let k = 0; k < numCoins; k++) {
          state.coins.push({
            id: Math.random().toString(),
            x: z.x + (Math.random() - 0.5) * 20,
            y: z.y - z.size / 2,
            vx: (Math.random() - 0.5) * 200,
            vy: -200 - Math.random() * 200,
            life: 0,
            maxLife: 0.5 + Math.random() * 0.5,
            value: valuePerCoin
          });
        }

        state.waveState.killed++;
        state.zombies.splice(i, 1);
      }
      break;
    }
  }

  if (!hitZombie) {
    const reward = state.clickDamage * 0.1 * state.energyMultiplier;
    state.energy += reward;
    state.totalEnergyGenerated += reward;
    state.floatingTexts.push({
      id: Math.random().toString(),
      text: `+${formatNumber(reward)}`,
      x: internalX, y: internalY,
      life: 0, maxLife: 0.5,
      color: '#fbbf24',
    });
  }
};

export const getUpgradeCost = (type: string, level: number, state: GameState) => {
  switch (type) {
    case 'damage': return 10 * Math.pow(1.5, level);
    case 'speed': return 25 * Math.pow(1.6, level);
    case 'click': return 10 * Math.pow(1.5, level);
    case 'energy': return 50 * Math.pow(1.8, level);
    case 'evolutionSpeed': return 100 * Math.pow(2, level);
    case 'grass': return 200 * Math.pow(2.5, level);
    case 'sunBurst': return 500 * Math.pow(3, level);
    case 'rootEntangle': return 1000 * Math.pow(3, level);
    case 'poisonCloud': return 2000 * Math.pow(3, level);
    default: return 0;
  }
};

export const buyUpgrade = (state: GameState, type: string) => {
  let level = 0;
  if (['sunBurst', 'rootEntangle', 'poisonCloud'].includes(type)) {
    level = state.abilities[type as keyof typeof state.abilities].level;
  } else {
    level = (state.upgrades as any)[type + 'Level'];
  }

  const cost = getUpgradeCost(type, level, state);
  
  if (state.energy >= cost) {
    state.energy -= cost;
    
    if (['sunBurst', 'rootEntangle', 'poisonCloud'].includes(type)) {
      state.abilities[type as keyof typeof state.abilities].level++;
      const newLevel = state.abilities[type as keyof typeof state.abilities].level;
      
      // Trigger evolution modal every 10 levels
      if (newLevel % 10 === 0) {
        state.modal.isOpen = true;
        state.modal.type = 'skillEvolution';
        state.modal.skillId = type;
        
        if (type === 'sunBurst') {
          state.modal.options = [
            { id: 'larger_radius', name: 'Supernova', description: 'Increases explosion radius by 50%' },
            { id: 'double_burst', name: 'Double Burst', description: 'Deals 50% more damage' },
            { id: 'lingering_damage', name: 'Solar Flare', description: 'Leaves a lingering burn effect' }
          ];
        } else if (type === 'rootEntangle') {
           state.modal.options = [
            { id: 'longer_duration', name: 'Deep Roots', description: 'Increases slow duration' },
            { id: 'stronger_slow', name: 'Thick Vines', description: 'Increases slow effect' },
            { id: 'damage_over_time', name: 'Thorny Roots', description: 'Deals damage while slowed' }
          ];
        } else if (type === 'poisonCloud') {
           state.modal.options = [
            { id: 'wider_cloud', name: 'Toxic Smog', description: 'Affects more enemies' },
            { id: 'faster_ticks', name: 'Corrosive Acid', description: 'Damage ticks twice as fast' },
            { id: 'contagious', name: 'Plague', description: 'Enemies spread poison on death' }
          ];
        }
      }
    } else {
      (state.upgrades as any)[type + 'Level']++;
      
      if (type === 'grass') {
         const newLevel = state.upgrades.grassLevel;
         if (newLevel % 10 === 0) {
            state.modal.isOpen = true;
            state.modal.type = 'skillEvolution';
            state.modal.skillId = type;
            state.modal.options = [
              { id: 'poison_grass', name: 'Toxic Weeds', description: 'Grass deals 50% more damage and turns purple' },
              { id: 'faster_ticks', name: 'Razor Blades', description: 'Grass damages twice as fast' },
              { id: 'slow_thorns', name: 'Entangling Thorns', description: 'Grass slightly slows enemies' }
            ];
         }
      }
    }

    switch (type) {
      case 'damage': state.plant.damageMultiplier += 0.5; break;
      case 'speed': state.plant.attackSpeedMultiplier += 0.1; break;
      case 'click': state.clickDamage += 2 + state.upgrades.clickLevel; break;
      case 'energy': state.energyMultiplier += 0.5; break;
    }
  }
};

export const drawGame = (ctx: CanvasRenderingContext2D, width: number, height: number, state: GameState) => {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  const scale = Math.min(width / INTERNAL_W, height / INTERNAL_H);
  const offsetX = (width - INTERNAL_W * scale) / 2;
  const offsetY = (height - INTERNAL_H * scale) / 2;
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, INTERNAL_H);
  bgGradient.addColorStop(0, '#0c0a09');
  bgGradient.addColorStop(1, '#1c1917');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);

  // Subtle stars/particles in background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 50; i++) {
    const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * INTERNAL_W;
    const y = (Math.cos(i * 678.90) * 0.5 + 0.5) * (INTERNAL_H - 100);
    const size = (Math.sin(state.timers.gameTime + i) * 0.5 + 0.5) * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground
  ctx.fillStyle = '#171717';
  ctx.fillRect(0, INTERNAL_H - 100, INTERNAL_W, 100);
  
  // Ground texture/grid
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < INTERNAL_W; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, INTERNAL_H - 100);
    ctx.lineTo(i, INTERNAL_H);
    ctx.stroke();
  }
  for (let i = INTERNAL_H - 100; i < INTERNAL_H; i += 25) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(INTERNAL_W, i);
    ctx.stroke();
  }

  // Path
  ctx.fillStyle = '#292524';
  ctx.fillRect(0, INTERNAL_H - 120, INTERNAL_W, 40);

  // Draw Plant
  drawPlant(ctx, state);

  // Draw Zombies
  for (const z of state.zombies) {
    drawZombie(ctx, z, state.timers.gameTime);
  }

  // Draw Suns
  for (const s of state.suns) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(state.timers.gameTime);
    
    let scale = 1;
    let alpha = 1;
    if (s.life > 5) {
      const fadeProgress = (s.life - 5) / (s.maxLife - 5); // 0 to 1
      alpha = 1 - fadeProgress;
      scale = 1 - fadeProgress * 0.5;
      
      // Blink effect
      if (Math.sin(s.life * 20) > 0) {
        alpha *= 0.5;
      }
    }
    
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    
    // Outer glow
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, s.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, s.size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Rays
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(s.size * 0.8, 0);
      ctx.lineTo(s.size * 1.2, 0);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  // Draw SunBursts
  for (const sb of state.sunBursts) {
    ctx.save();
    ctx.translate(sb.x, sb.y);
    
    const progress = sb.life / sb.maxLife;
    const radius = 50 + progress * 300;
    const alpha = 1 - progress;
    
    ctx.globalAlpha = alpha;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(254, 240, 138, 1)'); // #fef08a
    gradient.addColorStop(0.5, 'rgba(250, 204, 21, 0.8)'); // #facc15
    gradient.addColorStop(1, 'rgba(234, 179, 8, 0)'); // #eab308
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // Draw Portal
  if (state.waveState.spawned < state.waveState.totalToSpawn) {
    ctx.save();
    // Portal spans full height of play area (approx 10% width)
    const portalWidth = INTERNAL_W * 0.1;
    const portalHeight = INTERNAL_H;
    ctx.translate(INTERNAL_W - portalWidth / 2, INTERNAL_H / 2);
    
    // Portal glow
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 50;
    
    // Portal body
    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, portalHeight / 2);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.3, '#581c87');
    gradient.addColorStop(0.7, '#7e22ce');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, portalWidth, portalHeight / 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Subtle particles inside portal
    ctx.fillStyle = '#d8b4fe';
    for (let i = 0; i < 15; i++) {
      const px = (Math.random() - 0.5) * portalWidth * 1.5;
      const py = (Math.random() - 0.5) * portalHeight * 0.8;
      const size = Math.random() * 3 + 1;
      ctx.globalAlpha = Math.random() * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw Coins
  for (const c of state.coins) {
    ctx.fillStyle = '#eab308'; // Yellow
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ca8a04';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', c.x, c.y);
  }

  // Draw Projectiles
  for (const p of state.projectiles) {
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Draw Particles
  for (const p of state.particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 1 - (p.life / p.maxLife);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Draw Floating Texts
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  for (const ft of state.floatingTexts) {
    ctx.fillStyle = ft.color;
    ctx.globalAlpha = 1 - (ft.life / ft.maxLife);
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
};

function drawPlant(ctx: CanvasRenderingContext2D, state: GameState) {
  const { level, stage, hp, maxHp, evolutionProgress } = state.plant;
  const x = 150;
  const y = INTERNAL_H - 100;
  const time = state.timers.gameTime;
  const breathe = Math.sin(time * 4) * (2 + stage * 0.5);

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 10, 40 + stage * 5, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  const tier = Math.ceil(level / 4);
  // Subtle and gradual size increase based on level, capped at 1.5x
  const levelScale = Math.min(1.5, 1 + (level - 1) * 0.02);
  const sizeMultiplier = levelScale * (1 + (stage - 1) * 0.1);

  ctx.scale(sizeMultiplier, sizeMultiplier);

  if (tier === 1) {
    // Sprout
    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -20 - breathe, 25, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(-20, -30 - breathe, 15, 8, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.arc(-8, -25 - breathe, 4, 0, Math.PI * 2);
    ctx.arc(12, -25 - breathe, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (tier === 2) {
    // Flower
    ctx.fillStyle = '#16a34a';
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 3;
    ctx.fillRect(-10, -40, 20, 40);
    ctx.strokeRect(-10, -40, 20, 40);

    ctx.fillStyle = '#ec4899';
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(0, -40 - breathe);
      ctx.rotate((i * Math.PI * 2) / 6 + time);
      ctx.beginPath();
      ctx.ellipse(20, 0, 15, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, -40 - breathe, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (tier === 3) {
    // Bark/Tree
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-15, -60 - breathe);
    ctx.lineTo(15, -60 - breathe);
    ctx.lineTo(20, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(0, -70 - breathe, 30, 0, Math.PI * 2);
    ctx.arc(-20, -60 - breathe, 25, 0, Math.PI * 2);
    ctx.arc(20, -60 - breathe, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a3e635';
    ctx.shadowColor = '#a3e635';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-8, -40 - breathe, 4, 0, Math.PI * 2);
    ctx.arc(12, -40 - breathe, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (tier === 4) {
    // Magic
    ctx.fillStyle = '#4c1d95';
    ctx.strokeStyle = '#2e1065';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -40 - breathe, 25, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -80 - breathe);
    ctx.lineTo(0, 0);
    ctx.moveTo(-15, -40 - breathe);
    ctx.lineTo(15, -40 - breathe);
    ctx.stroke();
    ctx.shadowBlur = 0;
  } else {
    // Mythical
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, -50 - breathe, 35, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, -110 - breathe + Math.sin(time * 2) * 10, 40, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.restore();

  // Evolution Progress Bar
  const totalEvolutions = (level - 1) * 5 + (stage - 1);
  const requiredProgress = 100 * Math.pow(1.2, totalEvolutions);
  const evoPercent = Math.max(0, Math.min(1, evolutionProgress / requiredProgress));
  
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(x - 40, y + 32, 80, 6);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(x - 40, y + 32, 80 * evoPercent, 6);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 40, y + 32, 80, 6);

  // HP Bar
  const hpPercent = Math.max(0, hp / maxHp);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 40, y + 20, 80, 8);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x - 40, y + 20, 80 * hpPercent, 8);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 40, y + 20, 80, 8);
}

function drawZombie(ctx: CanvasRenderingContext2D, z: Zombie, time: number) {
  ctx.save();
  ctx.translate(z.x, z.y);

  const wobble = Math.sin(time * 10 + z.wobbleOffset) * 5;
  
  const isHit = z.hitTimer !== undefined && z.hitTimer > 0;
  if (isHit) {
    ctx.scale(1.1, 0.9); // Squish effect
  }

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 10, z.size * 0.8, z.size * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isHit ? '#ffffff' : z.color;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(-z.size / 2, -z.size + wobble, z.size, z.size);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-z.size / 4, -z.size * 0.7 + wobble, z.size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  if (z.type === 'shield') {
    ctx.fillStyle = isHit ? '#e9d5ff' : '#8b5cf6';
    ctx.fillRect(-z.size * 0.8, -z.size * 1.2 + wobble, z.size * 0.4, z.size * 1.4);
    ctx.strokeRect(-z.size * 0.8, -z.size * 1.2 + wobble, z.size * 0.4, z.size * 1.4);
  } else if (z.type === 'tank') {
    ctx.fillStyle = isHit ? '#cbd5e1' : '#64748b';
    ctx.fillRect(-z.size / 2, -z.size + wobble, z.size, z.size * 0.3);
  } else if (z.type === 'boss') {
    // Boss unique visual traits: Glowing eyes and corrupted energy
    ctx.save();
    ctx.translate(0, wobble);
    
    // Corrupted energy aura
    ctx.globalAlpha = 0.3 + Math.sin(time * 5) * 0.2;
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(0, -z.size / 2, z.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Glowing eyes
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(-z.size / 4, -z.size * 0.7 + wobble, z.size * 0.15, 0, Math.PI * 2);
    ctx.arc(z.size / 4, -z.size * 0.7 + wobble, z.size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  const tier = Math.ceil((z.level || 1) / 4);
  if (tier === 2) {
    ctx.fillStyle = isHit ? '#e2e8f0' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(0, -z.size + wobble, z.size / 2, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
  } else if (tier === 3) {
    ctx.fillStyle = isHit ? '#f5d0fe' : '#d946ef';
    ctx.beginPath();
    ctx.arc(0, -z.size + wobble, z.size / 3, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
  } else if (tier === 4) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-z.size / 4, -z.size + wobble);
    ctx.lineTo(-z.size / 4 - 10, -z.size - 15 + wobble);
    ctx.lineTo(0, -z.size + wobble);
    ctx.fill();
    ctx.stroke();
  } else if (tier === 5) {
    ctx.strokeStyle = isHit ? '#fca5a5' : '#dc2626';
    ctx.lineWidth = 3;
    ctx.shadowColor = isHit ? '#fca5a5' : '#dc2626';
    ctx.shadowBlur = 10;
    ctx.strokeRect(-z.size / 2 - 5, -z.size + wobble - 5, z.size + 10, z.size + 10);
    ctx.shadowBlur = 0;
  }

  const hpPercent = Math.max(0, z.hp / z.maxHp);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-z.size / 2, -z.size - 15 + wobble, z.size, 4);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(-z.size / 2, -z.size - 15 + wobble, z.size * hpPercent, 4);

  ctx.restore();
}
