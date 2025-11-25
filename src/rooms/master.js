import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from '../materials.js';
import { APARTMENT } from '../config.js';

let M = null;
const ROOM = APARTMENT.spaces.master;

// 低床架
function createBed() {
  const g = new THREE.Group();
  
  // 床架 - 低矮設計
  const frame = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.12, 2.0, 2, 0.02), M.lightWood);
  frame.position.y = 0.06; frame.castShadow = true; g.add(frame);
  
  // 床墊
  const mattress = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.2, 1.9, 4, 0.03), M.linenBedding);
  mattress.position.y = 0.22; mattress.castShadow = true; g.add(mattress);
  
  // 枕頭
  const pillowG = new RoundedBoxGeometry(0.55, 0.12, 0.35, 4, 0.04);
  [-0.35, 0.35].forEach(x => {
    const pillow = new THREE.Mesh(pillowG, M.linenBedding);
    pillow.position.set(x, 0.38, -0.7); pillow.castShadow = true; g.add(pillow);
  });
  
  // 被子
  const blanket = new THREE.Mesh(
    new RoundedBoxGeometry(1.4, 0.15, 1.3, 4, 0.05),
    M.cushion
  );
  blanket.position.set(0, 0.38, 0.2); blanket.castShadow = true; g.add(blanket);
  
  // 床頭板
  const headboard = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.6, 0.05, 2, 0.01), M.lightWood);
  headboard.position.set(0, 0.5, -0.98); headboard.castShadow = true; g.add(headboard);
  
  return g;
}

// 頂天衣櫃牆
function createWardrobe() {
  const g = new THREE.Group();
  const H = APARTMENT.height;
  
  // 主體 - 與牆同色
  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, H - 0.02, 0.6),
    M.wall
  );
  wardrobe.position.set(0, H/2, 0); wardrobe.castShadow = true; g.add(wardrobe);
  
  // 門縫線條
  const lineM = new THREE.MeshStandardMaterial({ color: 0xe8e0d5, roughness: 0.8 });
  [-0.5, 0.5].forEach(x => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.01, H - 0.1, 0.01), lineM);
    line.position.set(x, H/2, 0.3); g.add(line);
  });
  
  // 隱藏把手凹槽
  const grooveM = new THREE.MeshStandardMaterial({ color: 0xd4ccc0, roughness: 0.5 });
  [-0.52, 0.48].forEach(x => {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.02), grooveM);
    groove.position.set(x, 1.2, 0.3); g.add(groove);
  });
  
  return g;
}

// 床頭櫃
function createNightstand() {
  const g = new THREE.Group();
  
  // 櫃體
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.35, 0.35, 2, 0.02), M.lightWood);
  body.position.y = 0.175; body.castShadow = true; g.add(body);
  
  // 抽屜線
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.01, 0.01),
    new THREE.MeshStandardMaterial({ color: 0xc4b8a8 })
  );
  line.position.set(0, 0.175, 0.176); g.add(line);
  
  // 檯燈
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 16), M.ceramic);
  lampBase.position.set(0, 0.36, 0); g.add(lampBase);
  
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), M.blackMetal);
  lampPole.position.set(0, 0.49, 0); g.add(lampPole);
  
  const lampShade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.12, 16),
    new THREE.MeshStandardMaterial({ 
      color: 0xf5f0e8, emissive: 0xfff5e6, emissiveIntensity: 0.3,
      side: THREE.DoubleSide 
    })
  );
  lampShade.position.set(0, 0.65, 0); g.add(lampShade);
  
  return g;
}

// 窗戶 (百葉窗)
function createBedroomWindow() {
  const g = new THREE.Group();
  const W = 1.2, H = 1.4;
  
  // 窗框
  const frameM = M.wall;
  const t = 0.05;
  [[0, H/2 - t/2, W, t], [0, -H/2 + t/2, W, t],
   [-W/2 + t/2, 0, t, H], [W/2 - t/2, 0, t, H]].forEach(([x, y, w, h]) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), frameM);
    f.position.set(x, y, 0); g.add(f);
  });
  
  // 天空
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.1, H - 0.1),
    new THREE.MeshStandardMaterial({ color: 0xd8e8f0, emissive: 0xc0d8e8, emissiveIntensity: 0.3 })
  );
  sky.position.z = -0.02; g.add(sky);
  
  // 百葉窗
  const blindM = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 12; i++) {
    const blind = new THREE.Mesh(new THREE.BoxGeometry(W - 0.12, 0.04, 0.01), blindM);
    blind.position.set(0, H/2 - 0.1 - i * 0.1, 0.03);
    blind.rotation.x = 0.3; // 微開
    g.add(blind);
  }
  
  return g;
}

