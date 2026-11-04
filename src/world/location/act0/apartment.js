import * as THREE from 'three';

export function createApartment(scene, player, ui, interactables) {
  const group = new THREE.Group();
  group.name = 'apartment';
  scene.add(group);

  // --- Пол ---
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 6),
    new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // --- Стены ---
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x8a7a6a, roughness: 1 });
  const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMat);
  wallBack.position.set(0, 1.5, -3);
  wallBack.receiveShadow = true;
  group.add(wallBack);

  const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMat);
  wallLeft.rotation.y = Math.PI / 2;
  wallLeft.position.set(-4, 1.5, 0);
  wallLeft.receiveShadow = true;
  group.add(wallLeft);

  const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), wallMat);
  wallRight.rotation.y = -Math.PI / 2;
  wallRight.position.set(4, 1.5, 0);
  wallRight.receiveShadow = true;
  group.add(wallRight);

  // --- Окно (свет) ---
  const windowMat = new THREE.MeshBasicMaterial({ color: 0xffe8b0 });
  const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.5), windowMat);
  windowMesh.position.set(-2, 1.8, -2.95);
  group.add(windowMesh);

  const windowLight = new THREE.PointLight(0xffe8b0, 1.2, 8, 2);
  windowLight.position.set(-2, 1.8, -2.5);
  windowLight.castShadow = true;
  group.add(windowLight);

  // --- Диван (место старта) ---
  const sofaMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 1 });
  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 1), sofaMat);
  sofaBase.position.set(0, 0.25, 1.5);
  sofaBase.castShadow = true;
  group.add(sofaBase);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 0.2), sofaMat);
  sofaBack.position.set(0, 0.8, 2.0);
  sofaBack.castShadow = true;
  group.add(sofaBack);

  // --- Стол ---
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.8 });
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.8), tableMat);
  tableTop.position.set(2, 0.75, 0.5);
  tableTop.castShadow = true;
  group.add(tableTop);

  // Ножки стола
  for (const [x, z] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.75, 6),
      tableMat
    );
    leg.position.set(2 + x, 0.375, 0.5 + z);
    leg.castShadow = true;
    group.add(leg);
  }

  // --- Записка от матери на столе ---
  const noteMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.25, 0.35),
    new THREE.MeshStandardMaterial({ color: 0xf0e8d0, side: THREE.DoubleSide })
  );
  noteMesh.rotation.x = -Math.PI / 2;
  noteMesh.position.set(2, 0.81, 0.5);
  noteMesh.userData.type = 'note';
  noteMesh.userData.title = 'Записка от матери';
  group.add(noteMesh);
  interactables.push(noteMesh);

  // --- Телефон ---
  const phoneMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.01, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4 })
  );
  phoneMesh.position.set(2.3, 0.81, 0.3);
  phoneMesh.userData.type = 'phone';
  phoneMesh.userData.title = 'Телефон';
  group.add(phoneMesh);
  interactables.push(phoneMesh);

  // --- Ключи ---
  const keysMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.02, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xc0a060, metalness: 0.8, roughness: 0.3 })
  );
  keysMesh.position.set(1.7, 0.81, 0.6);
  keysMesh.userData.type = 'keys';
  keysMesh.userData.title = 'Ключи от квартиры';
  group.add(keysMesh);
  interactables.push(keysMesh);

  // --- Кот на подоконнике ---
  const cat = createCat();
  cat.position.set(-2, 1.05, -2.7);
  cat.userData.type = 'cat';
  cat.userData.title = 'Кот';
  group.add(cat);
  interactables.push(cat);

  // --- Кухня (стол, нож) ---
  const kitchenCounter = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.9, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x6a5a4a, roughness: 0.9 })
  );
  kitchenCounter.position.set(3, 0.45, -2.5);
  kitchenCounter.castShadow = true;
  group.add(kitchenCounter);

  const knife = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.01, 0.2),
    new THREE.MeshStandardMaterial({ color: 0xc8c8c8, metalness: 0.9, roughness: 0.2 })
  );
  knife.position.set(3, 0.91, -2.5);
  knife.rotation.y = Math.PI / 4;
  knife.userData.type = 'knife';
  knife.userData.title = 'Нож';
  group.add(knife);
  interactables.push(knife);

  // --- Дверь ---
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 2, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 })
  );
  door.position.set(4, 1, 1.5);
  door.rotation.y = -Math.PI / 2;
  door.userData.type = 'door';
  door.userData.title = 'Дверь';
  group.add(door);
  interactables.push(door);

  // --- Освещение комнаты ---
  const roomLight = new THREE.PointLight(0xffe0b0, 0.6, 10, 2);
  roomLight.position.set(0, 2.8, 0);
  group.add(roomLight);

  // --- Туман внутри (пылинки в лучах) ---
  // (опционально частицы)

  return group;
}

function createCat() {
  const catGroup = new THREE.Group();

  // Тело
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 1 })
  );
  body.scale.set(1.4, 1, 1);
  body.castShadow = true;
  catGroup.add(body);

  // Голова
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 1 })
  );
  head.position.set(0.15, 0.08, 0);
  head.castShadow = true;
  catGroup.add(head);

  // Уши
  for (const z of [-0.05, 0.05]) {
    const ear = new THREE.Mesh(
      new THREE.ConeGeometry(0.03, 0.06, 4),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
    );
    ear.position.set(0.18, 0.16, z);
    catGroup.add(ear);
  }

  // Хвост
  const tail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.01, 0.25, 6),
    new THREE.MeshStandardMaterial({ color: 0x3a3a3a })
  );
  tail.position.set(-0.2, 0.05, 0);
  tail.rotation.z = Math.PI / 3;
  catGroup.add(tail);

  return catGroup;
}
