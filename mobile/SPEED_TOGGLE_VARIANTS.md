# Варианты расположения переключателя скорости

## Вариант 1: Заголовок по центру + переключатель на всю ширину (ТЕКУЩИЙ)
```jsx
{/* Заголовок по центру */}
<Text style={[styles.title, theme === 'dark' && styles.titleDark]}>
  Тест по {isInputQuiz ? getInputQuizTitle() : getQuizTitle()}
</Text>

{/* Переключатель режима скорости на всю ширину */}
<View style={[styles.fullWidthSpeedToggle, theme === 'dark' && styles.fullWidthSpeedToggleDark]}>
  <View style={styles.speedInfo}>
    <Text style={[styles.speedIcon, theme === 'dark' && styles.speedIconDark]}>
      ⚡
    </Text>
    <View style={styles.speedTextContainer}>
      <Text style={[styles.speedLabel, theme === 'dark' && styles.speedLabelDark]}>
        Режим скорости
      </Text>
      <Text style={[styles.speedDescription, theme === 'dark' && styles.speedDescriptionDark]}>
        {isInputQuiz ? '5 секунд на ответ' : '3 секунды на ответ'}
      </Text>
    </View>
  </View>
  <Switch
    value={speedMode}
    onValueChange={setSpeedMode}
    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
    thumbColor={speedMode ? '#ffffff' : '#ffffff'}
  />
</View>

{/* Переключатели режимов тестирования */}
<View style={[styles.testModeToggle, theme === 'dark' && styles.testModeToggleDark]}>
  <View style={styles.testModeInfo}>
    <Text style={[styles.testModeIcon, theme === 'dark' && styles.testModeIconDark]}>
      🎲
    </Text>
    <View style={styles.testModeTextContainer}>
      <Text style={[styles.testModeLabel, theme === 'dark' && styles.testModeLabelDark]}>
        {isNumbersQuiz ? 'От 1 до 10' : '15 случайных символов'}
      </Text>
      <Text style={[styles.testModeDescription, theme === 'dark' && styles.testModeDescriptionDark]}>
        {isNumbersQuiz ? 'Простые числа' : 'Быстрый тест'}
      </Text>
    </View>
  </View>
  <Switch
    value={randomMode}
    onValueChange={handleRandomMode}
    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
    thumbColor={randomMode ? '#ffffff' : '#ffffff'}
  />
</View>

<View style={[styles.testModeToggle, theme === 'dark' && styles.testModeToggleDark]}>
  <View style={styles.testModeInfo}>
    <Text style={[styles.testModeIcon, theme === 'dark' && styles.testModeIconDark]}>
      📚
    </Text>
    <View style={styles.testModeTextContainer}>
      <Text style={[styles.testModeLabel, theme === 'dark' && styles.testModeLabelDark]}>
        {isNumbersQuiz ? 'От 10 до 100' : 'Все символы'}
      </Text>
      <Text style={[styles.testModeDescription, theme === 'dark' && styles.testModeDescriptionDark]}>
        {isNumbersQuiz ? 'Сложные числа' : 'Полный тест'}
      </Text>
    </View>
  </View>
  <Switch
    value={allSymbolsMode}
    onValueChange={handleAllSymbolsMode}
    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
    thumbColor={allSymbolsMode ? '#ffffff' : '#ffffff'}
  />
</View>

{/* Одна кнопка "Начать тест" */}
<Pressable 
  style={[styles.startTestButton, theme === 'dark' && styles.startTestButtonDark]} 
  onPress={startTestWithOptions}
>
  <Text style={styles.startTestButtonText}>
    🚀 Начать тест
  </Text>
</Pressable>
```

**Плюсы:**
- Заголовок по центру выглядит красиво и сбалансированно
- Переключатели на всю ширину - понятные и заметные
- Консистентный дизайн всех элементов
- Взаимоисключающие переключатели предотвращают ошибки
- Одна кнопка вместо множества - упрощает интерфейс
- Логичная структура: заголовок → настройки → кнопки

**Минусы:**
- Занимает больше вертикального пространства

---

## Вариант 1.5: Компактный переключатель в заголовке (ПРЕДЫДУЩИЙ)
```jsx
<View style={styles.headerWithSpeedToggle}>
  <Text style={[styles.title, theme === 'dark' && styles.titleDark]}>
    Тест по {isInputQuiz ? getInputQuizTitle() : getQuizTitle()}
  </Text>
  <View style={[styles.compactSpeedToggle, theme === 'dark' && styles.compactSpeedToggleDark]}>
    <View style={styles.speedInfo}>
      <Text style={[styles.speedLabel, theme === 'dark' && styles.speedLabelDark]}>
        ⚡ Режим скорости
      </Text>
      <Text style={[styles.speedDescription, theme === 'dark' && styles.speedDescriptionDark]}>
        {isInputQuiz ? '5 секунд на ответ' : '3 секунды на ответ'}
      </Text>
    </View>
    <Switch
      value={speedMode}
      onValueChange={setSpeedMode}
      trackColor={{ false: '#e5e7eb', true: '#10b981' }}
      thumbColor={speedMode ? '#ffffff' : '#ffffff'}
      style={styles.smallSwitch}
    />
  </View>
</View>
```

