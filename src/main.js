import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { APARTMENT, CAMERA_VIEWS } from './config.js';
import { createApartmentStructure } from './apartment.js';
import { createLivingRoom } from './rooms/living.js';
import { createKitchenRoom } from './rooms/kitchen.js';
import { createMasterBedroom } from './rooms/master.js';
import { createStudyRoom } from './rooms/study.js';
import { createBathroom } from './rooms/bathroom.js';

// ===== 20坪 Japandi 公寓 3D 模型 =====
// 根據 floorplan.md 平面圖實作

// 場景設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f2ed);
scene.fog = new THREE.Fog(0xf5f2ed, 15, 30);

// 相機
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(10, 8, 12);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 3;
controls.maxDistance = 18;
controls.target.set(0, 1, 0);

// ===== 公寓佈局 =====
// 根據 floorplan.md 平面圖配置
//
// 座標系統：客廳中心為原點 (0, 0, 0)
// X軸：左負右正 | Z軸：後負前正
//
//  ┌─────────────────────────────────┐
//  │     客廳 (0,0)  │  餐廚區 (4,0) │  ← 開放連通
//  │                 │               │
//  ├─────────────────┴───────────────┤
//  │              走道               │
//  ├─────────┬─────────┬─────────────┤
//  │ 主臥室  │ 多功能室 │    衛浴    │
//  │(-1.5,-4)│ (1.5,-4) │  (4,-4)    │
//  └─────────┴─────────┴─────────────┘

const apartment = new THREE.Group();

// 1. 公寓結構 (牆壁、地板、天花板、門)
const structure = createApartmentStructure();
apartment.add(structure);

// 座標系統：
// - 客廳中心為原點 (0, 0)
// - Z軸正向為前方 (私領域在 Z > 2 的位置)
// - X軸正向為右方

// 2. 客廳家具 - 原點位置
const living = createLivingRoom(0, 0);
apartment.add(living);

// 3. 餐廚區家具 - 客廳右側，開放連通
const kitchen = createKitchenRoom(4.0, 0);
apartment.add(kitchen);

// 4. 主臥室家具 - 擴大後的主臥 (約5坪)
const master = createMasterBedroom(-0.75, 4.0);
apartment.add(master);

// 5. 工作室家具 - 縮小後的書房 (約1.5坪)
const study = createStudyRoom(2.2, 4.0);
apartment.add(study);

// 6. 衛浴家具 - 右後方
const bath = createBathroom(4.3, 4.0);
apartment.add(bath);

scene.add(apartment);

// ===== 燈光系統 =====
function setupLights() {
  // 環境光
  const ambient = new THREE.AmbientLight(0xfff8f0, 0.45);
  scene.add(ambient);
  
  // 主光源 - 模擬自然光
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
  mainLight.position.set(5, 10, 5);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 30;
  mainLight.shadow.camera.left = -15;
  mainLight.shadow.camera.right = 15;
  mainLight.shadow.camera.top = 15;
  mainLight.shadow.camera.bottom = -15;
  mainLight.shadow.bias = -0.0001;
  scene.add(mainLight);
  
  // 窗戶光
  const windowLight = new THREE.DirectionalLight(0xfff8e6, 0.7);
  windowLight.position.set(-8, 5, 0);
  windowLight.castShadow = true;
  windowLight.shadow.mapSize.width = 1024;
  windowLight.shadow.mapSize.height = 1024;
  scene.add(windowLight);
  
  // 半球光
  const hemi = new THREE.HemisphereLight(0xfff8f0, 0xd4c4b0, 0.35);
  scene.add(hemi);
}

setupLights();

// ===== 視角切換功能 =====
let currentView = 'overview';
let isAnimating = false;

