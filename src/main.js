import { createScene } from './scene.js';
import { createEnvironment } from './environment.js';
import { createPlayer } from './player.js';
import { initTouchControls } from './controls-touch.js';
import { createMobileUI } from './ui-mobile.js';
import { initAudio } from './audio.js';
import { applyMobilePerformance } from './performance.js';
import { createDialogueSystem } from './dialogue.js';
import { startAct0 } from './act0.js';
import { saveGame, loadGame, hasSave } from './save.js';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const canvas = document.getElementById('game');
ScreenOrientation.lock({ orientation: 'landscape' }).catch(() => {});

const { scene, camera, renderer, clock } = createScene(canvas);
applyMobilePerformance(renderer);

// Лес создаём позже (в акте I), а пока — пустая сцена
// createEnvironment(scene); — убираем из старта

const player = createPlayer(scene, camera);
const controls = initTouchControls(player, camera, canvas);
const ui = createMobileUI(player.stats);
const dialogue = createDialogueSystem(ui, player);

const haptics = {
  light: () => Haptics.impact({ style: ImpactStyle.Light }).catch(() => {}),
  medium: () => Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {}),
  success: () => Haptics.notification({ type: 'SUCCESS' }).catch(() => {}),
  error: () => Haptics.notification({ type: 'ERROR' }).catch(() => {})
};

// --- Заставка (splash) ---
const splash = document.getElementById('splash');
const startBtn = document.getElementById('start-btn');
let gameStarted = false;

startBtn.addEventListener('click', () => {
  splash.classList.add('hidden');
  initAudio();
  haptics.light();
  gameStarted = true;

  // Запускаем пролог
  startAct0({ scene, camera, player, ui, dialogue });
});

// --- Кнопки ---
const btnAction = document.getElementById('btn-action');
const btnRun = document.getElementById('btn-run');

btnAction.addEventListener('touchstart', () => {
  if (!gameStarted || player.locked) return;
  const interaction = window.__interaction;
  if (interaction) interaction.interact();
  haptics.light();
});

btnRun.addEventListener('touchstart', () => {
  if (!gameStarted || player.locked) return;
  player.isRunning = true;
  btnRun.style.background = 'rgba(255,255,255,0.35)';
});
btnRun.addEventListener('touchend', () => {
  player.isRunning = false;
  btnRun.style.background = '';
});

// --- Анимация ---
const animate = () => {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (gameStarted) {
    if (!player.locked) {
      player.update(dt);
      controls.update(dt);
    }
    ui.update(player.stats);

    const interaction = window.__interaction;
    if (interaction && window.__interactables) {
      interaction.update(dt, window.__interactables);
    }
  }

  renderer.render(scene, camera);
};

animate();
