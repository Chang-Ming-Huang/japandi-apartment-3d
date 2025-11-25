import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from '../materials.js';
import { APARTMENT } from '../config.js';

let M = null;
const ROOM = APARTMENT.spaces.kitchen;

// L型廚具
function createLKitchen() {
  const g = new THREE.Group();
  
  // 底櫃 - L型
  // 長邊
  const cab1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 0.6), M.whiteKitchen);
  cab1.position.set(0, 0.425, -0.3); cab1.castShadow = true; g.add(cab1);
  
  // 短邊
  const cab2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.85, 1.2), M.whiteKitchen);
  cab2.position.set(-1.5, 0.425, 0.3); cab2.castShadow = true; g.add(cab2);
  
  // 檯面 - 淺木色
  const top1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.04, 0.65), M.lightWood);
  top1.position.set(0, 0.87, -0.3); top1.castShadow = true; g.add(top1);
  
  const top2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 1.25), M.lightWood);
  top2.position.set(-1.5, 0.87, 0.3); top2.castShadow = true; g.add(top2);
  
  // 水槽
  const sink = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.02, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 })
  );
  sink.position.set(-0.5, 0.88, -0.3); g.add(sink);
  
  // 水龍頭
  const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8), M.blackMetal);
  faucet.position.set(-0.5, 1.0, -0.5); g.add(faucet);
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8), M.blackMetal);
  spout.position.set(-0.5, 1.1, -0.42); spout.rotation.x = Math.PI / 2; g.add(spout);
  
  // 上櫃
  const upCab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.35), M.whiteKitchen);
  upCab.position.set(0.3, 1.7, -0.42); upCab.castShadow = true; g.add(upCab);
  
  // 把手
  const handleG = new THREE.BoxGeometry(0.15, 0.015, 0.02);
  [[-0.4, 0.55], [0.1, 0.55], [0.6, 0.55], [-0.4, 0.25], [0.1, 0.25], [0.6, 0.25]].forEach(([x, y]) => {
    const h = new THREE.Mesh(handleG, M.blackMetal);
    h.position.set(x, y, 0.01); g.add(h);
  });
  
  // 上櫃把手
  [[-0.15, 1.55], [0.45, 1.55]].forEach(([x, y]) => {
    const h = new THREE.Mesh(handleG, M.blackMetal);
    h.position.set(x, y, -0.24); g.add(h);
  });
  
  return g;
}

// 餐桌
// 長邊兩側各放2張餐椅，共4張
function createDiningTable() {
  const g = new THREE.Group();
  
  // 餐桌桌面
  const top = new THREE.Mesh(
    new RoundedBoxGeometry(1.4, 0.04, 0.8, 2, 0.01),
    M.lightWood
  );
  top.position.set(0, 0.75, 0);
  top.castShadow = true;
  g.add(top);
  
  // 桌腳 - 四支
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8);
  [[-0.6, -0.3], [-0.6, 0.3], [0.6, -0.3], [0.6, 0.3]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, M.lightWood);
    leg.position.set(x, 0.36, z);
    leg.castShadow = true;
    g.add(leg);
  });
  
  // 餐椅 - 長邊兩側各兩張 (共4張)
  // 前側兩張 (Z 較小)
  for (let i = 0; i < 2; i++) {
    const chair = createDiningChair();
    chair.position.set(-0.4 + i * 0.8, 0, -0.55);
    chair.rotation.y = 0;  // 面向餐桌
    g.add(chair);
  }
  // 後側兩張 (Z 較大)
  for (let i = 0; i < 2; i++) {
    const chair = createDiningChair();
    chair.position.set(-0.4 + i * 0.8, 0, 0.55);
    chair.rotation.y = Math.PI;  // 面向餐桌
    g.add(chair);
  }
  
  return g;
}

// 餐椅
function createDiningChair() {
  const g = new THREE.Group();
  
  // 座墊
  const seat = new THREE.Mesh(
    new RoundedBoxGeometry(0.4, 0.04, 0.4, 2, 0.01),
    M.cushion
  );
  seat.position.y = 0.45;
  seat.castShadow = true;
  g.add(seat);
  
  // 椅背
  const back = new THREE.Mesh(
    new RoundedBoxGeometry(0.38, 0.4, 0.03, 2, 0.01),
    M.lightWood
  );
  back.position.set(0, 0.7, -0.18);
  back.castShadow = true;
  g.add(back);
  
  // 椅腳 - 四支
  const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.43, 8);
  [[-0.15, -0.15], [-0.15, 0.15], [0.15, -0.15], [0.15, 0.15]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, M.lightWood);
    leg.position.set(x, 0.215, z);
    leg.castShadow = true;
    g.add(leg);
  });
  
  return g;
}

// 高腳椅
function createBarStool() {
  const g = new THREE.Group();
  
  // 座墊
  const seat = new THREE.Mesh(
    new RoundedBoxGeometry(0.35, 0.05, 0.35, 2, 0.02),
    M.cushion
  );
  seat.position.y = 0.65; seat.castShadow = true; g.add(seat);
  
  // 腳架
  const legG = new THREE.CylinderGeometry(0.015, 0.02, 0.63, 8);
  [[-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12], [0.12, 0.12]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legG, M.lightWood);
    leg.position.set(x, 0.32, z);
    leg.rotation.x = z * 0.15; leg.rotation.z = -x * 0.15;
    leg.castShadow = true; g.add(leg);
  });
  
  // 腳踏
  const footrest = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.02, 0.02), M.blackMetal);
  footrest.position.set(0, 0.25, 0.15); g.add(footrest);
  
  return g;
}

// 吊燈
function createPendantLights() {
  const g = new THREE.Group();
  
  const pG = new THREE.SphereGeometry(0.12, 24, 24);
  const pM = new THREE.MeshStandardMaterial({ 
    color: 0xfff8e7, emissive: 0xfff0d4, emissiveIntensity: 0.5, 
    transparent: true, opacity: 0.9 
  });
  
  [-0.3, 0.3].forEach((x, i) => {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.7 + i * 0.12, 8), M.blackMetal);
    cord.position.set(x, APARTMENT.height - 0.35 - i * 0.06, 0); g.add(cord);
    
    const pendant = new THREE.Mesh(pG, pM);
    pendant.position.set(x, APARTMENT.height - 0.7 - i * 0.12, 0); g.add(pendant);
    
    const light = new THREE.PointLight(0xfff5e6, 0.5, 3);
    light.position.copy(pendant.position); g.add(light);
  });
  
  return g;
}

// 組裝餐廚區家具 (不含牆壁)
// 配置說明：
//   - 廚具靠後牆 (L型)
//   - 餐桌在中央，長邊兩側各放2張椅子
//   - 弔燈在餐桌上方
export function createKitchenRoom(offsetX = 0, offsetZ = 0) {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  
  // L型廚具靠後牆
  const kitchen = createLKitchen();
  kitchen.position.set(0.3, 0, -1.2);
  g.add(kitchen);
  
  // 餐桌 - 在房間中央，長邊兩側各放椅子
  const diningTable = createDiningTable();
  diningTable.position.set(0, 0, 0.3);
  g.add(diningTable);
  
  // 弔燈 - 在餐桌上方
  const lights = createPendantLights();
  lights.position.set(0, 0, 0.3);
  g.add(lights);
  
  g.position.set(offsetX, 0, offsetZ);
  return g;
}
