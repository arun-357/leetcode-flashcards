// src/data/hldLoader.js
// Dynamically loads HLD (High Level Design) PNG images from src/hlds/**
// Usage: import loadHldImages from './data/hldLoader';
// const hlds = loadHldImages();

export default function loadHldImages() {
  // Vite import.meta.glob for images
  const modules = import.meta.glob('../hlds/**/*.png', { eager: true });
  const hlds = [];
  Object.entries(modules).forEach(([path, mod]) => {
    // path: '../hlds/SocialNetwork/excalidraw.png'
    const parts = path.split('/');
    const hldsIndex = parts.findIndex(p => p === 'hlds');
    if (hldsIndex === -1 || hldsIndex + 1 >= parts.length) return;
    const projectDir = parts[hldsIndex + 1];
    const fileName = parts.slice(hldsIndex + 2).join('/');
    hlds.push({
      name: projectDir,
      file: fileName,
      src: mod.default || mod,
    });
  });
  return hlds;
}
