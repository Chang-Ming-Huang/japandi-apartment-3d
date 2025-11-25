import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from '../materials.js';
import { APARTMENT } from '../config.js';

let M = null;
const ROOM = APARTMENT.spaces.bath;

// 懸浮洗手台
function createVanity() {
  const g = new THREE.Group();
  
  // 懸浮櫃體
  const cabinet = new THREE.Mesh(
    new RoundedBoxGeometry(0.9, 0.35, 0.45, 2, 0.02),
    M.lightWood
  );
  cabinet.position.y = 0.7;
  cabinet.castShadow = true;
  g.add(cabinet);
  
  // 檯面
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.03, 0.5),
    M.stoneTile
  );
  top.position.y = 0.89;
  top.castShadow = true;
  g.add(top);
  
  // 洗手盆
  const basin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.15, 0.08, 24),
    M.ceramic
  );
  basin.position.set(0, 0.88, 0.05);
  g.add(basin);
  
  // 水龍頭
  const faucetBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8),
    M.blackMetal
  );
  faucetBase.position.set(0, 0.97, -0.12);
  g.add(faucetBase);
  
  const faucetSpout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.12, 8),
    M.blackMetal
  );
  faucetSpout.position.set(0, 1.02, -0.06);
  faucetSpout.rotation.x = Math.PI / 2.5;
  g.add(faucetSpout);
  
  // 抽屜把手
  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.015, 0.02),
    M.blackMetal
  );
  handle.position.set(0, 0.7, 0.235);
  g.add(handle);
  
  return g;
}

// LED 背光鏡
function createMirror() {
  const g = new THREE.Group();
  const W = 0.7, H = 0.9;
  
  // 鏡框
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.04, H + 0.04, 0.03),
    M.blackMetal
  );
  g.add(frame);
  
  // 鏡面
  const mirror = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.05, 
      metalness: 0.9 
    })
  );
  mirror.position.z = 0.016;
  g.add(mirror);
  
  // LED 背光效果
  const ledMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    emissive: 0xfff8f0, 
    emissiveIntensity: 0.8 
  });
  
  // 上下 LED 條
  const ledH = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.02, 0.01), ledMat);
  ledH.position.set(0, H/2 - 0.05, -0.02);
  g.add(ledH);
  
  const ledH2 = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.02, 0.01), ledMat);
  ledH2.position.set(0, -H/2 + 0.05, -0.02);
  g.add(ledH2);
  
  return g;
}

// 玻璃淋浴間
function createShower() {
  const g = new THREE.Group();
  const W = 0.9, D = 0.9, H = APARTMENT.height - 0.1;
  
  // 底盤
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(W, 0.05, D),
    M.stoneTile
  );
  base.position.y = 0.025;
  base.receiveShadow = true;
  g.add(base);
  
  // 玻璃隔斷
  const glassPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, H - 0.3, D),
    M.glass
  );
  glassPanel.position.set(W/2 - 0.01, H/2 - 0.1, 0);
  g.add(glassPanel);
  
  // 玻璃門
  const glassDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, H - 0.3, D * 0.6),
    M.glass
  );
  glassDoor.position.set(W/2 - 0.15, H/2 - 0.1, D/2 - D * 0.3);
  g.add(glassDoor);
  
  // 淋浴花灑
  const showerArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8),
    M.blackMetal
  );
  showerArm.position.set(-W/2 + 0.15, H - 0.4, -D/2 + 0.15);
  showerArm.rotation.x = Math.PI / 4;
  g.add(showerArm);
  
  const showerHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.02, 24),
    M.blackMetal
  );
  showerHead.position.set(-W/2 + 0.25, H - 0.5, -D/2 + 0.25);
  showerHead.rotation.x = Math.PI / 6;
  g.add(showerHead);
  
  // 控制閥
  const valve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16),
    M.blackMetal
  );
  valve.position.set(-W/2 + 0.1, 1.2, -D/2 + 0.05);
  valve.rotation.x = Math.PI / 2;
  g.add(valve);
  
  return g;
}

