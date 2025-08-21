// Менеджер статистики с использованием React Native MMKV
// Очень быстрый и надежный вариант для сохранения данных

import { MMKV } from 'react-native-mmkv';

// Создаем экземпляр MMKV
const storage = new MMKV();

// Ключи для хранения
const STORAGE_KEYS = {
  USER_STATS: 'user_stats',
  SYMBOL_STATS: 'symbol_stats', 
  DAILY_STATS: 'daily_stats',
};

// Инициализация статистики по умолчанию
const getDefaultStats = () => ({
  totalTests: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  totalTime: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastTestDate: null,
  quizStats: {},
});

// Безопасная работа с MMKV
const safeMMKV = {
  getItem: (key) => {
    try {
      if (!storage.contains(key)) {
        return null;
      }
      const value = storage.getString(key);
      return value;
    } catch (error) {
      console.error('Error in safeMMKV.getItem:', error);
      return null;
    }
  },
  
  setItem: (key, value) => {
    try {
      storage.set(key, value);
      return true;
    } catch (error) {
      console.error('Error in safeMMKV.setItem:', error);
      return false;
    }
  },
  
  deleteItem: (key) => {
    try {
      storage.delete(key);
      return true;
    } catch (error) {
      console.error('Error in safeMMKV.deleteItem:', error);
      return false;
    }
  }
};

// Загрузка статистики
export const loadStats = async () => {
  try {
    const storedStats = safeMMKV.getItem(STORAGE_KEYS.USER_STATS);
    if (storedStats) {
      const parsedStats = JSON.parse(storedStats);
      if (parsedStats && typeof parsedStats === 'object') {
        return { ...getDefaultStats(), ...parsedStats };
      }
    }
    return getDefaultStats();
  } catch (error) {
    console.error('Error loading stats:', error);
    return getDefaultStats();
  }
};

// Сохранение статистики
export const saveStats = async (stats) => {
  try {
    if (stats === null || stats === undefined) {
      console.warn('Attempting to save null/undefined stats');
      return;
    }
    
    const success = safeMMKV.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    if (success) {
      console.log('Stats saved to MMKV');
    } else {
      console.error('Failed to save stats to MMKV');
    }
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

// Обновление статистики после теста
export const updateStatsAfterTest = async (testResults) => {
  try {
    if (!testResults) {
      console.warn('Invalid test results');
      return null;
    }
    
    const currentStats = await loadStats();
    const updatedStats = calculateNewStats(currentStats, testResults);
    await saveStats(updatedStats);
    return updatedStats;
  } catch (error) {
    console.error('Error updating stats:', error);
    return null;
  }
};

// Получение статистики по символам
export const getSymbolStats = async () => {
  try {
    const storedStats = safeMMKV.getItem(STORAGE_KEYS.SYMBOL_STATS);
    if (storedStats) {
      const parsedStats = JSON.parse(storedStats);
      if (parsedStats && typeof parsedStats === 'object') {
        return parsedStats;
      }
    }
    return {};
  } catch (error) {
    console.error('Error loading symbol stats:', error);
    return {};
  }
};

// Сохранение статистики по символам
const saveSymbolStats = async (symbolStats) => {
  try {
    const success = safeMMKV.setItem(STORAGE_KEYS.SYMBOL_STATS, JSON.stringify(symbolStats));
    if (!success) {
      console.error('Failed to save symbol stats to MMKV');
    }
  } catch (error) {
    console.error('Error saving symbol stats:', error);
  }
};

// Обновление статистики по символам
export const updateSymbolStats = async (symbol, isCorrect) => {
  try {
    if (!symbol) {
      console.warn('Invalid symbol');
      return null;
    }
    
    const symbolStats = await getSymbolStats();
    
    if (!symbolStats[symbol]) {
      symbolStats[symbol] = {
        correct: 0,
        incorrect: 0,
        lastSeen: new Date().toISOString(),
        streak: 0,
        bestStreak: 0,
      };
    }

    const symbolStat = symbolStats[symbol];
    
    if (isCorrect) {
      symbolStat.correct += 1;
      symbolStat.streak += 1;
      if (symbolStat.streak > symbolStat.bestStreak) {
        symbolStat.bestStreak = symbolStat.streak;
      }
    } else {
      symbolStat.incorrect += 1;
      symbolStat.streak = 0;
    }

    symbolStat.lastSeen = new Date().toISOString();
    
    await saveSymbolStats(symbolStats);
    return symbolStats;
  } catch (error) {
    console.error('Error updating symbol stats:', error);
    return null;
  }
};

// Очистка всей статистики
export const clearAllStats = async () => {
  try {
    safeMMKV.deleteItem(STORAGE_KEYS.USER_STATS);
    safeMMKV.deleteItem(STORAGE_KEYS.SYMBOL_STATS);
    safeMMKV.deleteItem(STORAGE_KEYS.DAILY_STATS);
    
    console.log('All stats cleared from MMKV');
  } catch (error) {
    console.error('Error clearing stats:', error);
  }
};

// Получение статистики за день
export const getDailyStats = async (date = new Date()) => {
  try {
    const dateKey = date.toISOString().split('T')[0];
    const storedDailyStats = safeMMKV.getItem(STORAGE_KEYS.DAILY_STATS);
    
    if (storedDailyStats) {
      const dailyStats = JSON.parse(storedDailyStats);
      if (dailyStats && typeof dailyStats === 'object') {
        return dailyStats[dateKey] || {
          tests: 0,
          correct: 0,
          incorrect: 0,
          time: 0,
          accuracy: 0,
        };
      }
    }
    
    return {
      tests: 0,
      correct: 0,
      incorrect: 0,
      time: 0,
      accuracy: 0,
    };
  } catch (error) {
    console.error('Error loading daily stats:', error);
    return {
      tests: 0,
      correct: 0,
      incorrect: 0,
      time: 0,
      accuracy: 0,
    };
  }
};

// Сохранение дневной статистики
const saveDailyStats = async (dailyStats) => {
  try {
    const success = safeMMKV.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(dailyStats));
    if (!success) {
      console.error('Failed to save daily stats to MMKV');
    }
  } catch (error) {
    console.error('Error saving daily stats:', error);
  }
};

// Обновление дневной статистики
export const updateDailyStats = async (testResults) => {
  try {
    if (!testResults) {
      console.warn('Invalid test results');
      return null;
    }
    
    const dateKey = new Date().toISOString().split('T')[0];
    const storedDailyStats = safeMMKV.getItem(STORAGE_KEYS.DAILY_STATS);
    const dailyStats = storedDailyStats ? JSON.parse(storedDailyStats) : {};
    
    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = {
        tests: 0,
        correct: 0,
        incorrect: 0,
        time: 0,
        accuracy: 0,
      };
    }

    const dayStats = dailyStats[dateKey];
    dayStats.tests += 1;
    dayStats.correct += testResults.correct;
    dayStats.incorrect += testResults.incorrect;
    dayStats.time += testResults.timeElapsed;
    dayStats.accuracy = Math.round((dayStats.correct / (dayStats.correct + dayStats.incorrect)) * 100);

    await saveDailyStats(dailyStats);
    return dailyStats;
  } catch (error) {
    console.error('Error updating daily stats:', error);
    return null;
  }
};