// 化妝台
function createVanityDesk() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 桌面
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.03, 0.4),
    M.lightWood
  );
  top.position.y = 0.75;
  top.castShadow = true;
  g.add(top);
  
  // 桌腳
  const legGeo = new THREE.BoxGeometry(0.04, 0.72, 0.04);
  [[-0.35, -0.15], [-0.35, 0.15], [0.35, -0.15], [0.35, 0.15]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, M.lightWood);
    leg.position.set(x, 0.36, z);
    g.add(leg);
  });
  
  // 鏡子
  const mirror = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xaaccdd, metalness: 0.9, roughness: 0.1 })
  );
  mirror.position.set(0, 1.1, -0.18);
  g.add(mirror);
  
  // 鏡框
  const frameGeo = new THREE.BoxGeometry(0.54, 0.64, 0.03);
  const frame = new THREE.Mesh(frameGeo, M.lightWood);
  frame.position.set(0, 1.1, -0.19);
  g.add(frame);
  
  // 化妝品小物
  const item1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8), M.ceramic);
  item1.position.set(-0.2, 0.81, 0);
  g.add(item1);
  
  const item2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.06), M.ceramic);
  item2.position.set(0.15, 0.79, 0);
  g.add(item2);
  
  return g;
}

// 化妝椅
function createVanityStool() {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // 座墊
  const seat = new THREE.Mesh(
    new RoundedBoxGeometry(0.35, 0.06, 0.35, 4, 0.02),
    M.cushion
  );
  seat.position.y = 0.45;
  g.add(seat);
  
  // 腳架
  const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8);
  [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, M.lightWood);
    leg.position.set(x, 0.21, z);
    g.add(leg);
  });
  
  return g;
}

// 組裝主臥室家具 (不含牆壁)
// 入口在前方 (從走道進入)
// 房間深度 4.0m（從 Z=-2.0 門口到 Z=2.0 後牆）
// 實際配置：
//   - 床頭靠後牆（窗戶那側），床尾朝向門口
//   - 衣櫃靠左牆，門可以完全打開
//   - 化妝台靠左牆靠近門口
//   - 床頭櫃在床的右側
export function createMasterBedroom(offsetX = 0, offsetZ = 0) {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  const H = APARTMENT.height;
  
  // 床 - 床頭靠後牆（窗戶那側）
  const bed = createBed();
  bed.position.set(0.3, 0, 0.8);
  bed.rotation.y = Math.PI;  // 床頭朝後牆
  g.add(bed);
  
  // 床頭櫃 - 右側靠牆
  const ns2 = createNightstand();
  ns2.position.set(1.6, 0, 1.1);
  g.add(ns2);
  
  // 衣櫃 - 靠左牆後段（床頭左側位置）
  const wardrobe = createWardrobe();
  wardrobe.position.set(-1.3, 0, 0.6);
  wardrobe.rotation.y = Math.PI/2;  // 面向右側（房間中央）
  g.add(wardrobe);
  
  // 化妝台 - 靠左牆前段（靠近門口）
  const vanity = createVanityDesk();
  vanity.position.set(-1.3, 0, -1.2);
  vanity.rotation.y = Math.PI/2;  // 面向右側（房間中央）
  g.add(vanity);
  
  // 化妝椅 - 在化妝台前
  const stool = createVanityStool();
  stool.position.set(-0.85, 0, -1.2);
  g.add(stool);
  
  // 窗戶 - 後牆（床頭上方）
  const win = createBedroomWindow();
  win.position.set(0.3, H/2, 1.9);
  g.add(win);
  
  g.position.set(offsetX, 0, offsetZ);
  return g;
}
