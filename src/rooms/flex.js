import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from '../materials.js';
import { APARTMENT } from '../config.js';

let M = null;
const ROOM = APARTMENT.spaces.flex;

// 架高地板 (榻榻米概念)
function createRaisedFloor() {
  const g = new THREE.Group();
  const W = 2.2, D = 2.4, H = 0.35;
  
  // 架高平台
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(W, H, D),
    M.lightWood
  );
  platform.position.y = H / 2;
  platform.castShadow = true;
  platform.receiveShadow = true;
  g.add(platform);
  
  // 榻榻米墊
  const tatamiW = 0.9, tatamiD = 1.8;
  [[-0.55, 0], [0.55, 0]].forEach(([x, z]) => {
    const tatami = new THREE.Mesh(
      new THREE.BoxGeometry(tatamiW, 0.03, tatamiD),
      M.tatami
    );
    tatami.position.set(x, H + 0.015, z);
    tatami.receiveShadow = true;
    g.add(tatami);
  });
  
  // 收納抽屜 (側面)
  const drawerM = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.6 });
  for (let i = 0; i < 2; i++) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.02), drawerM);
    drawer.position.set(-0.55 + i * 1.1, 0.2, D / 2 + 0.01);
    g.add(drawer);
    
    // 把手
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.015, 0.02), M.blackMetal);
    handle.position.set(-0.55 + i * 1.1, 0.2, D / 2 + 0.02);
    g.add(handle);
  }
  
  return g;
}

// 懸浮書桌
function createFloatingDesk() {
  const g = new THREE.Group();
  
  // 桌面
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.03, 0.5),
    M.lightWood
  );
  desk.position.y = 0.75;
  desk.castShadow = true;
  g.add(desk);
  
  // 牆面支架
  const bracketM = M.blackMetal;
  [-0.45, 0.45].forEach(x => {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.4), bracketM);
    bracket.position.set(x, 0.73, -0.05);
    g.add(bracket);
  });
  
  // 小層板
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.2), M.lightWood);
  shelf.position.set(0, 1.1, -0.1);
  g.add(shelf);
  
  // 書本
  const bookColors = [0x3d3d3d, 0x5a6b4a, 0xc9a88a];
  bookColors.forEach((c, i) => {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.18, 0.12),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 })
    );
    book.position.set(-0.2 + i * 0.12, 1.2, -0.1);
    book.castShadow = true;
    g.add(book);
  });
  
  // 小盆栽
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.06, 12), M.ceramic);
  pot.position.set(0.25, 1.13, -0.1);
  g.add(pot);
  const plant = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), M.plant);
  plant.position.set(0.25, 1.18, -0.1);
  g.add(plant);
  
  return g;
}

// 障子門風格拉門
function createShojiDoor() {
  const g = new THREE.Group();
  const W = 0.9, H = APARTMENT.height - 0.1;
  
  // 木框
  const frameM = M.lightWood;
  const t = 0.04;
  
  // 外框
  [[0, H/2 - t/2, W, t], [0, -H/2 + t/2, W, t],
   [-W/2 + t/2, 0, t, H], [W/2 - t/2, 0, t, H]].forEach(([x, y, w, h]) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.03), frameM);
    f.position.set(x, y, 0);
    g.add(f);
  });
  
  // 內部格子
  const gridM = M.lightWood;
  // 橫條
  for (let i = 1; i < 4; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.02, 0.02), gridM);
    bar.position.set(0, -H/2 + i * (H / 4), 0);
    g.add(bar);
  }
  // 直條
  const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.02, H - 0.1, 0.02), gridM);
  vBar.position.set(0, 0, 0);
  g.add(vBar);
  
  // 和紙面板 (磨砂玻璃效果)
  const paper = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.08, H - 0.08),
    M.frostedGlass
  );
  paper.position.z = -0.01;
  g.add(paper);
  
  return g;
}

// 坐墊
function createZabuton() {
  const g = new THREE.Group();
  
  const cushion = new THREE.Mesh(
    new RoundedBoxGeometry(0.5, 0.06, 0.5, 4, 0.02),
    M.cushion
  );
  cushion.castShadow = true;
  g.add(cushion);
  
  return g;
}

// 組裝多功能室家具 (不含牆壁)
// 入口在前方 (Z負方向，從走道進入)
// 家具配置：書桌靠後牆，榻榻米在中間，門口淨空
export function createFlexRoom(offsetX = 0, offsetZ = 0) {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 架高地板 (榻榻米) - 在房間深處
  const raised = createRaisedFloor();
  raised.position.set(0, 0, 1.0);  // 移到房間深處
  g.add(raised);
  
  // 懸浮書桌靠後牆
  const desk = createFloatingDesk();
  desk.position.set(0, 0, 1.6);  // 靠後牆
  g.add(desk);
  
  // 坐墊 - 在榻榻米上
  const zabuton = createZabuton();
  zabuton.position.set(0, 0.38, 0.8);
  g.add(zabuton);
  
  g.position.set(offsetX, 0, offsetZ);
  return g;
}
