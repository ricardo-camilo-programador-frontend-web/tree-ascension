import { GameState, createInitialState, calculateMaxHp } from './game';

const SAVE_KEY = 'plant_clicker_save';
const BACKUP_KEY = 'plant_clicker_save_backup';
const INTEGRITY_SALT = 'plant_clicker_secure_salt_v1';
const CURRENT_VERSION = 1;

export interface SaveData {
  version: number;
  timestamp: number;
  player: {
    level: number;
    energy: number;
    hp: number;
    maxHp: number;
  };
  progress: {
    wave: number;
    enemiesKilled: number;
  };
  upgrades: {
    levels: Record<string, number>;
    grassEvolutions: string[];
  };
  skills: Record<string, { level: number; evolutions: string[] }>;
  prestige: {
    resets: number;
    bonus: number;
    upgrades: Record<string, number>;
  };
  stats: {
    totalEnergyGenerated: number;
    totalClicks: number;
    totalPlayTime: number;
  };
  /** IDs of achievements that have been permanently unlocked */
  unlockedAchievements: string[];
}

export interface SignedSave {
  data: SaveData;
  signature: string;
}

// Simple hash function for integrity check (DJB2 variant)
function generateHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash.toString(16);
}

function mapStateToSave(state: GameState): SaveData {
  return {
    version: CURRENT_VERSION,
    timestamp: Date.now(),
    player: {
      level: state.plant.level,
      energy: state.energy,
      hp: state.playerHealth,
      maxHp: state.maxPlayerHealth,
    },
    progress: {
      wave: state.wave,
      enemiesKilled: state.stats.enemiesKilled,
    },
    upgrades: {
      levels: {
        damageLevel: state.upgrades.damageLevel,
        speedLevel: state.upgrades.speedLevel,
        clickLevel: state.upgrades.clickLevel,
        energyLevel: state.upgrades.energyLevel,
        evolutionSpeedLevel: state.upgrades.evolutionSpeedLevel,
        grassLevel: state.upgrades.grassLevel,
      },
      grassEvolutions: state.upgrades.grassEvolutions,
    },
    skills: {
      sunBurst: { level: state.abilities.sunBurst.level, evolutions: state.abilities.sunBurst.evolutions },
      rootEntangle: { level: state.abilities.rootEntangle.level, evolutions: state.abilities.rootEntangle.evolutions },
      poisonCloud: { level: state.abilities.poisonCloud.level, evolutions: state.abilities.poisonCloud.evolutions },
      solGenerator: { level: state.abilities.solGenerator.level, evolutions: state.abilities.solGenerator.evolutions },
    },
    prestige: {
      resets: state.resets,
      bonus: state.prestige.points,
      upgrades: { ...state.prestige.upgrades },
    },
    stats: {
      totalEnergyGenerated: state.stats.totalEnergyGenerated,
      totalClicks: 0, // TODO: track clicks
      totalPlayTime: 0, // TODO: track play time
    },
    unlockedAchievements: state.unlockedAchievements ?? [],
  };
}

function mapSaveToState(save: SaveData): GameState {
  const state = createInitialState();
  
  // Restore player
  state.plant.level = save.player.level;
  state.energy = save.player.energy;
  state.playerHealth = save.player.hp;
  state.maxPlayerHealth = save.player.maxHp;
  
  // Recalculate Max HP based on level to ensure consistency with new formula
  const calculatedMaxHp = calculateMaxHp(state.plant.level);
  if (state.maxPlayerHealth !== calculatedMaxHp) {
    // If max HP changed (e.g. formula update), adjust current HP proportionally
    if (state.playerHealth >= state.maxPlayerHealth) {
      state.playerHealth = calculatedMaxHp;
    } else {
      const ratio = state.playerHealth / state.maxPlayerHealth;
      state.playerHealth = Math.floor(calculatedMaxHp * ratio);
    }
    state.maxPlayerHealth = calculatedMaxHp;
  }

  // Restore progress
  state.wave = save.progress.wave;
  state.stats.enemiesKilled = save.progress.enemiesKilled;
  
  // Restore upgrades
  if (save.upgrades && save.upgrades.levels) {
    state.upgrades.damageLevel = save.upgrades.levels.damageLevel || 1;
    state.upgrades.speedLevel = save.upgrades.levels.speedLevel || 1;
    state.upgrades.clickLevel = save.upgrades.levels.clickLevel || 1;
    state.upgrades.energyLevel = save.upgrades.levels.energyLevel || 1;
    state.upgrades.evolutionSpeedLevel = save.upgrades.levels.evolutionSpeedLevel || 1;
    state.upgrades.grassLevel = save.upgrades.levels.grassLevel || 0;
    state.upgrades.grassEvolutions = save.upgrades.grassEvolutions || [];
  } else if ((save as any).upgrades && typeof (save as any).upgrades.damageLevel === 'number') {
    // Legacy fallback if structure was different (though this is new system)
    // Just in case I messed up the first version
    const oldUpgrades = (save as any).upgrades;
    state.upgrades = { ...state.upgrades, ...oldUpgrades };
  }
  
  // Restore skills
  if (save.skills) {
    if (save.skills.sunBurst) {
      state.abilities.sunBurst.level = save.skills.sunBurst.level;
      state.abilities.sunBurst.evolutions = save.skills.sunBurst.evolutions || [];
    }
    if (save.skills.rootEntangle) {
      state.abilities.rootEntangle.level = save.skills.rootEntangle.level;
      state.abilities.rootEntangle.evolutions = save.skills.rootEntangle.evolutions || [];
    }
    if (save.skills.poisonCloud) {
      state.abilities.poisonCloud.level = save.skills.poisonCloud.level;
      state.abilities.poisonCloud.evolutions = save.skills.poisonCloud.evolutions || [];
    }
    if (save.skills.solGenerator) {
      state.abilities.solGenerator.level = save.skills.solGenerator.level;
      state.abilities.solGenerator.evolutions = save.skills.solGenerator.evolutions || [];
    }
  }
  
  // Restore prestige
  state.resets = save.prestige.resets;
  state.prestige.points = save.prestige.bonus;
  state.prestige.upgrades = { ...state.prestige.upgrades, ...save.prestige.upgrades };
  
  // Restore stats
  state.stats.totalEnergyGenerated = save.stats.totalEnergyGenerated;
  
  // Restore unlocked achievements (fallback to [] for pre-existing saves)
  state.unlockedAchievements = save.unlockedAchievements ?? [];
  
  // Recalculate derived stats
  state.plant.damageMultiplier = Math.pow(1.15, state.upgrades.damageLevel - 1);
  state.plant.attackSpeedMultiplier = Math.pow(1.1, state.upgrades.speedLevel - 1);
  state.energyMultiplier = Math.pow(1.12, state.upgrades.energyLevel - 1);
  
  // Apply prestige bonuses
  state.plant.baseDamage *= (1 + state.prestige.upgrades.soulRoots * 0.1);
  state.energyMultiplier *= (1 + state.prestige.upgrades.ancientSun * 0.15);
  
  return state;
}

