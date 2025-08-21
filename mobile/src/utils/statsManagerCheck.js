// Проверка работы statsManager без AsyncStorage

import { 
  loadStats, 
  saveStats, 
  updateStatsAfterTest, 
  getSymbolStats, 
  updateSymbolStats,
  clearAllStats,
  isFallbackMode 
} from './statsManagerSwitch';

// Простая проверка функциональности
export const checkStatsManager = async () => {
  console.log('🔍 Проверка statsManager...');
  
  try {
    // Проверяем режим
    const mode = isFallbackMode();
    console.log(`📱 Режим: ${mode ? 'Fallback (Память)' : 'AsyncStorage'}`);
    
    // Проверяем загрузку статистики
    const stats = await loadStats();
    console.log('✅ Загрузка статистики:', stats);
    
    // Проверяем сохранение статистики
    const testStats = {
      totalTests: 1,
      totalCorrect: 5,
      totalIncorrect: 2,
      totalTime: 120,
      currentStreak: 1,
      bestStreak: 1,
      lastTestDate: new Date().toISOString(),
      quizStats: {}
    };
    
    await saveStats(testStats);
    console.log('✅ Сохранение статистики работает');
    
    // Проверяем обновление после теста
    const testResults = {
      correct: 3,
      incorrect: 1,
      timeElapsed: 60,
      quizType: 'hiragana',
      accuracy: 75
    };
    
    const updatedStats = await updateStatsAfterTest(testResults);
    console.log('✅ Обновление статистики:', updatedStats);
    
    // Проверяем статистику по символам
    await updateSymbolStats('あ', true);
    const symbolStats = await getSymbolStats();
    console.log('✅ Статистика по символам:', symbolStats);
    
    // Проверяем очистку
    await clearAllStats();
    const clearedStats = await loadStats();
    console.log('✅ Очистка статистики:', clearedStats);
    
    console.log('🎉 Все проверки пройдены успешно!');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка в проверке statsManager:', error);
    return false;
  }
};

// Экспорт для использования в других файлах
export default checkStatsManager;



