import * as THREE from 'three';

export function createIntroSequence(onComplete) {
  // Оверлей
  const overlay = document.createElement('div');
  overlay.id = 'intro-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0;
    background: #000;
    display: flex; align-items: center; justify-content: center;
    z-index: 200; opacity: 1;
    transition: opacity 1.5s;
    pointer-events: none;
    font-family: 'Georgia', 'Times New Roman', serif;
  `;
  document.body.appendChild(overlay);

  const textEl = document.createElement('div');
  textEl.style.cssText = `
    color: #e8e8e8; text-align: center;
    font-size: 42px; letter-spacing: 18px;
    opacity: 0; transition: opacity 1.2s;
    text-shadow: 0 0 20px rgba(255,255,255,0.15);
  `;
  overlay.appendChild(textEl);

  // Звук дождя и грома
  const rainAudio = new Audio('/audio/ambient/rain_light.ogg');
  rainAudio.loop = true;
  rainAudio.volume = 0;

  const thunderAudio = new Audio('/audio/sfx/thunder.ogg');
  thunderAudio.volume = 0.4;

  const steps = [
    {
      text: 'Ф У Р Г О Н',
      duration: 2500,
      font: "42px",
      spacing: '18px'
    },
    {
      text: '',
      duration: 800
    },
    {
      text: '3D-игра про побег',
      duration: 2000,
      font: "20px",
      spacing: '6px',
      color: '#8fa8c8'
    }
  ];

  let current = 0;
  let isCancelled = false;

  function showStep() {
    if (isCancelled) return;
    if (current >= steps.length) {
      // Финальная вспышка белого
      overlay.style.background = '#fff';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        rainAudio.pause();
        onComplete?.();
      }, 1500);
      return;
    }

    const step = steps[current];
    if (step.text) {
      textEl.textContent = step.text;
      textEl.style.fontSize = step.font || '42px';
      textEl.style.letterSpacing = step.spacing || '18px';
      textEl.style.color = step.color || '#e8e8e8';
      textEl.style.opacity = '1';

      // Дождь нарастает
      if (current === 0) {
        rainAudio.play().catch(() => {});
        fadeAudio(rainAudio, 0, 0.5, 2000);
      }

      setTimeout(() => {
        textEl.style.opacity = '0';
        setTimeout(() => {
          current++;
          showStep();
        }, 1200);
      }, step.duration);
    } else {
      setTimeout(() => {
        current++;
        showStep();
      }, step.duration);
    }
  }

  function fadeAudio(audio, from, to, duration) {
    const start = performance.now();
    const step = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      audio.volume = from + (to - from) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    step();
  }

  // Пропустить по тапу (если игрок торопится)
  const skip = () => {
    isCancelled = true;
    overlay.style.background = '#000';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      rainAudio.pause();
      onComplete?.();
    }, 1500);
  };
  overlay.addEventListener('click', skip);
  overlay.addEventListener('touchstart', skip);

  // Запуск
  setTimeout(() => {
    thunderAudio.play().catch(() => {});
    showStep();
  }, 500);

  return { skip };
}
