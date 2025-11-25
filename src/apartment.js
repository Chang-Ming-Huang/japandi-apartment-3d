import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from './materials.js';
import { APARTMENT } from './config.js';

/**
 * 整合式公寓建模
 * 根據 floorplan.md 平面圖實作
 * 
 * 座標系統：
 * - 客廳中心為原點 (0, 0, 0)
 * - X軸：左負右正
 * - Z軸：後負前正 (電視牆在負Z方向)
 * - Y軸：地板為0，向上為正
 */

let M = null;
const H = APARTMENT.height; // 2.7m

// 牆體厚度
const WALL_THICK = 0.12;

// ===== 公寓外殼與隔間 =====
// 
// 平面配置 (俯視)：
// ┌────────────────────────┐
// │  客廳      │  餐廚區   │  ← 後牆 (Z = -2.4)
// │  (0,0)     │  (4.2,0)  │
// ├────────────┴───────────┤  ← 走道分隔線 (Z = -1.2)
// │ 主臥 │ 多功能 │  衛浴  │
// │(-1.5)│ (1.5)  │ (4.2)  │
// └────────────────────────┘  ← 前牆 (Z = -6)
// ↑                        ↑
// 左牆 X=-2.75         右牆 X=5.75
//
function createApartmentShell() {
  const g = new THREE.Group();
  if (!M) M = getMaterials();
  
  // 公寓邊界 (以客廳中心為原點)
  // 根據實際家具位置調整
  const LEFT = -2.75;   // 左牆 X (客廳左側)
  const RIGHT = 5.5;    // 右牆 X (縮小右側空白)
  const BACK = -2.4;    // 後牆 Z (電視牆)
  const FRONT = 6.0;    // 前牆 Z (私領域後方)
  
  const W = RIGHT - LEFT;  // 8.25m
  const D = FRONT - BACK;  // 8.4m
  const centerX = (LEFT + RIGHT) / 2;  // 1.375
  const centerZ = (BACK + FRONT) / 2;  // 1.8
  
  // === 地板 ===
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    M.floor
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(centerX, 0, centerZ);
  floor.receiveShadow = true;
  g.add(floor);
  
  // === 天花板 ===
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    M.ceiling
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(centerX, H, centerZ);
  g.add(ceiling);
  
  // === 外牆 ===
  // 後牆 (北)
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    M.wall
  );
  backWall.position.set(centerX, H/2, BACK);
  backWall.receiveShadow = true;
  g.add(backWall);
  
  // 左牆 (西)
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(D, H),
    M.wall
  );
  leftWall.position.set(LEFT, H/2, centerZ);
  leftWall.rotation.y = Math.PI / 2;
  g.add(leftWall);
  
  // 右牆 (東)
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(D, H),
    M.wall
  );
  rightWall.position.set(RIGHT, H/2, centerZ);
  rightWall.rotation.y = -Math.PI / 2;
  g.add(rightWall);
  
  // 前牆 (南)
  const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    M.wall
  );
  frontWall.position.set(centerX, H/2, FRONT);
  frontWall.rotation.y = Math.PI;
  g.add(frontWall);
  
  return g;
}

// ===== 內部隔間牆 =====
function createInteriorWalls() {
  const g = new THREE.Group();
  if (!M) M = getMaterials();
  
  // 公寓邊界常數 (與 createApartmentShell 一致)
  const LEFT = -2.75;
  const RIGHT = 5.5;
  const CORRIDOR_Z = 2.0;  // 走道分隔線 - 所有門都在這條線上
  const DOOR_WIDTH = 0.85;
  
  // === 方案 B：擴大主臥 + 縮小工作室 ===
  // 主臥室 5坪 + 工作室 1.5坪 + 衛浴 1.5坪
  
  // 主臥室前牆 (有門洞) - 擴大後約 5坪
  const masterFrontWall = createWallWithDoor(4.0, H, DOOR_WIDTH, 'center');
  masterFrontWall.position.set(-0.75, 0, CORRIDOR_Z);
  g.add(masterFrontWall);
  
  // 主臥室右牆 (與工作室相鄰)
  const masterRightWall = new THREE.Mesh(
    new THREE.BoxGeometry(WALL_THICK, H, 4.0),
    M.wall
  );
  masterRightWall.position.set(1.25, H/2, CORRIDOR_Z + 2.0);
  masterRightWall.castShadow = true;
  g.add(masterRightWall);
  
  // 工作室前牆 (有門洞) - 縮小後約 1.5坪
  const studyFrontWall = createWallWithDoor(1.8, H, DOOR_WIDTH, 'center');
  studyFrontWall.position.set(2.2, 0, CORRIDOR_Z);
  g.add(studyFrontWall);
  
  // 工作室右牆 (與衛浴相鄰)
  const studyRightWall = new THREE.Mesh(
    new THREE.BoxGeometry(WALL_THICK, H, 4.0),
    M.wall
  );
  studyRightWall.position.set(3.15, H/2, CORRIDOR_Z + 2.0);
  studyRightWall.castShadow = true;
  g.add(studyRightWall);
  
  // 衛浴前牆 (有門洞) - 從走道進入
  const bathFrontWall = createWallWithDoor(2.2, H, DOOR_WIDTH, 'center');
  bathFrontWall.position.set(4.3, 0, CORRIDOR_Z);
  g.add(bathFrontWall);
  
  return g;
}

