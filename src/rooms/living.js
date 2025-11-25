import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getMaterials } from '../materials.js';
import { APARTMENT } from '../config.js';

let M = null;
const ROOM = APARTMENT.spaces.living;

function getM() {
  if (!M) M = getMaterials();
  return M;
}

// 低矮米色布藝沙發
function createSofa() {
  const g = new THREE.Group();
  const W = 2.3, D = 0.95, sH = 0.32, bH = 0.35;
  
  // 木框
  const frame = new THREE.Mesh(new RoundedBoxGeometry(W + 0.1, 0.08, D + 0.1, 2, 0.02), M.lightWood);
  frame.position.y = 0.04; frame.castShadow = true; g.add(frame);
  
  // 座墊
  const seat = new THREE.Mesh(new RoundedBoxGeometry(W, sH, D, 4, 0.06), M.sofaFabric);
  seat.position.y = 0.08 + sH / 2; seat.castShadow = true; g.add(seat);
  
  // 靠背
  const back = new THREE.Mesh(new RoundedBoxGeometry(W - 0.1, bH, 0.18, 4, 0.05), M.sofaFabric);
  back.position.set(0, 0.08 + sH + bH / 2 - 0.05, -D / 2 + 0.12);
  back.rotation.x = -0.12; back.castShadow = true; g.add(back);
  
  // 扶手
  const armG = new RoundedBoxGeometry(0.12, 0.22, D - 0.1, 4, 0.04);
  [-1, 1].forEach(s => {
    const arm = new THREE.Mesh(armG, M.sofaFabric);
    arm.position.set(s * (W / 2 - 0.02), 0.08 + sH / 2 + 0.05, 0.02);
    arm.castShadow = true; g.add(arm);
  });
  
  // 抱枕
  const pG = new RoundedBoxGeometry(0.4, 0.4, 0.1, 4, 0.04);
  const p1 = new THREE.Mesh(pG, M.pillowWarm);
  p1.position.set(-0.75, 0.55, 0.1); p1.rotation.set(-0.2, 0.1, 0.15); p1.castShadow = true; g.add(p1);
  const p2 = new THREE.Mesh(pG, M.pillowCool);
  p2.position.set(0.7, 0.52, 0.08); p2.rotation.set(-0.15, -0.1, -0.1); p2.castShadow = true; g.add(p2);
  
  // 木腳
  const lG = new THREE.CylinderGeometry(0.025, 0.02, 0.08, 8);
  [[-W/2+0.15, 0.04, D/2-0.1], [W/2-0.15, 0.04, D/2-0.1], 
   [-W/2+0.15, 0.04, -D/2+0.1], [W/2-0.15, 0.04, -D/2+0.1]].forEach(p => {
    const l = new THREE.Mesh(lG, M.lightWood); l.position.set(...p); l.castShadow = true; g.add(l);
  });
  
  return g;
}

// 曲線木質茶几
function createCoffeeTable() {
  const g = new THREE.Group();
  
  // 橢圓桌面
  const shape = new THREE.Shape();
  shape.ellipse(0, 0, 0.55, 0.35, 0, Math.PI * 2, false, 0);
  const tG = new THREE.ExtrudeGeometry(shape, { 
    depth: 0.035, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 
  });
  const top = new THREE.Mesh(tG, M.lightWood);
  top.rotation.x = -Math.PI / 2; top.position.y = 0.32;
  top.castShadow = true; top.receiveShadow = true; g.add(top);
  
  // 三腳
  const lG = new THREE.CylinderGeometry(0.018, 0.022, 0.3, 8);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 6;
    const l = new THREE.Mesh(lG, M.lightWood);
    l.position.set(Math.cos(a) * 0.3, 0.15, Math.sin(a) * 0.2);
    l.rotation.x = Math.sin(a) * 0.08; l.rotation.z = -Math.cos(a) * 0.08;
    l.castShadow = true; g.add(l);
  }
  
  // 花瓶
  const vG = new THREE.LatheGeometry([
    new THREE.Vector2(0, 0), new THREE.Vector2(0.04, 0.01), new THREE.Vector2(0.05, 0.06),
    new THREE.Vector2(0.045, 0.12), new THREE.Vector2(0.03, 0.16), new THREE.Vector2(0.025, 0.18)
  ], 24);
  const v = new THREE.Mesh(vG, M.ceramic);
  v.position.set(0.15, 0.355, -0.05); v.castShadow = true; g.add(v);
  
  // 枝條
  const bM = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.002, 0.25, 4), bM);
    b.position.set(0.15 + (i - 1) * 0.015, 0.48, -0.05); b.rotation.z = (i - 1) * 0.15; g.add(b);
  }
  
  // 書
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.025, 0.13),
    new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.8 })
  );
  book.position.set(-0.2, 0.37, 0.05); book.rotation.y = 0.2; book.castShadow = true; g.add(book);
  
  return g;
}

