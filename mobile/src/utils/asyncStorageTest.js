// Тест AsyncStorage для проверки работоспособности

import AsyncStorage from '@react-native-async-storage/async-storage';

// Простой тест AsyncStorage
export const testAsyncStorage = async () => {
  console.log('🧪 Тестирование AsyncStorage...');
  
  try {
    // Проверяем доступность
    if (!AsyncStorage) {
      console.error('❌ AsyncStorage is null');
      return { success: false, error: 'AsyncStorage is null' };
    }

    if (typeof AsyncStorage.setItem !== 'function') {
      console.error('❌ AsyncStorage.setItem is not a function');
      return { success: false, error: 'AsyncStorage.setItem is not a function' };
    }

    if (typeof AsyncStorage.getItem !== 'function') {
      console.error('❌ AsyncStorage.getItem is not a function');
      return { success: false, error: 'AsyncStorage.getItem is not a function' };
    }

    // Тестируем запись
    const testKey = 'test_async_storage';
    const testValue = 'test_value_' + Date.now();
    
    console.log('📝 Тестируем запись...');
    await AsyncStorage.setItem(testKey, testValue);
    console.log('✅ Запись успешна');

    // Тестируем чтение
    console.log('📖 Тестируем чтение...');
    const readValue = await AsyncStorage.getItem(testKey);
    console.log('✅ Чтение успешно');

    // Проверяем значение
    if (readValue === testValue) {
      console.log('✅ Значение совпадает');
    } else {
      console.error('❌ Значение не совпадает');
      return { success: false, error: 'Value mismatch' };
    }

    // Тестируем удаление
    console.log('🗑️ Тестируем удаление...');
    await AsyncStorage.removeItem(testKey);
    console.log('✅ Удаление успешно');

    // Проверяем, что значение удалено
    const deletedValue = await AsyncStorage.getItem(testKey);
    if (deletedValue === null) {
      console.log('✅ Значение успешно удалено');
    } else {
      console.error('❌ Значение не удалено');
      return { success: false, error: 'Value not deleted' };
    }

    console.log('🎉 AsyncStorage работает корректно!');
    return { success: true };

  } catch (error) {
    console.error('❌ Ошибка тестирования AsyncStorage:', error);
    return { success: false, error: error.message };
  }
};

// Тест с реальными данными статистики
export const testStatsStorage = async () => {
  console.log('📊 Тестирование хранения статистики...');
  
  try {
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

    // Сохраняем тестовую статистику
    const statsKey = 'test_user_stats';
    const statsJson = JSON.stringify(testStats);
    
    console.log('💾 Сохраняем тестовую статистику...');
    await AsyncStorage.setItem(statsKey, statsJson);
    console.log('✅ Статистика сохранена');

    // Читаем статистику
    console.log('📖 Читаем статистику...');
    const readStatsJson = await AsyncStorage.getItem(statsKey);
    const readStats = JSON.parse(readStatsJson);
    console.log('✅ Статистика прочитана');

    // Проверяем данные
    if (readStats.totalTests === testStats.totalTests) {
      console.log('✅ Данные статистики корректны');
    } else {
      console.error('❌ Данные статистики не совпадают');
      return { success: false, error: 'Stats data mismatch' };
    }

    // Очищаем тестовые данные
    await AsyncStorage.removeItem(statsKey);
    console.log('✅ Тестовые данные очищены');

    console.log('🎉 Хранение статистики работает корректно!');
    return { success: true };

  } catch (error) {
    console.error('❌ Ошибка тестирования хранения статистики:', error);
    return { success: false, error: error.message };
  }
};

// Полный тест
export const runFullAsyncStorageTest = async () => {
  console.log('🚀 Запуск полного теста AsyncStorage...');
  
  const basicTest = await testAsyncStorage();
  if (!basicTest.success) {
    return basicTest;
  }

  const statsTest = await testStatsStorage();
  if (!statsTest.success) {
    return statsTest;
  }

  console.log('🎉 Все тесты AsyncStorage пройдены успешно!');
  return { success: true };
};

export default runFullAsyncStorageTest;


