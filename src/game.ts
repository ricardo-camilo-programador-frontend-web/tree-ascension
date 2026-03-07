import { playShootSound, playHitSound, playDeathSound, playSunSound, playSunBurstSound, playPortalSound } from './audio';
import { formatNumber } from './utils/number';

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
  slowTimer?: number;
  slowAmount?: number;
  poisonTimer?: number;
  poisonDamage?: number;
  poisonTicks?: number;
  burnTimer?: number;
  burnDamage?: number;
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
  wave: number;
  resets: number;
  prestige: {
    points: number;
    totalPoints: number;
    upgrades: {
      soulRoots: number;
      ancientSun: number;
      evolutionMemory: number;
      eternalGrowth: number;
    };
  };
  stats: {
    totalEnergyGenerated: number;
    enemiesKilled: number;
    wavesCompleted: number;
  };
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
  playerHealth: number;
  maxPlayerHealth: number;
  enemiesKilledForHeal: number;
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
    grassEvolutions: string[];
  };

  abilities: {
    sunBurst: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    rootEntangle: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    poisonCloud: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    solGenerator: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
  };

  modal: {
    isOpen: boolean;
    type: 'skillEvolution' | 'skillInfo' | null;
    skillId: string | null;
    options: { id: string; name: string; description: string }[];
  };
  settings: {
    lowPerformance: boolean;
  };
  lastTimestamp: number;
}

export const calculateMaxHp = (level: number): number => {
  return 10000 + (Math.floor(level / 50) * 10000);
};

export const createInitialState = (): GameState => ({
  energy: 0,
  resets: 0,
  prestige: {
    points: 0,
    totalPoints: 0,
    upgrades: {
      soulRoots: 0,
      ancientSun: 0,
      evolutionMemory: 0,
      eternalGrowth: 0,
    },
  },
  stats: {
    totalEnergyGenerated: 0,
    enemiesKilled: 0,
    wavesCompleted: 0,
  },
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
  playerHealth: 10000,
  maxPlayerHealth: 10000,
  enemiesKilledForHeal: 0,
  clickDamage: 1,
  energyMultiplier: 1,
  wave: 1,
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
    grassEvolutions: [],
  },
  abilities: {
    sunBurst: { level: 0, cooldown: 0, maxCooldown: 30, active: false, evolutions: [] },
    rootEntangle: { level: 0, cooldown: 0, maxCooldown: 45, active: false, evolutions: [] },
    poisonCloud: { level: 0, cooldown: 0, maxCooldown: 60, active: false, evolutions: [] },
    solGenerator: { level: 0, cooldown: 0, maxCooldown: 0, active: false, evolutions: [] },
  },
  modal: {
    isOpen: false,
    type: null,
    skillId: null,
    options: [],
  },
  settings: {
    lowPerformance: false,
  },
  lastTimestamp: Date.now(),
});


export const calculatePrestigePoints = (totalEnergy: number): number => {
  return Math.floor(Math.sqrt(totalEnergy / 1e6));
};

