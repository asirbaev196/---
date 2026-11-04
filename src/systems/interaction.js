import * as THREE from 'three';

export function createInteractionSystem(scene, camera, player, ui, dialogue, items) {
  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0, 0);
  let currentTarget = null;
  let promptCooldown = 0;

  function findTarget(objects) {
    raycaster.setFromCamera(center, camera);
    const intersects = raycaster.intersectObjects(objects, true);

    for (const hit of intersects) {
      let obj = hit.object;
      let depth = 0;
      while (obj && depth < 5) {
        if (obj.userData && obj.userData.type) return obj;
        obj = obj.parent;
        depth++;
      }
    }
    return null;
  }

  const handlers = {
    note: (obj) => {
      ui.showPrompt(
        '«Сынок, позвони, как проснёшься. Я волнуюсь. — Мама»',
        4000
      );
      player.items.note = true;
      obj.visible = false;
    },
    phone: (obj) => {
      ui.showPrompt(
        '3 пропущенных от мамы.\n[E] — позвонить',
        3000
      );
      player.items.phone = true;
      // Открываем диалог с матерью
      dialogue.start('mother_call_intro');
    },
    keys: (obj) => {
      ui.showPrompt('Ты взял ключи от квартиры', 2000);
      player.items.keys = true;
      obj.visible = false;
    },
    knife: (obj) => {
      ui.showPrompt('Ты взял нож. Пригодится.', 2000);
      player.items.knife = true;
      obj.visible = false;
    },
    cat: (obj) => {
      if (!player.items.catPetted) {
        player.items.catPetted = true;
        player.stats.warmth = Math.min(
          player.stats.maxWarmth,
          player.stats.warmth + 5
        );
        ui.showPrompt('Кот мурлычет. Тепло +5', 2000);
      } else {
        ui.showPrompt('Кот довольно урчит.', 1500);
      }
    },
    door: () => {
      if (!player.items.keys) {
        ui.showPrompt('Дверь заперта. Нужны ключи.', 2000);
        return;
      }
      // Триггер похищения
      triggerKidnapping();
    }
  };

  function interact() {
    if (!currentTarget) return false;
    const type = currentTarget.userData.type;
    if (handlers[type]) {
      handlers[type](currentTarget);
      return true;
    }
    return false;
  }

  function update(dt, interactables) {
    promptCooldown -= dt;

    // Ищем цель только если не в диалоге
    if (dialogue.isActive()) {
      currentTarget = null;
      return;
    }

    currentTarget = findTarget(interactables);

    if (currentTarget && promptCooldown <= 0) {
      const title = currentTarget.userData.title || 'Объект';
      ui.showPrompt(`[E] ${title}`, 1500);
      promptCooldown = 1.5;
    }
  }

  function triggerKidnapping() {
    // Отключаем управление
    player.locked = true;

    // Звук удара
    const hitAudio = new Audio('/audio/sfx/hit.ogg');
    hitAudio.play().catch(() => {});

    // Затемнение
    const fade = document.createElement('div');
    fade.style.cssText = `
      position: fixed; inset: 0;
      background: #000; opacity: 0;
      transition: opacity 2s;
      z-index: 150; pointer-events: none;
    `;
    document.body.appendChild(fade);
    requestAnimationFrame(() => { fade.style.opacity = '1'; });

    setTimeout(() => {
      // Переход в фургон
      window.dispatchEvent(new CustomEvent('act0:kidnapped'));
    }, 2200);
  }

  return {
    interact,
    update,
    getCurrentTarget: () => currentTarget
  };
}
