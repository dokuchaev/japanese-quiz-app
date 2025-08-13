import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ElegantSplashScreen({ onAnimationComplete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const drawAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Последовательность анимаций
    Animated.sequence([
      // Появление символа
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Пауза
      Animated.delay(400),
      // Вырисовывание символа хираганы
      Animated.timing(drawAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Пауза
      Animated.delay(600),
      // Разворот символа
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Пауза
      Animated.delay(400),
      // Появление текста
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Финальная пауза
      Animated.delay(1000),
      // Исчезновение
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  // Символы для анимации
  const hiraganaSymbol = 'あ';
  const katakanaSymbol = 'ア';

  // Анимация разворота
  const flipRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Анимация прозрачности для смены символов
  const hiraganaOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const katakanaOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  // Анимация вырисовывания через масштаб
  const drawScale = drawAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.containerDark
    ]}>
      {/* Основной символ с анимацией */}
      <Animated.View
        style={[
          styles.symbolContainer,
          {
            transform: [
              { scale: scaleAnim },
              { rotateY: flipRotation },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Символ хираганы */}
        <Animated.Text 
          style={[
            styles.symbol,
            theme === 'dark' && styles.symbolDark,
            {
              opacity: hiraganaOpacity,
              transform: [{ scale: drawScale }],
            },
          ]}
        >
          {hiraganaSymbol}
        </Animated.Text>
        
        {/* Символ катаканы (зеркально отраженный) */}
        <Animated.Text 
          style={[
            styles.symbol,
            theme === 'dark' && styles.symbolDark,
            {
              opacity: katakanaOpacity,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              textAlign: 'center',
              textAlignVertical: 'center',
              // Зеркальное отражение для правильного отображения после разворота
              transform: [{ scaleX: -1 }],
            },
          ]}
        >
          {katakanaSymbol}
        </Animated.Text>
      </Animated.View>

      {/* Текст приложения */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textAnim,
            transform: [
              {
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[
          styles.appTitle,
          theme === 'dark' && styles.appTitleDark
        ]}>
          日本語クイズ
        </Text>
        <Text style={[
          styles.appSubtitle,
          theme === 'dark' && styles.appSubtitleDark
        ]}>
          Изучайте японский язык
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  symbolContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
    marginBottom: 60,
    // Включаем 3D трансформации для разворота
    backfaceVisibility: 'hidden',
  },
  symbol: {
    fontSize: 90,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  symbolDark: {
    color: '#60a5fa',
  },
  textContainer: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  appTitleDark: {
    color: '#f9fafb',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  appSubtitleDark: {
    color: '#d1d5db',
  },
});