export const resetGame = (state: GameState): boolean => {
  if (state.wave < 50 && state.plant.level < 50) return false;

  const currentResets = state.resets + 1;
  const startingEnergy = currentResets * 1000;
  
  // Calculate prestige points (keep existing logic if needed, or replace)
  const points = calculatePrestigePoints(state.stats.totalEnergyGenerated);
  state.prestige.points += points;
  state.prestige.totalPoints += points;
  
  // Reset game state
  const newState = createInitialState();
  
  // Keep prestige, stats, and resets
  newState.prestige = state.prestige;
  newState.stats = state.stats;
  newState.resets = currentResets;
  newState.energy = startingEnergy;
  
  // Recalculate Max HP based on reset level (which is 1)
  newState.maxPlayerHealth = calculateMaxHp(newState.plant.level);
  newState.playerHealth = newState.maxPlayerHealth;

  // Apply permanent upgrades
  newState.plant.baseDamage *= (1 + state.prestige.upgrades.soulRoots * 0.1);
  newState.energyMultiplier *= (1 + state.prestige.upgrades.ancientSun * 0.15);
  // ... apply other upgrades
  
  Object.assign(state, newState);
  return true;
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

  const baseHp = 10 * Math.pow(1.18, state.wave - 1);
  const baseReward = 2 * Math.pow(1.12, state.wave - 1);
  const baseSpeed = 15 + state.wave * 0.5;

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

  // Remove the old formatNumber function
/*
export const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  if (num >= 1e15) return num.toExponential(2).replace('e+', 'e');
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toLocaleString();
};
*/

export const getCooldownForLevel = (baseCooldown: number, level: number) => {
  if (baseCooldown === 0) return 0;
  // Reduces cooldown by ~1% per level, with diminishing returns, capped at 50% reduction
  const reduction = 1 - (0.5 * (1 - Math.exp(-0.01 * level)));
  return Math.max(1, baseCooldown * reduction);
};

export const calculatePlantDamage = (state: GameState): number => {
  let damage = state.plant.baseDamage * state.plant.damageMultiplier;
  
  // Apply Prestige Bonus (Soul Roots)
  if (state.prestige.upgrades.soulRoots > 0) {
    damage *= (1 + state.prestige.upgrades.soulRoots * 0.1);
  }

  return damage;
};

export const calculateClickDamage = (state: GameState, isCrit: boolean): number => {
  const baseDamage = calculatePlantDamage(state) * 2 * Math.pow(1.15, state.upgrades.clickLevel - 1);
  return isCrit ? baseDamage * 2 : baseDamage;
};

export const calculateSkillDamage = (state: GameState, skillId: string): number => {
  const baseDamage = calculatePlantDamage(state);
  
  switch (skillId) {
    case 'sunBurst':
      let sbDamage = baseDamage * 5 * Math.pow(1.15, state.abilities.sunBurst.level - 1);
      if (state.abilities.sunBurst.evolutions.includes('double_burst')) sbDamage *= 1.5;
      return sbDamage;
      
    case 'poisonCloud':
      return baseDamage * 0.5 * Math.pow(1.15, state.abilities.poisonCloud.level - 1);
      
    case 'grass':
      let grassDamage = 5 * Math.pow(1.15, state.upgrades.grassLevel);
      if (state.upgrades.grassEvolutions.includes('poison_grass')) grassDamage *= 1.5;
      return grassDamage;
      
    case 'rootEntangle':
      // Root entangle damage over time evolution
      if (state.abilities.rootEntangle.evolutions.includes('damage_over_time')) {
        return baseDamage * 0.2;
      }
      return 0;
      
    default:
      return 0;
  }
};

export const applyDamageToZombie = (state: GameState, zombie: Zombie, amount: number, isCrit: boolean = false) => {
  if (amount <= 0 || isNaN(amount)) return;
  
  zombie.hp -= amount;
  if (zombie.hp < 0) zombie.hp = 0;
  
  // Visual feedback
  state.floatingTexts.push({
    id: Math.random().toString(),
    text: formatNumber(amount),
    x: zombie.x, 
    y: zombie.y - zombie.size - 10,
    life: 0, 
    maxLife: 0.8,
    color: isCrit ? '#ef4444' : '#ffffff',
    isCrit
  });
  
  if (isCrit) {
    // Extra particles for crit
    for (let k = 0; k < 5; k++) {
      state.particles.push({
        id: Math.random().toString(),
        x: zombie.x, y: zombie.y,
        vx: (Math.random() - 0.5) * 300,
        vy: (Math.random() - 0.5) * 300,
        life: 0, maxLife: 0.4,
        color: '#ef4444', size: 4,
      });
    }
  }
};

export const applyDamageToPlayer = (state: GameState, amount: number) => {
  if (amount <= 0 || isNaN(amount)) return;

  state.playerHealth -= amount;
  if (state.playerHealth < 0) state.playerHealth = 0;

  // Visual feedback for player damage
  state.floatingTexts.push({
    id: Math.random().toString(),
    text: `-${formatNumber(amount)}`,
    x: 150, // Player position (approx)
    y: INTERNAL_H - 150,
    life: 0,
    maxLife: 1.0,
    color: '#ef4444',
    isCrit: true
  });
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
      
      // Recalculate Max HP on Level Up
      const oldMaxHp = state.maxPlayerHealth;
      const newMaxHp = calculateMaxHp(state.plant.level);
      state.maxPlayerHealth = newMaxHp;

      // Adjust current HP
      if (state.playerHealth >= oldMaxHp) {
        state.playerHealth = newMaxHp;
      } else {
        const ratio = state.playerHealth / oldMaxHp;
        state.playerHealth = Math.floor(newMaxHp * ratio);
      }
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
    
    let damage = calculateSkillDamage(state, 'sunBurst');
    let radius = 1.0;
    
    if (state.abilities.sunBurst.evolutions.includes('larger_radius')) radius = 1.5;

    state.sunBursts.push({ id: Math.random().toString(), x: 150, y: INTERNAL_H - 100, life: 0, maxLife: radius });
    playSunBurstSound();

    state.zombies.forEach(z => {
      // Only hit enemies on screen (plus a bit of buffer)
      if (z.x > INTERNAL_W + 100) return;

      applyDamageToZombie(state, z, damage);
      
      if (state.abilities.sunBurst.evolutions.includes('lingering_damage')) {
        z.burnTimer = 3;
        z.burnDamage = damage * 0.1; // 10% damage per second for 3 seconds
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
    
    let duration = 5;
    let slowAmount = 0.5;
    if (state.abilities.rootEntangle.evolutions.includes('longer_duration')) duration = 8;
    if (state.abilities.rootEntangle.evolutions.includes('stronger_slow')) slowAmount = 0.75;

    state.zombies.forEach(z => {
      if (z.x > INTERNAL_W + 100) return;
      z.slowTimer = duration;
      z.slowAmount = slowAmount;
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
    const damage = calculateSkillDamage(state, 'poisonCloud');
    
    let ticks = 5;
    if (state.abilities.poisonCloud.evolutions.includes('faster_ticks')) ticks = 10;

    let maxRange = INTERNAL_W;
    if (state.abilities.poisonCloud.evolutions.includes('wider_cloud')) maxRange = INTERNAL_W + 400;

    state.zombies.forEach(z => {
      if (z.x > maxRange) return;
      z.poisonTimer = 5;
      z.poisonDamage = damage;
      z.poisonTicks = ticks;
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
    if (state.upgrades.grassEvolutions.includes('faster_ticks')) tickRate = 0.5;

    if (state.timers.lastGrassTick >= tickRate) {
      state.timers.lastGrassTick = 0;
      // Base damage equivalent to auto-click, but scales independently
      let grassDamage = calculateSkillDamage(state, 'grass');
      
      for (let i = state.zombies.length - 1; i >= 0; i--) {
        const z = state.zombies[i];
      applyDamageToZombie(state, z, grassDamage);
        
        if (state.upgrades.grassEvolutions.includes('slow_thorns')) {
           z.slowTimer = Math.max(z.slowTimer || 0, 1);
           z.slowAmount = Math.max(z.slowAmount || 0, 0.2); // Slight slow
        }
        
        // Grass spikes emerging effect
        if (Math.random() > 0.3) {
          state.particles.push({
            id: Math.random().toString(),
            x: z.x + (Math.random() - 0.5) * z.size, 
            y: INTERNAL_H - 100, // Ground level
            vx: 0, vy: -100 - Math.random() * 50,
            life: 0, maxLife: 0.4,
            color: state.upgrades.grassEvolutions.includes('poison_grass') ? '#a855f7' : '#4ade80', size: 4,
          });
        }
      }
    }
  }

  // Sun spawning
  state.timers.lastSunSpawn += dt;
  const sunSpawnInterval = 10 + Math.random() * 10;
  if (state.timers.lastSunSpawn >= sunSpawnInterval) {
    state.timers.lastSunSpawn = 0;
    const x = 200 + Math.random() * (INTERNAL_W - 400);
    const targetY = 100 + Math.random() * (INTERNAL_H - 300);
    let baseReward = 50 * Math.pow(1.3, state.wave);
    
    if (state.abilities.solGenerator.evolutions.includes('extra_value')) {
      baseReward *= 1.5;
    }

    let sunSpeed = 100;
    if (state.abilities.solGenerator.evolutions.includes('faster_fall')) {
      sunSpeed = 200;
    }
    
    const sunCount = 1 + (state.abilities.solGenerator?.level || 0);
    
    for (let i = 0; i < sunCount; i++) {
      state.suns.push({
        id: Math.random().toString(),
        x: x + (Math.random() - 0.5) * 50,
        y: -50 - (Math.random() * 50),
        targetY: targetY + (Math.random() - 0.5) * 50,
        speed: sunSpeed,
        value: baseReward,
        size: 40,
        life: 0,
        maxLife: 10,
      });
    }
  }

  // Update suns
  for (let i = state.suns.length - 1; i >= 0; i--) {
    const s = state.suns[i];
    
    // Magnetic Field evolution
    if (state.abilities.solGenerator.evolutions.includes('auto_collect')) {
      const dx = 150 - s.x;
      const dy = (INTERNAL_H - 100) - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        const moveSpeed = 400 * dt;
        s.x += (dx / dist) * moveSpeed;
        s.y += (dy / dist) * moveSpeed;
        if (dist < 50) {
          // Collect it
          playSunSound();
          const reward = s.value * state.energyMultiplier;
          state.energy += reward;
          state.stats.totalEnergyGenerated += reward;
          state.suns.splice(i, 1);
          continue;
        }
      }
    }

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
      state.stats.totalEnergyGenerated += c.value;
      state.coins.splice(i, 1);
    }
  }

  // Plant shooting
  // Attack Speed softcap: if > 10 attacks/second, apply reduction
  let actualAttackSpeed = state.plant.baseAttackSpeed * state.plant.attackSpeedMultiplier;
  if (actualAttackSpeed > 10) {
    actualAttackSpeed = 10 + Math.sqrt(actualAttackSpeed - 10);
  }
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
        damage: calculatePlantDamage(state),
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
        
        applyDamageToZombie(state, z, damage, isCrit);
        
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

    // Handle DoT (Poison, Burn)
    if (z.poisonTimer !== undefined && z.poisonTimer > 0) {
      const prevTimer = z.poisonTimer;
      z.poisonTimer -= dt;
      const ticks = z.poisonTicks || 5;
      const tickInterval = 5 / ticks;
      
      // Check if we crossed a tick boundary
      if (Math.floor(prevTimer / tickInterval) > Math.floor(z.poisonTimer / tickInterval)) {
        const dmg = z.poisonDamage || 0;
        applyDamageToZombie(state, z, dmg);
      }
    }

    if (z.burnTimer !== undefined && z.burnTimer > 0) {
      z.burnTimer -= dt;
      const dmg = (z.burnDamage || 0) * dt;
      z.hp -= dmg; // DoT doesn't show floating text every frame to avoid clutter
      if (z.hp < 0) z.hp = 0;
      if (Math.random() < 0.1) { // Visual effect
        state.particles.push({
          id: Math.random().toString(), x: z.x, y: z.y,
          vx: (Math.random() - 0.5) * 50, vy: -50 - Math.random() * 50,
          life: 0, maxLife: 0.4, color: '#f97316', size: 3
        });
      }
    }

    // Handle Root Entangle DoT
    if (z.slowTimer !== undefined && z.slowTimer > 0) {
      z.slowTimer -= dt;
      if (state.abilities.rootEntangle.evolutions.includes('damage_over_time')) {
        const dmg = calculateSkillDamage(state, 'rootEntangle') * dt;
        z.hp -= dmg;
        if (z.hp < 0) z.hp = 0;
      }
    }

    if (z.hp <= 0) {
      playDeathSound();
      const reward = z.reward * state.energyMultiplier;
      state.energy += reward;
      state.stats.totalEnergyGenerated += reward;
      state.waveState.killed++;
      state.enemiesKilledForHeal++;
      
      // Poison Cloud: Plague evolution
      if (state.abilities.poisonCloud.evolutions.includes('contagious')) {
        state.zombies.forEach(other => {
          const dx = other.x - z.x;
          const dy = other.y - z.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && other.id !== z.id) {
            other.poisonTimer = 3;
            other.poisonDamage = (z.poisonDamage || 0) * 0.5;
            other.poisonTicks = 3;
          }
        });
      }

      // Heal 1 HP per 1000 kills
      if (state.enemiesKilledForHeal >= 1000) {
        state.enemiesKilledForHeal = 0;
        state.playerHealth = Math.min(state.maxPlayerHealth, state.playerHealth + 1);
      }

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

    let currentSpeed = z.speed;
    if (z.slowTimer !== undefined && z.slowTimer > 0) {
      currentSpeed *= (1 - (z.slowAmount || 0.5));
    }

    z.x -= currentSpeed * dt;

    if (z.x <= 180) {
      // Player takes damage based on wave
      const damage = Math.max(1, Math.floor(state.wave * 0.5));
      applyDamageToPlayer(state, damage);
      
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

      if (state.playerHealth <= 0) {
        state.playerHealth = state.maxPlayerHealth;
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
  const maxParticles = state.settings.lowPerformance ? 50 : 200;
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.life += dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 500 * dt; // Gravity
    if (p.life >= p.maxLife) state.particles.splice(i, 1);
  }
  if (state.particles.length > maxParticles) {
    state.particles.splice(0, state.particles.length - maxParticles);
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
      state.stats.totalEnergyGenerated += reward;
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
      const damage = calculateClickDamage(state, isCrit);
      
      applyDamageToZombie(state, z, damage, isCrit);
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
        state.enemiesKilledForHeal++;
        
        // Heal 1 HP per 1000 kills
        if (state.enemiesKilledForHeal >= 1000) {
          state.enemiesKilledForHeal = 0;
          state.playerHealth = Math.min(state.maxPlayerHealth, state.playerHealth + 1);
        }

        state.zombies.splice(i, 1);
      }
      break;
    }
  }

  if (!hitZombie) {
    const reward = calculateClickDamage(state, false) * 0.1 * state.energyMultiplier;
    state.energy += reward;
    state.stats.totalEnergyGenerated += reward;
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
  // Economy stability: upgradeCost = baseCost * (growthRate ^ level)
  switch (type) {
    case 'damage': return 10 * Math.pow(1.15, level - 1);
    case 'speed': return 25 * Math.pow(1.2, level - 1);
    case 'click': return 10 * Math.pow(1.15, level - 1);
    case 'energy': return 50 * Math.pow(1.25, level - 1);
    case 'evolutionSpeed': return 100 * Math.pow(1.3, level - 1);
    case 'grass': return 50 * Math.pow(1.4, level);
    case 'sunBurst': return 100 * Math.pow(1.5, level);
    case 'rootEntangle': return 200 * Math.pow(1.5, level);
    case 'poisonCloud': return 300 * Math.pow(1.5, level);
    case 'solGenerator': return 1000 * Math.pow(1.6, level);
    default: return 999999999;
  }
};

export const getUpgradeCostTotal = (type: string, level: number, state: GameState, amount: number | 'MAX'): { cost: number, count: number } => {
  let totalCost = 0;
  let currentLevel = level;
  let count = 0;
  let energyLeft = state.energy;

  while (amount === 'MAX' || count < amount) {
    const cost = getUpgradeCost(type, currentLevel, state);
    if (amount === 'MAX') {
      if (energyLeft >= cost) {
        energyLeft -= cost;
        totalCost += cost;
        currentLevel++;
        count++;
        if (currentLevel % 10 === 0) break;
      } else {
        break;
      }
    } else {
      totalCost += cost;
      currentLevel++;
      count++;
      if (currentLevel % 10 === 0 && count < amount) {
        break;
      }
    }
  }

  if (count === 0) {
    return { cost: getUpgradeCost(type, level, state), count: 0 };
  }

  return { cost: totalCost, count };
};

export const buyUpgrade = (state: GameState, type: string, amount: number | 'MAX' = 1) => {
  let bought = 0;
  
  while (amount === 'MAX' || bought < amount) {
    let level = 0;
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(type)) {
      level = state.abilities[type as keyof typeof state.abilities].level;
    } else {
      level = (state.upgrades as any)[type + 'Level'];
    }

    const cost = getUpgradeCost(type, level, state);
    
    if (state.energy >= cost) {
      state.energy -= cost;
      bought++;
      
      if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(type)) {
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
          } else if (type === 'solGenerator') {
             state.modal.options = [
              { id: 'extra_value', name: 'Golden Sun', description: 'Suns are worth 50% more' },
              { id: 'faster_fall', name: 'Comet Suns', description: 'Suns fall twice as fast' },
              { id: 'auto_collect', name: 'Magnetic Field', description: 'Suns are collected automatically' }
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
        case 'damage': state.plant.damageMultiplier = Math.pow(1.15, state.upgrades.damageLevel - 1); break;
        case 'speed': state.plant.attackSpeedMultiplier = Math.pow(1.1, state.upgrades.speedLevel - 1); break;
        case 'energy': state.energyMultiplier = Math.pow(1.12, state.upgrades.energyLevel - 1); break;
      }

      if (state.modal.isOpen) {
        break;
      }
    } else {
      break;
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
  let groundColor = '#171717';
  if (state.upgrades.grassLevel > 0) {
    groundColor = state.upgrades.grassEvolutions.includes('poison_grass') ? '#2e1065' : '#064e3b';
  }
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, INTERNAL_H - 100, INTERNAL_W, 100);
  
  // Ground texture/grid
  const grassColor = state.upgrades.grassEvolutions.includes('poison_grass') ? '168, 85, 247' : '34, 197, 94';
  ctx.strokeStyle = `rgba(${grassColor}, 0.05)`;
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
    if (state.settings.lowPerformance) {
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    } else {
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Draw Floating Texts
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  for (const ft of state.floatingTexts) {
    ctx.globalAlpha = 1 - (ft.life / ft.maxLife);
    
    if (!state.settings.lowPerformance) {
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'black';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  }
  ctx.globalAlpha = 1;

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
  const hpPercent = Math.max(0, state.playerHealth / state.maxPlayerHealth);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 40, y + 20, 80, 8);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x - 40, y + 20, 80 * hpPercent, 8);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 40, y + 20, 80, 8);

  // HP Text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`HP: ${formatNumber(state.playerHealth)} / ${formatNumber(state.maxPlayerHealth)}`, x, y + 45);
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
