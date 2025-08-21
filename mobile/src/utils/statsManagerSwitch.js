// Переключатель между версиями statsManager
// Выберите один из вариантов хранения данных

const USE_FALLBACK = false; // true = память, false = MMKV
const USE_SECURESTORE = false; // true = SecureStore, false = MMKV
const USE_MMKV = false; // true = MMKV (рекомендуется)
const USE_FILESYSTEM = true; // true = File System (простой)

let statsManager;

if (USE_MMKV) {
  console.log('⚡ Using MMKV stats manager');
  statsManager = require('./statsManagerMMKV');
} else if (USE_FILESYSTEM) {
  console.log('📁 Using File System stats manager');
  statsManager = require('./statsManagerFile');
} else if (USE_SECURESTORE) {
  console.log('🔐 Using SecureStore stats manager');
  statsManager = require('./statsManagerSecure');
} else if (USE_FALLBACK) {
  console.log('📱 Using pure JavaScript memory stats manager');
  statsManager = require('./statsManagerPure');
} else {
  console.log('💾 Using safe AsyncStorage stats manager');
  statsManager = require('./statsManagerSafe');
}

export const {
  loadStats,
  saveStats,
  updateStatsAfterTest,
  getSymbolStats,
  updateSymbolStats,
  clearAllStats,
  getDailyStats,
  updateDailyStats,
  exportStats,
  importStats,
} = statsManager;

// Экспортируем информацию о текущем режиме
export const getStorageMode = () => {
  if (USE_MMKV) return 'mmkv';
  if (USE_FILESYSTEM) return 'filesystem';
  if (USE_SECURESTORE) return 'securestore';
  if (USE_FALLBACK) return 'memory';
  return 'asyncstorage';
};

export const isFallbackMode = () => USE_FALLBACK;
export const isSecureStoreMode = () => USE_SECURESTORE;
export const isMMKVMode = () => USE_MMKV;
export const isFileSystemMode = () => USE_FILESYSTEM;
