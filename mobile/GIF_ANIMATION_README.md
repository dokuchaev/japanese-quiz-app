# GIF Анимация после прохождения теста

## Описание

Мы заменили старую анимацию эмоций на новую GIF анимацию, которая проигрывается после завершения теста.

## Компоненты

### 1. GifEmotionAnimation
Основной компонент, который использует существующие GIF файлы из папки `assets/strokes/` для анимации написания символов.

**Особенности:**
- Автоматически выбирает GIF в зависимости от результата теста
- Анимация появления и исчезновения
- Цветовая схема в зависимости от результата
- Отображение процента правильных ответов

### 2. CustomGifAnimation
Компонент для использования вашего собственного GIF файла.

**Параметры:**
- `customGifSource` - путь к вашему GIF файлу
- `customMessage` - кастомное сообщение (опционально)

## Как использовать

### Вариант 1: С существующими GIF файлами
```jsx
import GifEmotionAnimation from '../components/GifEmotionAnimation';

// В QuizScreen.jsx уже заменено
<GifEmotionAnimation
  result={percentage}
  onAnimationComplete={() => {
    hideEmotionAnimation();
    setState(prev => ({ ...prev, showResults: true }));
  }}
/>
```

### Вариант 2: С вашим GIF файлом
1. Поместите ваш GIF файл в папку `mobile/assets/` (например, `mobile/assets/custom-animation.gif`)

2. Замените импорт в `QuizScreen.jsx`:
```jsx
import CustomGifAnimation from '../components/CustomGifAnimation';
```

3. Замените использование компонента:
```jsx
<CustomGifAnimation
  result={percentage}
  onAnimationComplete={() => {
    hideEmotionAnimation();
    setState(prev => ({ ...prev, showResults: true }));
  }}
  customGifSource={require('../assets/custom-animation.gif')}
  customMessage="Поздравляем! 🎊" // опционально
/>
```

## Настройка времени анимации

Время проигрывания GIF можно настроить в компонентах, изменив значение в `Animated.delay()`:

```jsx
// Пауза для проигрывания GIF (в миллисекундах)
Animated.delay(4000), // 4 секунды
```

## Цветовые схемы

- **90%+ (Отлично)**: Зеленый (#10b981)
- **70-89% (Хорошо)**: Оранжевый (#f59e0b)  
- **50-69% (Неплохо)**: Фиолетовый (#8b5cf6)
- **<50% (Попробуйте еще раз)**: Красный (#ef4444)

## Структура файлов

```
mobile/src/components/
├── GifEmotionAnimation.jsx      # Основной компонент с существующими GIF
├── CustomGifAnimation.jsx       # Компонент для пользовательского GIF
└── EmotionAnimation.jsx         # Старый компонент (можно удалить)

mobile/assets/
├── strokes/                     # Существующие GIF файлы
│   ├── hiragana/
│   └── katakana/
└── custom-animation.gif        # Ваш GIF файл (если используете)
```

## Примечания

- GIF файлы должны быть оптимизированы для мобильных устройств
- Рекомендуемый размер: 200x200 - 300x300 пикселей
- Формат: GIF с прозрачным фоном для лучшего отображения
- Время анимации можно настроить под длительность вашего GIF




