// Тестирование менеджера статистики
// Проверяет все функции сохранения и загрузки данных

import { 
  loadStats, 
  saveStats, 
  updateStatsAfterTest, 
  getSymbolStats, 
  updateSymbolStats,
  clearAllStats,
  getStorageMode 
} from './statsManagerSwitch';

export const testStatsManager = async () => {
  console.log('🧪 Начинаем тестирование менеджера статистики...');
  console.log('📱 Режим хранения:', getStorageMode());
  
  try {
    // Тест 1: Очистка данных
    console.log('\n1️⃣ Очищаем данные...');
    await clearAllStats();
    
    // Тест 2: Загрузка пустой статистики
    console.log('\n2️⃣ Загружаем пустую статистику...');
    const emptyStats = await loadStats();
    console.log('Пустая статистика:', emptyStats);
    
    // Тест 3: Сохранение тестовых данных
    console.log('\n3️⃣ Сохраняем тестовые данные...');
    const testStats = {
      totalTests: 5,
      totalCorrect: 4,
      totalIncorrect: 1,
      totalTime: 120,
      currentStreak: 3,
      bestStreak: 5,
      lastTestDate: new Date().toISOString(),
      quizStats: {
        hiragana: {
          tests: 3,
          correct: 2,
          incorrect: 1,
          accuracy: 67
        }
      }
    };
    
    await saveStats(testStats);
    console.log('Тестовые данные сохранены');
    
    // Тест 4: Загрузка сохраненных данных
    console.log('\n4️⃣ Загружаем сохраненные данные...');
    const loadedStats = await loadStats();
    console.log('Загруженная статистика:', loadedStats);
    
    // Проверяем, что данные сохранились
    if (loadedStats.totalTests === testStats.totalTests) {
      console.log('✅ Данные успешно сохранились и загрузились!');
    } else {
      console.log('❌ Данные не сохранились правильно');
      return false;
    }
    
    // Тест 5: Обновление статистики после теста
    console.log('\n5️⃣ Тестируем обновление после теста...');
    const testResults = {
      correct: 2,
      incorrect: 1,
      timeElapsed: 45,
      quizType: 'katakana',
      accuracy: 67
    };
    
    const updatedStats = await updateStatsAfterTest(testResults);
    console.log('Обновленная статистика:', updatedStats);
    
    if (updatedStats && updatedStats.totalTests > loadedStats.totalTests) {
      console.log('✅ Статистика успешно обновлена!');
    } else {
      console.log('❌ Статистика не обновилась');
      return false;
    }
    
    // Тест 6: Статистика по символам
    console.log('\n6️⃣ Тестируем статистику по символам...');
    await updateSymbolStats('あ', true);
    await updateSymbolStats('あ', false);
    await updateSymbolStats('い', true);
    
    const symbolStats = await getSymbolStats();
    console.log('Статистика по символам:', symbolStats);
    
    if (symbolStats['あ'] && symbolStats['い']) {
      console.log('✅ Статистика по символам работает!');
    } else {
      console.log('❌ Статистика по символам не работает');
      return false;
    }
    
    // Тест 7: Финальная проверка
    console.log('\n7️⃣ Финальная проверка...');
    const finalStats = await loadStats();
    const finalSymbolStats = await getSymbolStats();
    
    console.log('Финальная статистика:', finalStats);
    console.log('Финальная статистика по символам:', finalSymbolStats);
    
    console.log('\n🎉 Все тесты пройдены успешно!');
    console.log('📊 Статистика сохраняется и загружается корректно');
    
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка в тестировании:', error);
    return false;
  }
};

// Экспорт для использования в других компонентах
export default testStatsManager;


