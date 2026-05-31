// Game constants extracted for centralised management

export const CANVAS_W = 1024;
export const CANVAS_H = 576;

export const GROUND_HEIGHT = 100;
export const PATH_HEIGHT = 40;
export const GROUND_Y = CANVAS_H - GROUND_HEIGHT;

export const PLANT_X = 150;
export const PLANT_Y = CANVAS_H - 120;

export const PORTAL_WIDTH_RATIO = 0.1;

export const MAX_PARTICLES = 200;
export const MAX_PARTICLES_LOW_PERF = 50;

export const SUB_STEP_SIZE = 0.05;
export const MAX_DT = 3600;
export const MAX_ATTACK_SPEED = 10;

export const HEAL_KILL_THRESHOLD = 1000;

export const SAVE_INTERVAL = 10000;
export const UI_SYNC_INTERVAL = 100;

// Backward-compatible aliases
export { CANVAS_W as INTERNAL_W, CANVAS_H as INTERNAL_H };