// 落地窗與亞麻窗簾
function createWindow() {
  const g = new THREE.Group();
  const W = 2.4, H = 2.2, t = 0.04;
  
  // 黑框
  const frames = [
    [0, H/2 - t/2, W, t], [0, -H/2 + t/2, W, t],
    [-W/2 + t/2, 0, t, H], [W/2 - t/2, 0, t, H], [0, 0, t, H - t*2]
  ];
  frames.forEach(([x, y, w, h]) => {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), M.blackMetal);
    f.position.set(x, y, 0); g.add(f);
  });
  
  // 天空
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.1, H - 0.1),
    new THREE.MeshStandardMaterial({ color: 0xc5dbe8, emissive: 0xa8c8d8, emissiveIntensity: 0.4 })
  );
  sky.position.z = -0.02; g.add(sky);
  
  // 玻璃
  const gl = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.08, H - 0.08), M.glass);
  gl.position.z = 0.02; g.add(gl);
  
  // 窗簾桿
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, W + 0.6, 12), M.blackMetal);
  rod.rotation.z = Math.PI / 2; rod.position.set(0, H / 2 + 0.15, 0.15); g.add(rod);
  
  // 紗簾
  const sheer = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.4, H + 0.3), M.sheerLinen);
  sheer.position.set(0, -0.05, 0.2); g.add(sheer);
  
  // 側簾
  const sM = new THREE.MeshStandardMaterial({ color: 0xf0ebe3, roughness: 0.9, side: THREE.DoubleSide });
  [-W/2 - 0.3, W/2 + 0.3].forEach(x => {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(0.4, H + 0.3), sM);
    c.position.set(x, -0.05, 0.25); g.add(c);
  });
  
  return g;
}

// 電視牆
function createTVWall() {
  const g = new THREE.Group();
  
  // 懸浮電視櫃
  const cab = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.28, 0.38, 2, 0.02), M.lightWood);
  cab.position.set(0, 0.5, 0); cab.castShadow = true; g.add(cab);
  
  // 電視
  const tv = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.75, 0.025, 2, 0.005), M.matteBlack);
  tv.position.set(0, 1.1, 0); tv.castShadow = true; g.add(tv);
  const scr = new THREE.Mesh(
    new THREE.PlaneGeometry(1.24, 0.69),
    new THREE.MeshStandardMaterial({ color: 0x0a0a12, roughness: 0.05, emissive: 0x1a2030, emissiveIntensity: 0.15 })
  );
  scr.position.set(0, 1.1, 0.014); g.add(scr);
  
  // 裝飾
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 16), M.terracotta);
  pot.position.set(-0.7, 0.69, 0); pot.castShadow = true; g.add(pot);
  const plant = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), M.plant);
  plant.position.set(-0.7, 0.78, 0); plant.castShadow = true; g.add(plant);
  
  // 書
  let y = 0.64;
  [[0.6, 0.025, 0x3d3d3d], [0.62, 0.02, 0xc9a88a], [0.58, 0.018, 0x5a6b4a]].forEach(([x, h, c]) => {
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, h, 0.12),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 })
    );
    b.position.set(x, y + h/2, 0); b.castShadow = true; g.add(b);
    y += h;
  });
  
  return g;
}

