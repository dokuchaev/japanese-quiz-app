// Безопасная инициализация AsyncStorage
// Ждет готовности runtime перед использованием AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

let isInitialized = false;
let initPromise = null;

// Проверка готовности AsyncStorage
const checkAsyncStorageReady = () => {
  try {
    return AsyncStorage && 
           typeof AsyncStorage.getItem === 'function' &&
           typeof AsyncStorage.setItem === 'function' &&
           typeof AsyncStorage.removeItem === 'function';
  } catch (error) {
    console.error('Error checking AsyncStorage readiness:', error);
    return false;
  }
};

// Ожидание готовности AsyncStorage
const waitForAsyncStorage = async (maxAttempts = 10, delay = 500) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`🔄 Попытка инициализации AsyncStorage ${attempt}/${maxAttempts}`);
    
    if (checkAsyncStorageReady()) {
      console.log('✅ AsyncStorage готов к использованию');
      return true;
    }
    
    if (attempt < maxAttempts) {
      console.log(`⏳ Ожидание ${delay}ms перед следующей попыткой...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error('❌ AsyncStorage не готов после всех попыток');
  return false;
};

// Безопасная инициализация AsyncStorage
export const initializeAsyncStorage = async () => {
  if (isInitialized) {
    return true;
  }
  
  if (initPromise) {
    return initPromise;
  }
  
  initPromise = (async () => {
    try {
      console.log('🚀 Начало инициализации AsyncStorage...');
      
      // Ждем готовности runtime
      const isReady = await waitForAsyncStorage();
      
      if (!isReady) {
        console.warn('⚠️ AsyncStorage не готов, используем fallback');
        isInitialized = false;
        return false;
      }
      
      // Тестируем AsyncStorage
      const testKey = 'init_test_' + Date.now();
      const testValue = 'test_value_' + Date.now();
      
      await AsyncStorage.setItem(testKey, testValue);
      const readValue = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);
      
      if (readValue === testValue) {
        console.log('✅ AsyncStorage инициализирован и протестирован успешно');
        isInitialized = true;
        return true;
      } else {
        console.error('❌ AsyncStorage тест не прошел');
        isInitialized = false;
        return false;
      }
      
    } catch (error) {
      console.error('❌ Ошибка инициализации AsyncStorage:', error);
      isInitialized = false;
      return false;
    }
  })();
  
  return initPromise;
};

// Проверка статуса инициализации
export const isAsyncStorageInitialized = () => {
  return isInitialized && checkAsyncStorageReady();
};

// Получение готового AsyncStorage
export const getAsyncStorage = () => {
  if (isAsyncStorageInitialized()) {
    return AsyncStorage;
  }
  return null;
};

// Сброс состояния инициализации (для тестирования)
export const resetAsyncStorageInit = () => {
  isInitialized = false;
  initPromise = null;
};


