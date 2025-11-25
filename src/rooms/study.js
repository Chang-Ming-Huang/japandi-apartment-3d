// 工作室模組 - 小型書房，書桌、電腦、層架
import * as THREE from 'three';
import { getMaterials } from '../materials.js';
import { APARTMENT } from '../config.js';

let M = null;

// 書桌 (較窄，適合小空間)
function createDesk() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 桌面
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.03, 0.5),
    M.lightWood
  );
  top.position.y = 0.75;
  top.castShadow = true;
  g.add(top);
  
  // 桌腳 - 簡約金屬腳
  const legGeo = new THREE.BoxGeometry(0.04, 0.72, 0.04);
  const positions = [
    [-0.45, 0.36, -0.2],
    [-0.45, 0.36, 0.2],
    [0.45, 0.36, -0.2],
    [0.45, 0.36, 0.2]
  ];
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, M.blackMetal);
    leg.position.set(...pos);
    g.add(leg);
  });
  
  return g;
}

// 窗戶
function createStudyWindow() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 窗框
  const frameThick = 0.05;
  const windowW = 0.8;
  const windowH = 1.0;
  
  // 玻璃
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(windowW, windowH),
    M.frostedGlass
  );
  g.add(glass);
  
  // 窗框 - 上下左右
  const frameMat = M.lightWood;
  const topFrame = new THREE.Mesh(new THREE.BoxGeometry(windowW + frameThick*2, frameThick, frameThick), frameMat);
  topFrame.position.y = windowH/2;
  g.add(topFrame);
  
  const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(windowW + frameThick*2, frameThick, frameThick), frameMat);
  bottomFrame.position.y = -windowH/2;
  g.add(bottomFrame);
  
  const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, windowH, frameThick), frameMat);
  leftFrame.position.x = -windowW/2;
  g.add(leftFrame);
  
  const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, windowH, frameThick), frameMat);
  rightFrame.position.x = windowW/2;
  g.add(rightFrame);
  
  return g;
}

// 小型層架
function createShelf() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 層架背板
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1.2, 0.02),
    M.lightWood
  );
  back.position.set(0, 0.6, -0.13);
  g.add(back);
  
  // 層板 x 4
  for (let i = 0; i < 4; i++) {
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.02, 0.25),
      M.lightWood
    );
    shelf.position.set(0, 0.15 + i * 0.3, 0);
    shelf.castShadow = true;
    g.add(shelf);
  }
  
  // 側板
  const sideGeo = new THREE.BoxGeometry(0.02, 1.2, 0.25);
  const leftSide = new THREE.Mesh(sideGeo, M.lightWood);
  leftSide.position.set(-0.29, 0.6, 0);
  g.add(leftSide);
  
  const rightSide = new THREE.Mesh(sideGeo, M.lightWood);
  rightSide.position.set(0.29, 0.6, 0);
  g.add(rightSide);
  
  // 放一些書和裝飾品
  const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.22, 0.03), M.fabric);
  book1.position.set(-0.15, 0.26, 0.05);
  book1.rotation.z = 0.1;
  g.add(book1);
  
  const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.03), M.cushion);
  book2.position.set(-0.02, 0.24, 0.05);
  g.add(book2);
  
  const plant = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), M.plant);
  plant.position.set(0.15, 0.21, 0.05);
  g.add(plant);
  
  return g;
}

// 電腦螢幕
function createMonitor() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 螢幕
  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.35, 0.02),
    M.blackMetal
  );
  screen.position.y = 0.95;
  g.add(screen);
  
  // 螢幕面板 (亮面)
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a2e, emissive: 0x111122, emissiveIntensity: 0.3 })
  );
  panel.position.set(0, 0.95, 0.015);
  g.add(panel);
  
  // 支架
  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.15, 0.08),
    M.blackMetal
  );
  stand.position.y = 0.82;
  g.add(stand);
  
  // 底座
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.02, 0.15),
    M.blackMetal
  );
  base.position.y = 0.76;
  g.add(base);
  
  return g;
}

// 辦公椅
function createOfficeChair() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 座墊
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.08, 0.45),
    M.fabric
  );
  seat.position.y = 0.45;
  g.add(seat);
  
  // 椅背
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.5, 0.05),
    M.fabric
  );
  back.position.set(0, 0.75, -0.2);
  back.rotation.x = 0.1;
  g.add(back);
  
  // 椅腳 (五爪)
  const legBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
    M.blackMetal
  );
  legBase.position.y = 0.22;
  g.add(legBase);
  
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.02, 0.03),
      M.blackMetal
    );
    leg.position.set(Math.sin(angle) * 0.12, 0.02, Math.cos(angle) * 0.12);
    leg.rotation.y = angle;
    g.add(leg);
  }
  
  return g;
}

// 組裝工作室
// 房間深度 4.0m（從 Z=-2.0 門口到 Z=2.0 後牆）
// 配置：
//   - 書桌面向窗戶（後牆）
//   - 窗戶在後牆，提供自然採光
//   - 層架靠左牆靠近門口
export function createStudyRoom(offsetX = 0, offsetZ = 0) {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  const H = APARTMENT.height;
  
  // 窗戶 - 後牆，提供自然採光
  const window = createStudyWindow();
  window.position.set(0, H/2, 1.85);
  g.add(window);
  
  // 書桌 - 面向窗戶，在房間後半部
  const desk = createDesk();
  desk.position.set(0, 0, 0.8);
  desk.rotation.y = Math.PI;  // 面向窗戶
  g.add(desk);
  
  // 電腦螢幕 - 在書桌上，面向使用者
  const monitor = createMonitor();
  monitor.position.set(0, 0, 1.0);
  monitor.rotation.y = Math.PI;
  g.add(monitor);
  
  // 辦公椅 - 在書桌前，面向窗戶
  const chair = createOfficeChair();
  chair.position.set(0, 0, 0.3);
  chair.rotation.y = Math.PI;  // 面向書桌/窗戶
  g.add(chair);
  
  // 層架 - 靠左牆靠近門口
  const shelf = createShelf();
  shelf.position.set(-0.65, 0, -1.0);
  shelf.rotation.y = Math.PI/2;  // 面向房間中央
  g.add(shelf);
  
  // 點光源
  const light = new THREE.PointLight(0xfff8f0, 0.5, 3);
  light.position.set(0, H - 0.3, 0);  // 光源在房間中間
  g.add(light);
  
  g.position.set(offsetX, 0, offsetZ);
  return g;
}