// 地毯
function createRug() {
  const w = 2.4, h = 1.7, r = 0.1;
  const shape = new THREE.Shape();
  shape.moveTo(-w/2 + r, -h/2);
  shape.lineTo(w/2 - r, -h/2);
  shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
  shape.lineTo(w/2, h/2 - r);
  shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
  shape.lineTo(-w/2 + r, h/2);
  shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
  shape.lineTo(-w/2, -h/2 + r);
  shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
  
  const rugM = new THREE.MeshStandardMaterial({ color: 0xe0d8cc, roughness: 0.98 });
  const rug = new THREE.Mesh(new THREE.ShapeGeometry(shape), rugM);
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = 0.005;
  rug.receiveShadow = true;
  return rug;
}

// 落地植物
function createPlant() {
  const g = new THREE.Group();
  
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.35, 24), M.ceramic);
  pot.position.y = 0.175; pot.castShadow = true; g.add(pot);
  
  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.02, 24),
    new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 1 })
  );
  soil.position.y = 0.34; g.add(soil);
  
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.025, 0.7, 8),
    new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 })
  );
  stem.position.y = 0.7; stem.castShadow = true; g.add(stem);
  
  // 葉子
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.06, 0.08, 0.05, 0.2);
  leafShape.quadraticCurveTo(0, 0.26, -0.05, 0.2);
  leafShape.quadraticCurveTo(-0.06, 0.08, 0, 0);
  const leafG = new THREE.ShapeGeometry(leafShape);
  const leafM = new THREE.MeshStandardMaterial({ color: 0x5a6b4a, roughness: 0.7, side: THREE.DoubleSide });
  
  [[1.1, 0, 0.3, 1.1], [1.15, 0.7, 0.25, 1.0], [1.05, 1.4, 0.35, 0.95],
   [1.2, 2.1, 0.2, 1.05], [1.08, 2.8, 0.4, 0.9], [1.18, 3.5, 0.15, 1.0]].forEach(([y, a, t, s]) => {
    const leaf = new THREE.Mesh(leafG, leafM);
    leaf.position.y = y; leaf.rotation.y = a; leaf.rotation.x = t;
    leaf.scale.setScalar(s); leaf.castShadow = true; g.add(leaf);
  });
  
  return g;
}

// 邊桌
function createSideTable() {
  const g = new THREE.Group();
  
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 24), M.lightWood);
  top.position.y = 0.48; top.castShadow = true; g.add(top);
  
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.46, 8), M.blackMetal);
  leg.position.y = 0.24; g.add(leg);
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.02, 24), M.blackMetal);
  base.position.y = 0.01; g.add(base);
  
  // 杯子
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.08, 16), M.ceramic);
  cup.position.set(0.05, 0.53, 0); cup.castShadow = true; g.add(cup);
  
  return g;
}

// 組裝客廳家具 (不含牆壁，牆壁由 apartment.js 統一處理)
export function createLivingRoom(offsetX = 0, offsetZ = 0) {
  if (!M) M = getMaterials();
  const g = new THREE.Group();
  const H = APARTMENT.height;
  
  // 家具配置 (根據平面圖)
  // 沙發面向電視牆 (Z負方向)
  const sofa = createSofa(); 
  sofa.position.set(0, 0, 1.0);
  sofa.rotation.y = Math.PI;  // 旋轉180度，面向電視
  g.add(sofa);
  
  const table = createCoffeeTable(); 
  table.position.set(0, 0, 0); 
  g.add(table);
  
  const rug = createRug(); 
  rug.position.z = 0.5; 
  g.add(rug);
  
  // 電視櫃靠後牆
  const tvWall = createTVWall(); 
  tvWall.position.set(0, 0, -2.15); 
  g.add(tvWall);
  
  // 落地窗在左牆
  const win = createWindow();
  win.position.set(-2.72, H/2 - 0.15, 0);
  win.rotation.y = Math.PI/2; 
  g.add(win);
  
  // 植物在角落
  const plant = createPlant(); 
  plant.position.set(-2.2, 0, -1.9); 
  g.add(plant);
  
  // 邊桌在沙發旁
  const sideTable = createSideTable(); 
  sideTable.position.set(1.8, 0, 1.2); 
  g.add(sideTable);
  
  g.position.set(offsetX, 0, offsetZ);
  return g;
}