function switchView(viewName) {
  const view = CAMERA_VIEWS[viewName];
  if (!view || isAnimating) return;
  
  currentView = viewName;
  isAnimating = true;
  
  const targetPos = new THREE.Vector3(...view.pos);
  const targetLook = new THREE.Vector3(...view.target);
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  
  // 計算距離，根據距離調整動畫時間
  const distance = startPos.distanceTo(targetPos);
  const duration = Math.min(2000, Math.max(800, distance * 120));
  
  // 計算中間點（弧形路徑）- 讓相機先拉高再移動
  const midPoint = new THREE.Vector3().lerpVectors(startPos, targetPos, 0.5);
  const heightBoost = Math.max(startPos.y, targetPos.y) + distance * 0.15;
  midPoint.y = Math.max(midPoint.y, heightBoost);
  
  const startTime = Date.now();
  
  function animateCamera() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    
    // 使用更平滑的 ease-in-out 曲線
    const easeT = t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    // 二次貝茲爾曲線：起點 -> 中間點 -> 終點
    const p0 = startPos;
    const p1 = midPoint;
    const p2 = targetPos;
    
    // B(t) = (1-t)²*P0 + 2*(1-t)*t*P1 + t²*P2
    const oneMinusT = 1 - easeT;
    const posX = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * easeT * p1.x + easeT * easeT * p2.x;
    const posY = oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * easeT * p1.y + easeT * easeT * p2.y;
    const posZ = oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * easeT * p1.z + easeT * easeT * p2.z;
    
    camera.position.set(posX, posY, posZ);
    controls.target.lerpVectors(startTarget, targetLook, easeT);
    
    if (t < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      isAnimating = false;
    }
  }
  
  animateCamera();
  
  // 更新按鈕狀態
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === viewName) {
      btn.classList.add('active');
    }
  });
}

// 綁定按鈕事件
window.switchView = switchView;

// 隱藏載入畫面
setTimeout(() => {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.add('hidden');
}, 800);

// ===== 動畫循環 =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ===== 視窗調整 =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 初始視角
setTimeout(() => switchView('overview'), 100);

// ===== 手機版互動邏輯 =====
if (window.innerWidth <= 768) {
  const infoPanel = document.getElementById('info-panel');
  const infoPanelTitle = infoPanel.querySelector('h1');

  // 點擊標題切換展開/收合
  infoPanelTitle.addEventListener('click', () => {
    infoPanel.classList.toggle('expanded');
  });

  // 支援觸控手勢（向上滑展開，向下滑收合）
  let startY = 0;
  let currentY = 0;

  infoPanel.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  });

  infoPanel.addEventListener('touchmove', (e) => {
    currentY = e.touches[0].clientY;
  });

  infoPanel.addEventListener('touchend', () => {
    const deltaY = currentY - startY;

    if (deltaY > 50) {
      // 向下滑收合
      infoPanel.classList.remove('expanded');
    } else if (deltaY < -50) {
      // 向上滑展開
      infoPanel.classList.add('expanded');
    }
  });
}

// ===== Nav Bar「半露出」優化（僅手機版） =====
function optimizeNavBarScroll() {
  if (window.innerWidth > 768) return; // 僅手機版生效

  const navBar = document.getElementById('nav-bar');
  const buttons = navBar.querySelectorAll('.view-btn');

  if (buttons.length === 0) return;

  // 計算所有按鈕的總寬度（包含 gap）
  let totalWidth = 0;
  const gap = 8; // CSS 中設定的 gap

  buttons.forEach((btn, index) => {
    totalWidth += btn.offsetWidth;
    if (index < buttons.length - 1) {
      totalWidth += gap;
    }
  });

  // 取得最後一個按鈕的寬度
  const lastButtonWidth = buttons[buttons.length - 1].offsetWidth;

  // 計算需要露出的寬度（30-40%，這裡選擇 35%）
  const peekWidth = lastButtonWidth * 0.35;

  // 計算視窗寬度
  const viewportWidth = window.innerWidth;

  // 計算左側 padding（保持 16px）
  const leftPadding = 16;

  // 計算右側 padding，確保最後一個按鈕露出指定寬度
  const rightPadding = Math.max(0, viewportWidth - totalWidth - leftPadding + lastButtonWidth - peekWidth);

  // 動態設定 padding
  navBar.style.paddingLeft = `${leftPadding}px`;
  navBar.style.paddingRight = `${rightPadding}px`;
}

// 頁面載入時執行（手機版）
if (window.innerWidth <= 768) {
  // 等待 DOM 和按鈕完全載入
  setTimeout(optimizeNavBarScroll, 200);

  // 視窗大小改變時重新計算
  window.addEventListener('resize', optimizeNavBarScroll);
}
