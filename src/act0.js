import * as THREE from 'three';
import { createIntroSequence } from './intro/introSequence.js';
import { createApartment } from './world/locations/act0/apartment.js';
import { createInteractionSystem } from './systems/interaction.js';

export function startAct0({ scene, camera, player, ui, dialogue }) {
  // 1. Чёрный экран с титрами
  createIntroSequence(() => {
    // 2. После титров — квартира
    enterApartment({ scene, camera, player, ui, dialogue });
  });
}

function enterApartment({ scene, camera, player, ui, dialogue }) {
  // Отключаем управление на момент «просыпания»
  player.locked = true;

  // Позиция на диване
  player.group.position.set(0, 0.5, 1.5);
  player.group.rotation.y = Math.PI;

  // Создаём квартиру
  const interactables = [];
  const apartment = createApartment(scene, player, ui, interactables);

  // Камера: сначала «от первого лица» (лежим)
  camera.position.set(0, 1.2, 2.5);
  camera.lookAt(0, 1.2, 0);

  // 3. Сцена «просыпания» (3 секунды)
  const wakeLines = [
    { t: 0,   text: '' },
    { t: 800, text: '...' },
    { t: 1600, text: 'Ты просыпаешься. Утро.' }
  ];

  wakeLines.forEach((line) => {
    setTimeout(() => {
      if (line.text) ui.showPrompt(line.text, 1200);
    }, line.t);
  });

  // Через 3 секунды — управление вкл
  setTimeout(() => {
    player.locked = false;

    // Камера переходит в third-person
    camera.position.set(0, 1.8, 4);

    // Первая подсказка
    ui.showPrompt(
      'Осмотри квартиру. Тапни по объекту — взаимодействие.',
      5000
    );

    // Инициализация взаимодействий
    const interaction = createInteractionSystem(
      scene, camera, player, ui, dialogue, interactables
    );

    // Сохраняем в глобальное состояние
    window.__interaction = interaction;
    window.__interactables = interactables;

    // Слушаем похищение
    window.addEventListener('act0:kidnapped', () => {
      // Очищаем квартиру
      scene.remove(apartment);

      // Титр «Фургон»
      showVanTitle();

      // Через 3 секунды — переход к акту I
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('act1:start'));
      }, 3000);
    });
  }, 3000);
}

function showVanTitle() {
  const title = document.createElement('div');
  title.style.cssText = `
    position: fixed; inset: 0;
    background: #000;
    display: flex; align-items: center; justify-content: center;
    z-index: 180;
    color: #8a1a1a;
    font-family: 'Georgia', serif;
    font-size: 32px;
    letter-spacing: 14px;
    opacity: 0;
    transition: opacity 2s;
  `;
  title.textContent = 'ФУРГОН';
  document.body.appendChild(title);

  requestAnimationFrame(() => { title.style.opacity = '1'; });

  setTimeout(() => {
    title.style.opacity = '0';
    setTimeout(() => title.remove(), 2000);
  }, 2500);
}