// 建立有門洞的牆
function createWallWithDoor(wallWidth, wallHeight, doorWidth, doorPosition = 'center') {
  const g = new THREE.Group();
  if (!M) M = getMaterials();
  
  const doorHeight = 2.1;
  let doorX = 0;
  
  if (doorPosition === 'left') {
    doorX = -wallWidth/2 + doorWidth/2 + 0.3;
  } else if (doorPosition === 'right') {
    doorX = wallWidth/2 - doorWidth/2 - 0.3;
  }
  
  // 門上方的牆
  const topWall = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 0.1, wallHeight - doorHeight, WALL_THICK),
    M.wall
  );
  topWall.position.set(doorX, doorHeight + (wallHeight - doorHeight)/2, 0);
  g.add(topWall);
  
  // 門左側的牆
  const leftWidth = doorX + wallWidth/2 - doorWidth/2;
  if (leftWidth > 0.1) {
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(leftWidth, wallHeight, WALL_THICK),
      M.wall
    );
    leftWall.position.set(-wallWidth/2 + leftWidth/2, wallHeight/2, 0);
    g.add(leftWall);
  }
  
  // 門右側的牆
  const rightWidth = wallWidth/2 - doorX - doorWidth/2;
  if (rightWidth > 0.1) {
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(rightWidth, wallHeight, WALL_THICK),
      M.wall
    );
    rightWall.position.set(wallWidth/2 - rightWidth/2, wallHeight/2, 0);
    g.add(rightWall);
  }
  
  return g;
}

// 建立有門洞的牆 (水平方向，用於餐廚區與衛浴之間)
function createWallWithDoorHorizontal(wallDepth, wallHeight, doorWidth, doorPosition = 'center') {
  const g = new THREE.Group();
  if (!M) M = getMaterials();
  
  const doorHeight = 2.1;
  let doorZ = 0;
  
  if (doorPosition === 'front') {
    doorZ = -wallDepth/2 + doorWidth/2 + 0.3;
  } else if (doorPosition === 'back') {
    doorZ = wallDepth/2 - doorWidth/2 - 0.3;
  }
  
  // 門上方的牆
  const topWall = new THREE.Mesh(
    new THREE.BoxGeometry(WALL_THICK, wallHeight - doorHeight, doorWidth + 0.1),
    M.wall
  );
  topWall.position.set(0, doorHeight + (wallHeight - doorHeight)/2, doorZ);
  g.add(topWall);
  
  // 門前側的牆
  const frontWidth = doorZ + wallDepth/2 - doorWidth/2;
  if (frontWidth > 0.1) {
    const frontWall = new THREE.Mesh(
      new THREE.BoxGeometry(WALL_THICK, wallHeight, frontWidth),
      M.wall
    );
    frontWall.position.set(0, wallHeight/2, -wallDepth/2 + frontWidth/2);
    g.add(frontWall);
  }
  
  // 門後側的牆
  const backWidth = wallDepth/2 - doorZ - doorWidth/2;
  if (backWidth > 0.1) {
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(WALL_THICK, wallHeight, backWidth),
      M.wall
    );
    backWall.position.set(0, wallHeight/2, wallDepth/2 - backWidth/2);
    g.add(backWall);
  }
  
  return g;
}