function validateSaveData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Basic schema check
  if (typeof data.version !== 'number') return false;
  if (!data.player || typeof data.player.energy !== 'number') return false;
  
  // Logical limits check
  if (data.player.energy < 0 || data.player.energy > 1e308) return false; // 1e308 is max double
  if (data.progress && (data.progress.wave < 0 || data.progress.wave > 1e6)) return false;
  
  return true;
}

export const saveGame = (state: GameState) => {
  try {
    const saveData = mapStateToSave(state);
    const json = JSON.stringify(saveData);
    const signature = generateHash(json + INTEGRITY_SALT);
    
    const signedSave: SignedSave = {
      data: saveData,
      signature
    };
    
    const finalString = JSON.stringify(signedSave);
    
    // Backup previous save
    const currentSave = localStorage.getItem(SAVE_KEY);
    if (currentSave) {
      localStorage.setItem(BACKUP_KEY, currentSave);
    }
    
    localStorage.setItem(SAVE_KEY, finalString);
    console.log('Game saved successfully');
  } catch (e) {
    console.error('Failed to save game', e);
  }
};

export const loadGame = (): GameState | null => {
  try {
    const saveString = localStorage.getItem(SAVE_KEY);
    if (!saveString) {
      // Try legacy save
      const legacySave = localStorage.getItem('idleTD_save');
      if (legacySave) {
        console.log('Migrating legacy save...');
        try {
          const parsed = JSON.parse(legacySave);
          // Legacy save format might be { data: GameState, hash: string } or just GameState
          const stateData = parsed.data || parsed;
          // We can try to validate/map it, or just use it if it looks like a GameState
          // Since mapSaveToState expects SaveData, we might need to manually adapt it
          // or just return it if it matches GameState structure (risky but practical for migration)
          
          // Better approach: Create a SaveData from the legacy state and save it
          const tempState = stateData as GameState;
          // Validate critical fields
          if (typeof tempState.energy === 'number') {
             const saveData = mapStateToSave(tempState);
             saveGame(tempState); // This will save it in new format
             return tempState;
          }
        } catch (e) {
          console.error('Failed to migrate legacy save', e);
        }
      }
      return null;
    }
    
    return parseAndValidateSave(saveString);
  } catch (e) {
    console.error('Failed to load game, attempting backup', e);
    return restoreFromBackup();
  }
};

export const restoreFromBackup = (): GameState | null => {
  try {
    const backupString = localStorage.getItem(BACKUP_KEY);
    if (!backupString) return null;
    
    console.warn('Restoring from backup...');
    return parseAndValidateSave(backupString);
  } catch (e) {
    console.error('Failed to restore backup', e);
    return null;
  }
};

function parseAndValidateSave(jsonString: string): GameState | null {
  try {
    const signedSave: SignedSave = JSON.parse(jsonString);
    
    if (!signedSave.data || !signedSave.signature) {
      throw new Error('Invalid save format');
    }
    
    // Verify signature
    const calculatedSignature = generateHash(JSON.stringify(signedSave.data) + INTEGRITY_SALT);
    if (calculatedSignature !== signedSave.signature) {
      throw new Error('Save signature mismatch (corrupted or tampered)');
    }
    
    // Validate data
    if (!validateSaveData(signedSave.data)) {
      throw new Error('Save data validation failed');
    }
    
    // Migration logic could go here
    if (signedSave.data.version < CURRENT_VERSION) {
      // migrate(signedSave.data);
    }
    
    return mapSaveToState(signedSave.data);
  } catch {
    return null;
  }
}

export const exportSave = (state: GameState): string => {
  const saveData = mapStateToSave(state);
  const json = JSON.stringify(saveData);
  const signature = generateHash(json + INTEGRITY_SALT);
  const signedSave: SignedSave = { data: saveData, signature };
  return btoa(JSON.stringify(signedSave));
};

export const importSave = (base64String: string): GameState => {
  try {
    const jsonString = atob(base64String);
    const state = parseAndValidateSave(jsonString);
    if (!state) throw new Error('Failed to parse save');
    return state;
  } catch (e) {
    console.error('Import failed', e);
    throw new Error('Invalid save string');
  }
};

export const resetSave = () => {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(BACKUP_KEY);
};