**Плюсы:**
- Компактный, но информативный
- Показывает время на ответ
- Экономит вертикальное пространство

**Минусы:**
- Может быть тесновато на маленьких экранах
- Заголовок и переключатель в одной строке

---

## Вариант 2: Подробный переключатель
```jsx
<View style={[styles.detailedSpeedToggle, theme === 'dark' && styles.detailedSpeedToggleDark]}>
  <View style={styles.speedHeader}>
    <Text style={[styles.speedTitle, theme === 'dark' && styles.speedTitleDark]}>
      ⚡ Режим скорости
    </Text>
    <Switch
      value={speedMode}
      onValueChange={setSpeedMode}
      trackColor={{ false: '#e5e7eb', true: '#10b981' }}
      thumbColor={speedMode ? '#ffffff' : '#ffffff'}
    />
  </View>
  <Text style={[styles.speedExplanation, theme === 'dark' && styles.speedExplanationDark]}>
    {speedMode 
      ? `Включен: ${isInputQuiz ? '5 секунд' : '3 секунды'} на каждый ответ`
      : `Выключен: неограниченное время на ответ`
    }
  </Text>
</View>
```

**Плюсы:**
- Максимально информативный
- Показывает текущее состояние
- Объясняет что происходит

**Минусы:**
- Занимает больше места
- Может быть избыточным для опытных пользователей

---

## Вариант 3: Иконка в правом верхнем углу
```jsx
<View style={styles.speedIconContainer}>
  <Pressable 
    style={[styles.speedIconButton, speedMode && styles.speedIconButtonActive, theme === 'dark' && styles.speedIconButtonDark]} 
    onPress={() => setSpeedMode(!speedMode)}
  >
    <Text style={[styles.speedIcon, speedMode && styles.speedIconActive, theme === 'dark' && styles.speedIconDark]}>
      ⚡
    </Text>
  </Pressable>
</View>
```

**Плюсы:**
- Минималистичный, не мешает основному контенту
- Занимает минимум места
- Современный дизайн

**Минусы:**
- Может быть неочевидным для пользователей
- Нужно добавить подсказку или тултип

---

## Вариант 4: Кнопка рядом с кнопками тестирования
```jsx
<Pressable 
  style={[styles.speedButton, speedMode && styles.speedButtonActive, theme === 'dark' && styles.speedButtonDark]} 
  onPress={() => setSpeedMode(!speedMode)}
>
  <Text style={[styles.speedButtonText, speedMode && styles.speedButtonTextActive, theme === 'dark' && styles.speedButtonTextDark]}>
    {speedMode ? '⚡ Режим скорости ВКЛ' : '⚡ Режим скорости ВЫКЛ'} ({isInputQuiz ? '5с' : '3с'})
  </Text>
</Pressable>
```

**Плюсы:**
- Очевидный и понятный
- Логично расположен рядом с кнопками тестирования
- Четко показывает состояние

**Минусы:**
- Занимает дополнительную строку
- Может быть избыточным

---

## Вариант 5: Оригинальный большой переключатель
```jsx
<View style={[styles.speedModeContainer, theme === 'dark' && styles.speedModeContainerDark]}>
  <View style={styles.speedModeContent}>
    <View style={styles.speedModeTextContainer}>
      <Text style={[styles.speedModeTitle, theme === 'dark' && styles.speedModeTitleDark]}>
        Режим скорости ({isInputQuiz ? '5с' : '3с'})
      </Text>
    </View>
    <Switch
      value={speedMode}
      onValueChange={setSpeedMode}
      trackColor={{ false: '#e5e7eb', true: '#10b981' }}
      thumbColor={speedMode ? '#ffffff' : '#ffffff'}
    />
  </View>
</View>
```

**Плюсы:**
- Самый заметный и понятный
- Четко объясняет функциональность
- Хорошо подходит для новых пользователей

**Минусы:**
- Занимает много места
- Может выглядеть громоздко

---

## Как переключиться между вариантами:

1. **Для Варианта 1.5**: Вернуть код headerWithSpeedToggle и compactSpeedToggle
2. **Для Варианта 2**: Раскомментировать код detailedSpeedToggle
3. **Для Варианта 3**: Раскомментировать код иконки
4. **Для Варианта 4**: Раскомментировать код кнопки в секции "Тестирование"
5. **Для Варианта 5**: Вернуть оригинальный код speedModeContainer

## Рекомендации:

- **Для мобильных устройств**: Вариант 1 (заголовок по центру + переключатели на всю ширину)
- **Для новых пользователей**: Вариант 1 или 2 (наглядность)
- **Для опытных пользователей**: Вариант 3 (минимализм)
- **Для общего использования**: Вариант 1 (лучший баланс)

## Текущий выбор:
**Вариант 1** - заголовок по центру + переключатели на всю ширину + одна кнопка "Начать тест". Это решение создает консистентный, современный и интуитивно понятный интерфейс с взаимно исключающими переключателями и упрощенной навигацией.