// 馬桶
function createToilet() {
  const g = new THREE.Group();
  
  // 底座
  const base = new THREE.Mesh(
    new RoundedBoxGeometry(0.38, 0.35, 0.55, 4, 0.05),
    M.ceramic
  );
  base.position.y = 0.175;
  base.castShadow = true;
  g.add(base);
  
  // 座圈
  const seat = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.04, 8, 24),
    M.ceramic
  );
  seat.position.set(0, 0.38, 0.05);
  seat.rotation.x = Math.PI / 2;
  g.add(seat);
  
  // 水箱
  const tank = new THREE.Mesh(
    new RoundedBoxGeometry(0.35, 0.4, 0.15, 4, 0.03),
    M.ceramic
  );
  tank.position.set(0, 0.55, -0.2);
  tank.castShadow = true;
  g.add(tank);
  
  // 沖水按鈕
  const button = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16),
    M.blackMetal
  );
  button.position.set(0, 0.76, -0.2);
  g.add(button);
  
  return g;
}

// 組裝衛浴家具 (不含牆壁)
// 入口在前方 (從走道進入)
// 配置順序（從門口到牆）：洗手台 → 馬桶 → 淋浴設備
export function createBathroom(offsetX = 0, offsetZ = 0) {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  const H = APARTMENT.height;
  
  // 房間深度 4.0m（從 Z=-2.0 門口到 Z=2.0 後牆）
  // 三個區域平均分布：洗手台(-1.0), 馬桶(0.2), 淋浴(1.2)
  
  // 洗手台 - 靠近門口但不擋門，轉 90 度靠左牆
  const vanity = createVanity();
  vanity.position.set(-0.5, 0, -1.0);
  vanity.rotation.y = Math.PI / 2; // 轉 90 度靠牆
  g.add(vanity);
  
  // 鏡子 - 洗手台上方（左牆）
  const mirror = createMirror();
  mirror.position.set(-0.75, 1.5, -1.0);
  mirror.rotation.y = Math.PI / 2;
  g.add(mirror);
  
  // 馬桶 - 中間位置，轉 90 度靠左牆
  const toilet = createToilet();
  toilet.position.set(-0.5, 0, 0.2);
  toilet.rotation.y = Math.PI / 2; // 轉 90 度靠牆
  g.add(toilet);
  
  // 淋浴間 - 最裡面靠牆
  const shower = createShower();
  shower.position.set(0, 0, 1.2);
  g.add(shower);
  
  // 乾濕分離玻璃隔間（在馬桶和淋浴間之間）
  const glassPartition = createGlassPartition();
  glassPartition.position.set(0, 0, 0.6);
  g.add(glassPartition);
  
  // 點光源
  const light = new THREE.PointLight(0xfff8f0, 0.6, 4);
  light.position.set(0, H - 0.3, 0.8);
  g.add(light);
  
  g.position.set(offsetX, 0, offsetZ);
  return g;
}

// 乾濕分離玻璃隔間
function createGlassPartition() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 玻璃門框 (黑色金屬)
  const frameThick = 0.03;
  const partitionWidth = 1.2;
  const partitionHeight = 2.0;
  
  // 左側固定玻璃
  const fixedGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, partitionHeight),
    M.frostedGlass
  );
  fixedGlass.position.set(-0.35, partitionHeight/2, 0);
  g.add(fixedGlass);
  
  // 左側玻璃框
  const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThick, partitionHeight, frameThick),
    M.blackMetal
  );
  leftFrame.position.set(-0.6, partitionHeight/2, 0);
  g.add(leftFrame);
  
  // 滑動玻璃門
  const slidingDoor = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, partitionHeight),
    M.frostedGlass
  );
  slidingDoor.position.set(0.2, partitionHeight/2, 0);
  g.add(slidingDoor);
  
  // 門框
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThick, partitionHeight, frameThick),
    M.blackMetal
  );
  doorFrame.position.set(0.5, partitionHeight/2, 0);
  g.add(doorFrame);
  
  // 上軌道
  const topRail = new THREE.Mesh(
    new THREE.BoxGeometry(partitionWidth, frameThick, frameThick),
    M.blackMetal
  );
  topRail.position.set(0, partitionHeight, 0);
  g.add(topRail);
  
  return g;
}