// Экспорт статистики
export const exportStats = async () => {
  try {
    const userStats = await loadStats();
    const symbolStats = await getSymbolStats();
    const storedDailyStats = safeMMKV.getItem(STORAGE_KEYS.DAILY_STATS);
    const dailyStats = storedDailyStats ? JSON.parse(storedDailyStats) : {};
    
    const exportData = {
      userStats,
      symbolStats,
      dailyStats,
      exportDate: new Date().toISOString(),
      version: '1.0',
      storageType: 'mmkv',
    };

    console.log('Stats exported from MMKV');
    return exportData;
  } catch (error) {
    console.error('Error exporting stats:', error);
    return null;
  }
};

// Импорт статистики
export const importStats = async (importData) => {
  try {
    if (importData.userStats) {
      await saveStats(importData.userStats);
    }
    if (importData.symbolStats) {
      await saveSymbolStats(importData.symbolStats);
    }
    if (importData.dailyStats) {
      await saveDailyStats(importData.dailyStats);
    }
    console.log('Stats imported to MMKV');
    return true;
  } catch (error) {
    console.error('Error importing stats:', error);
    return false;
  }
};

// Вспомогательные функции
const calculateNewStats = (currentStats, testResults) => {
  const {
    correct,
    incorrect,
    timeElapsed,
    quizType,
    accuracy,
  } = testResults;

  const newStats = {
    ...currentStats,
    totalTests: currentStats.totalTests + 1,
    totalCorrect: currentStats.totalCorrect + correct,
    totalIncorrect: currentStats.totalIncorrect + incorrect,
    totalTime: currentStats.totalTime + timeElapsed,
    lastTestDate: new Date().toISOString(),
  };

  if (quizType) {
    if (!newStats.quizStats[quizType]) {
      newStats.quizStats[quizType] = {
        tests: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
      };
    }

    const quizStat = newStats.quizStats[quizType];
    quizStat.tests += 1;
    quizStat.correct += correct;
    quizStat.incorrect += incorrect;
    quizStat.accuracy = Math.round((quizStat.correct / (quizStat.correct + quizStat.incorrect)) * 100);
  }

  const newStreak = calculateStreak(currentStats.lastTestDate, currentStats.currentStreak);
  newStats.currentStreak = newStreak;
  if (newStreak > currentStats.bestStreak) {
    newStats.bestStreak = newStreak;
  }

  return newStats;
};

const calculateStreak = (lastTestDate, currentStreak = 0) => {
  if (!lastTestDate) return 1;

  const lastDate = new Date(lastTestDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastDate.toDateString() === yesterday.toDateString()) {
    return currentStreak + 1;
  } else if (lastDate.toDateString() === today.toDateString()) {
    return currentStreak;
  } else {
    return 1;
  }
};


