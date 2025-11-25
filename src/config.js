// ===== 20坪 Japandi 公寓配置 =====
// 總面積：20坪 = 66平方公尺

export const APARTMENT = {
  // 整體尺寸 (約 11m x 6m)
  totalWidth: 11,
  totalDepth: 6,
  height: 2.7,
  
  // 各空間配置
  spaces: {
    living: { width: 5.5, depth: 4.8, name: '客廳', ping: 8 },
    kitchen: { width: 3.5, depth: 3.8, name: '餐廚區', ping: 4 },
    master: { width: 3.5, depth: 3.8, name: '主臥室', ping: 4 },
    flex: { width: 2.8, depth: 3.0, name: '多功能室', ping: 2.5 },
    bath: { width: 2.0, depth: 2.5, name: '衛浴', ping: 1.5 },
  }
};

// ===== Japandi 色彩系統 =====
export const COLORS = {
  // 淺橡木色系
  lightOak: 0xd4c4a8,
  oakGrain: 0xc9b896,
  warmOak: 0xc4b090,
  
  // 奶油白牆面
  creamyWhite: 0xfaf8f5,
  plasterWhite: 0xf0ebe3,
  pureWhite: 0xffffff,
  
  // 米色/灰褐色布料
  beigeLight: 0xe8e0d5,
  beigeMedium: 0xd4ccc0,
  beigeDark: 0xc4b8a8,
  linenWhite: 0xf5f0e8,
  
  // 日式自然色
  warmGray: 0xb8b0a4,
  softBlack: 0x3d3d3d,
  charcoal: 0x4a4a4a,
  
  // 木質深色
  walnut: 0x5a4a3a,
  darkWood: 0x4a3a2a,
  
  // 植物綠
  mossGreen: 0x5a6b4a,
  leafGreen: 0x6b7a5a,
  bamboo: 0x8a9a6a,
  
  // 陶器/石材
  ceramic: 0xe8ddd0,
  terracotta: 0xc9a88a,
  stone: 0xd8d0c4,
  
  // 金屬
  brass: 0xb8a060,
  matteBlack: 0x2a2a2a,
};

// ===== 相機預設位置 =====
// 調整為能完整顯示各空間的視角
export const CAMERA_VIEWS = {
  // 公領域 - 斜上方俯視
  living: { pos: [0, 6, 3], target: [0, 0, -0.5] },
  kitchen: { pos: [4, 5, 2], target: [4, 0, -0.5] },
  // 私領域 - 斜上方俯視，能看到完整房間
  master: { pos: [-0.75, 7, 2.5], target: [-0.75, 0, 4.5] },
  study: { pos: [2.2, 6, 2.5], target: [2.2, 0, 4.5] },
  bath: { pos: [4.3, 6, 2.5], target: [4.3, 0, 4.5] },
  // 全屋俯視
  overview: { pos: [1.5, 12, -4], target: [1.5, 0, 2] },
};
