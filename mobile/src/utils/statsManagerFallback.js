// Fallback менеджер статистики без AsyncStorage
// Использует только in-memory storage для совместимости

// Хранение в памяти с возможностью экспорта
let memoryStorage = {
  userStats: null,
  symbolStats: {},
  dailyStats: {},
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

// Загрузка статистики из памяти
export const loadStats = async () => {
  try {
    if (memoryStorage.userStats === null) {
      memoryStorage.userStats = getDefaultStats();
    }
    console.log('Stats loaded from memory:', memoryStorage.userStats);
    return memoryStorage.userStats;
  } catch (error) {
    console.error('Error loading stats from memory:', error);
    return getDefaultStats();
  }
};

// Сохранение статистики в память
export const saveStats = async (stats) => {
  try {
    if (stats === null || stats === undefined) {
      console.warn('Attempting to save null/undefined stats');
      return;
    }
    memoryStorage.userStats = stats;
    console.log('Stats saved to memory:', stats);
  } catch (error) {
    console.error('Error saving stats to memory:', error);
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
    return memoryStorage.symbolStats || {};
  } catch (error) {
    console.error('Error loading symbol stats from memory:', error);
    return {};
  }
};

// Обновление статистики по символам
export const updateSymbolStats = async (symbol, isCorrect) => {
  try {
    if (!symbol) {
      console.warn('Invalid symbol');
      return null;
    }
    
    if (!memoryStorage.symbolStats[symbol]) {
      memoryStorage.symbolStats[symbol] = {
        correct: 0,
        incorrect: 0,
        lastSeen: new Date().toISOString(),
        streak: 0,
        bestStreak: 0,
      };
    }

    const symbolStat = memoryStorage.symbolStats[symbol];
    
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
    
    console.log('Symbol stats updated:', symbol, symbolStat);
    return memoryStorage.symbolStats;
  } catch (error) {
    console.error('Error updating symbol stats:', error);
    return null;
  }
};

// Очистка всей статистики
export const clearAllStats = async () => {
  try {
    memoryStorage = {
      userStats: null,
      symbolStats: {},
      dailyStats: {},
    };
    console.log('All stats cleared from memory');
  } catch (error) {
    console.error('Error clearing stats from memory:', error);
  }
};

// Получение статистики за день
export const getDailyStats = async (date = new Date()) => {
  try {
    const dateKey = date.toISOString().split('T')[0];
    const dailyStats = memoryStorage.dailyStats || {};
    return dailyStats[dateKey] || {
      tests: 0,
      correct: 0,
      incorrect: 0,
      time: 0,
      accuracy: 0,
    };
  } catch (error) {
    console.error('Error loading daily stats from memory:', error);
    return {
      tests: 0,
      correct: 0,
      incorrect: 0,
      time: 0,
      accuracy: 0,
    };
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
    const dailyStats = memoryStorage.dailyStats || {};
    
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

    memoryStorage.dailyStats = dailyStats;
    console.log('Daily stats updated:', dateKey, dayStats);
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
    const dailyStats = memoryStorage.dailyStats || {};
    
    const exportData = {
      userStats,
      symbolStats,
      dailyStats,
      exportDate: new Date().toISOString(),
      version: '1.0',
      storageType: 'memory',
    };

    console.log('Stats exported from memory:', exportData);
    return exportData;
  } catch (error) {
    console.error('Error exporting stats from memory:', error);
    return null;
  }
};

// Импорт статистики
export const importStats = async (importData) => {
  try {
    if (importData.userStats) {
      memoryStorage.userStats = importData.userStats;
    }
    if (importData.symbolStats) {
      memoryStorage.symbolStats = importData.symbolStats;
    }
    if (importData.dailyStats) {
      memoryStorage.dailyStats = importData.dailyStats;
    }
    console.log('Stats imported to memory:', importData);
    return true;
  } catch (error) {
    console.error('Error importing stats to memory:', error);
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

  // Обновляем общую статистику
  const newStats = {
    ...currentStats,
    totalTests: currentStats.totalTests + 1,
    totalCorrect: currentStats.totalCorrect + correct,
    totalIncorrect: currentStats.totalIncorrect + incorrect,
    totalTime: currentStats.totalTime + timeElapsed,
    lastTestDate: new Date().toISOString(),
  };

  // Обновляем статистику по типам тестов
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

  // Обновляем серию дней - исправленная логика
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

  // Если последний тест был вчера, увеличиваем серию
  if (lastDate.toDateString() === yesterday.toDateString()) {
    return currentStreak + 1;
  }
  // Если последний тест был сегодня, сохраняем текущую серию
  else if (lastDate.toDateString() === today.toDateString()) {
    return currentStreak;
  }
  // Если последний тест был раньше, сбрасываем серию
  else {
    return 1; // Начинаем новую серию
  }
};


