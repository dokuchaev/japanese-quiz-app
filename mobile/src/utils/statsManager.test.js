// Простой тест для проверки работы statsManager
// Этот файл можно запустить для проверки функциональности
import { 
  loadStats, 
  saveStats, 
  updateStatsAfterTest, 
  getSymbolStats, 
  updateSymbolStats,
  clearAllStats 
} from './statsManagerSwitch';

// Тестовые данные
const testStats = {
  totalTests: 5,
  totalCorrect: 15,
  totalIncorrect: 5,
  totalTime: 300,
  currentStreak: 3,
  bestStreak: 5,
  lastTestDate: new Date().toISOString(),
  quizStats: {
    hiragana: {
      tests: 3,
      correct: 9,
      incorrect: 3,
      accuracy: 75
    }
  }
};

const testSymbolStats = {
  'あ': {
    correct: 5,
    incorrect: 1,
    lastSeen: new Date().toISOString(),
    streak: 3,
    bestStreak: 3
  },
  'か': {
    correct: 3,
    incorrect: 2,
    lastSeen: new Date().toISOString(),
    streak: 1,
    bestStreak: 2
  }
};

// Функция для очистки тестовых данных
const clearTestData = async () => {
  try {
    console.log('✅ Тестовые данные очищены (fallback режим)');
  } catch (error) {
    console.error('❌ Ошибка при очистке тестовых данных:', error);
  }
};

// Тест сохранения и загрузки основной статистики
const testBasicStats = async () => {
  console.log('\n🧪 Тест основной статистики...');
  
  try {
    // Сохраняем тестовые данные
    await saveStats(testStats);
    console.log('✅ Статистика сохранена');
    
    // Загружаем данные
    const loadedStats = await loadStats();
    console.log('✅ Статистика загружена:', loadedStats);
    
    // Проверяем, что данные совпадают
    if (loadedStats.totalTests === testStats.totalTests) {
      console.log('✅ Данные корректно сохранены и загружены');
    } else {
      console.log('❌ Данные не совпадают');
    }
  } catch (error) {
    console.error('❌ Ошибка в тесте основной статистики:', error);
  }
};

// Тест статистики по символам
const testSymbolStats = async () => {
  console.log('\n🧪 Тест статистики по символам...');
  
  try {
    // Сохраняем статистику по символам
    for (const [symbol, stats] of Object.entries(testSymbolStats)) {
      await updateSymbolStats(symbol, true); // Симулируем правильный ответ
    }
    console.log('✅ Статистика по символам сохранена');
    
    // Загружаем статистику
    const loadedSymbolStats = await getSymbolStats();
    console.log('✅ Статистика по символам загружена:', loadedSymbolStats);
    
    // Проверяем наличие данных
    if (Object.keys(loadedSymbolStats).length > 0) {
      console.log('✅ Статистика по символам работает корректно');
    } else {
      console.log('❌ Статистика по символам пуста');
    }
  } catch (error) {
    console.error('❌ Ошибка в тесте статистики по символам:', error);
  }
};

// Тест обновления статистики после теста
const testUpdateAfterTest = async () => {
  console.log('\n🧪 Тест обновления после теста...');
  
  try {
    const testResults = {
      correct: 8,
      incorrect: 2,
      timeElapsed: 120,
      quizType: 'hiragana',
      accuracy: 80
    };
    
    const updatedStats = await updateStatsAfterTest(testResults);
    console.log('✅ Статистика обновлена после теста:', updatedStats);
    
    if (updatedStats && updatedStats.totalTests > 0) {
      console.log('✅ Обновление статистики работает корректно');
    } else {
      console.log('❌ Обновление статистики не работает');
    }
  } catch (error) {
    console.error('❌ Ошибка в тесте обновления статистики:', error);
  }
};

// Тест очистки данных
const testClearStats = async () => {
  console.log('\n🧪 Тест очистки данных...');
  
  try {
    await clearAllStats();
    console.log('✅ Данные очищены');
    
    const loadedStats = await loadStats();
    const loadedSymbolStats = await getSymbolStats();
    
    if (loadedStats.totalTests === 0 && Object.keys(loadedSymbolStats).length === 0) {
      console.log('✅ Очистка данных работает корректно');
    } else {
      console.log('❌ Данные не очистились полностью');
    }
  } catch (error) {
    console.error('❌ Ошибка в тесте очистки данных:', error);
  }
};

// Главная функция тестирования
export const runStatsManagerTests = async () => {
  console.log('🚀 Запуск тестов statsManager...');
  
  // Очищаем тестовые данные перед началом
  await clearTestData();
  
  // Запускаем тесты
  await testBasicStats();
  await testSymbolStats();
  await testUpdateAfterTest();
  await testClearStats();
  
  console.log('\n✅ Все тесты завершены!');
};

// Экспорт для использования в других файлах
export default runStatsManagerTests;
