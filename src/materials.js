import * as THREE from 'three';
import { COLORS } from './config.js';

// ===== 程序化紋理生成 =====

// 淺橡木地板紋理
export function createOakFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  // 基底色
  ctx.fillStyle = '#d4c4a8';
  ctx.fillRect(0, 0, 512, 512);
  
  // 木紋
  for (let i = 0; i < 50; i++) {
    ctx.strokeStyle = `rgba(180, 160, 130, ${Math.random() * 0.1})`;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    const y = Math.random() * 512;
    for (let x = 0; x < 512; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.015) * 3);
    }
    ctx.stroke();
  }
  
  // 木板接縫
  ctx.strokeStyle = 'rgba(160, 140, 110, 0.12)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 亞麻布料紋理
export function createLinenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#e8e0d5';
  ctx.fillRect(0, 0, 128, 128);
  
  // 編織紋理
  ctx.strokeStyle = 'rgba(200, 190, 175, 0.1)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 128; i += 2) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(128, i); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 128); ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 灰泥牆面紋理
export function createPlasterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f0ebe3';
  ctx.fillRect(0, 0, 256, 256);
  
  // 細微質感
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = `rgba(200, 190, 175, ${Math.random() * 0.03})`;
    ctx.fillRect(x, y, 1, 1);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 榻榻米紋理
export function createTatamiTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#c9b896';
  ctx.fillRect(0, 0, 256, 256);
  
  // 編織線條
  ctx.strokeStyle = 'rgba(160, 140, 100, 0.15)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 256; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  
  // 邊框
  ctx.strokeStyle = 'rgba(80, 60, 40, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 252, 252);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 石材磚紋理
export function createStoneTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#d8d0c4';
  ctx.fillRect(0, 0, 256, 256);
  
  // 細微紋理
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = `rgba(180, 170, 155, ${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  
  // 磚縫
  ctx.strokeStyle = 'rgba(150, 140, 125, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 252, 252);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// ===== 材質定義 =====
let materialsCache = null;

export function getMaterials() {
  if (materialsCache) return materialsCache;
  
  const oakTex = createOakFloorTexture();
  const linenTex = createLinenTexture();
  const plasterTex = createPlasterTexture();
  const tatamiTex = createTatamiTexture();
  const stoneTex = createStoneTileTexture();
  
  materialsCache = {
    // 地板
    floor: new THREE.MeshStandardMaterial({ 
      map: oakTex, color: COLORS.lightOak, roughness: 0.75 
    }),
    
    // 牆面
    wall: new THREE.MeshStandardMaterial({ 
      map: plasterTex, color: COLORS.creamyWhite, roughness: 0.95 
    }),
    
    // 天花板
    ceiling: new THREE.MeshStandardMaterial({ 
      color: COLORS.pureWhite, roughness: 0.95 
    }),
    
    // 沙發布料
    sofaFabric: new THREE.MeshStandardMaterial({ 
      map: linenTex, color: COLORS.beigeLight, roughness: 0.9 
    }),
    
    // 靠墊
    cushion: new THREE.MeshStandardMaterial({ 
      color: COLORS.beigeMedium, roughness: 0.92 
    }),
    
    // 淺木質
    lightWood: new THREE.MeshStandardMaterial({ 
      color: COLORS.lightOak, roughness: 0.6 
    }),
    
    // 深木質
    darkWood: new THREE.MeshStandardMaterial({ 
      color: COLORS.walnut, roughness: 0.5 
    }),
    
    // 黑色金屬
    blackMetal: new THREE.MeshStandardMaterial({ 
      color: COLORS.softBlack, roughness: 0.4, metalness: 0.6 
    }),
    
    // 霧面黑
    matteBlack: new THREE.MeshStandardMaterial({ 
      color: COLORS.matteBlack, roughness: 0.8, metalness: 0.2 
    }),
    
    // 黃銅
    brass: new THREE.MeshStandardMaterial({ 
      color: COLORS.brass, roughness: 0.3, metalness: 0.7 
    }),
    
    // 陶器
    ceramic: new THREE.MeshStandardMaterial({ 
      color: COLORS.ceramic, roughness: 0.4 
    }),
    
    // 赤陶
    terracotta: new THREE.MeshStandardMaterial({ 
      color: COLORS.terracotta, roughness: 0.7 
    }),
    
    // 玻璃
    glass: new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff, roughness: 0.05, transmission: 0.95, thickness: 0.3 
    }),
    
    // 磨砂玻璃 (障子門效果)
    frostedGlass: new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff, roughness: 0.3, transmission: 0.7, thickness: 0.1 
    }),
    
    // 亞麻窗簾
    sheerLinen: new THREE.MeshStandardMaterial({ 
      color: COLORS.linenWhite, roughness: 0.95, 
      side: THREE.DoubleSide, transparent: true, opacity: 0.55 
    }),
    
    // 植物
    plant: new THREE.MeshStandardMaterial({ 
      color: COLORS.mossGreen, roughness: 0.8 
    }),
    
    // 榻榻米
    tatami: new THREE.MeshStandardMaterial({ 
      map: tatamiTex, color: COLORS.bamboo, roughness: 0.9 
    }),
    
    // 石材磚
    stoneTile: new THREE.MeshStandardMaterial({ 
      map: stoneTex, color: COLORS.stone, roughness: 0.4 
    }),
    
    // 白色廚具
    whiteKitchen: new THREE.MeshStandardMaterial({ 
      color: 0xffffff, roughness: 0.3, metalness: 0.1 
    }),
    
    // 亞麻寢具
    linenBedding: new THREE.MeshStandardMaterial({ 
      map: linenTex, color: COLORS.beigeLight, roughness: 0.95 
    }),
    
    // 抱枕色彩
    pillowWarm: new THREE.MeshStandardMaterial({ color: 0xc9a88a, roughness: 0.9 }),
    pillowCool: new THREE.MeshStandardMaterial({ color: 0xa8b8a8, roughness: 0.9 }),
    pillowTerra: new THREE.MeshStandardMaterial({ color: COLORS.terracotta, roughness: 0.9 }),
  };
  
  return materialsCache;
}