// ===== 門 =====
function createDoors() {
  const g = new THREE.Group();
  if (!M) M = getMaterials();
  
  const CORRIDOR_Z = 2.0;  // 走道分隔線 - 所有門都在這條線上
  const DOOR_WIDTH = 0.85;
  const DOOR_HEIGHT = 2.1;
  
  // 主臥室門 - 統一風格 (擴大後的主臥)
  const masterDoor = createJapandiDoor(DOOR_WIDTH, DOOR_HEIGHT);
  masterDoor.position.set(-0.75, 0, CORRIDOR_Z);
  g.add(masterDoor);
  
  // 工作室門 - 統一風格
  const studyDoor = createJapandiDoor(DOOR_WIDTH, DOOR_HEIGHT);
  studyDoor.position.set(2.2, 0, CORRIDOR_Z);
  g.add(studyDoor);
  
  // 衛浴門 - 統一風格 (靠走道)
  const bathDoor = createJapandiDoor(DOOR_WIDTH, DOOR_HEIGHT);
  bathDoor.position.set(4.3, 0, CORRIDOR_Z);
  g.add(bathDoor);
  
  return g;
}

// 統一風格門 - Japandi 風格 (淺橡木框 + 磨砂玻璃)
function createJapandiDoor(w, h) {
  const g = new THREE.Group();
  
  const frameThick = 0.04;
  const frameMat = M.lightWood;
  
  // 外框 - 淺橡木
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, frameThick, 0.04), frameMat);
  top.position.set(0, h - frameThick/2, 0);
  top.castShadow = true;
  g.add(top);
  
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, frameThick, 0.04), frameMat);
  bottom.position.set(0, frameThick/2, 0);
  g.add(bottom);
  
  const left = new THREE.Mesh(new THREE.BoxGeometry(frameThick, h, 0.04), frameMat);
  left.position.set(-w/2 + frameThick/2, h/2, 0);
  left.castShadow = true;
  g.add(left);
  
  const right = new THREE.Mesh(new THREE.BoxGeometry(frameThick, h, 0.04), frameMat);
  right.position.set(w/2 - frameThick/2, h/2, 0);
  right.castShadow = true;
  g.add(right);
  
  // 中間橫條 (簡約設計，只有一條)
  const midBar = new THREE.Mesh(new THREE.BoxGeometry(w - frameThick*2, frameThick/2, 0.03), frameMat);
  midBar.position.set(0, h * 0.7, 0);
  g.add(midBar);
  
  // 磨砂玻璃面板
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(w - frameThick*2, h - frameThick*2),
    M.frostedGlass
  );
  glass.position.set(0, h/2, -0.01);
  g.add(glass);
  
  // 門把 - 簡約黑色金屬
  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.15, 0.03),
    M.blackMetal
  );
  handle.position.set(w/2 - 0.1, h/2, 0.03);
  g.add(handle);
  
  return g;
}

// 玻璃推門
function createGlassDoor(w, h) {
  const g = new THREE.Group();
  
  // 金屬框
  const frameThick = 0.025;
  const frameMat = M.blackMetal;
  
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, frameThick, 0.03), frameMat);
  top.position.set(0, h - frameThick/2, 0); g.add(top);
  
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, frameThick, 0.03), frameMat);
  bottom.position.set(0, frameThick/2, 0); g.add(bottom);
  
  const left = new THREE.Mesh(new THREE.BoxGeometry(frameThick, h, 0.03), frameMat);
  left.position.set(-w/2 + frameThick/2, h/2, 0); g.add(left);
  
  const right = new THREE.Mesh(new THREE.BoxGeometry(frameThick, h, 0.03), frameMat);
  right.position.set(w/2 - frameThick/2, h/2, 0); g.add(right);
  
  // 磨砂玻璃
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(w - frameThick*2, h - frameThick*2),
    M.frostedGlass
  );
  glass.position.set(0, h/2, 0);
  g.add(glass);
  
  return g;
}

// ===== 匯出整合函數 =====
export function createApartmentStructure() {
  const g = new THREE.Group();
  if (!M) M = getMaterials();
  
  g.add(createApartmentShell());
  g.add(createInteriorWalls());
  g.add(createDoors());
  
  return g;
}
