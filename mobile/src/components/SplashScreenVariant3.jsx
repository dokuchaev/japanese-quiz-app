import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SplashScreenVariant3({ onAnimationComplete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

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
      // Морфинг символов
      Animated.timing(morphAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      // Пауза
      Animated.delay(300),
      // Появление линии
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Появление текста
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Появление точек
      Animated.timing(dotAnim, {
        toValue: 1,
        duration: 600,
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
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
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

  // Символы для морфинга (минималистичная последовательность)
  const symbols = [
    'あ', 'ア', 'か', 'カ', 'さ', 'サ', 'た', 'タ', 'な', 'ナ',
    'は', 'ハ', 'ま', 'マ', 'や', 'ヤ', 'ら', 'ラ', 'わ', 'ワ'
  ];

  // Текущий символ на основе анимации
  const currentSymbolIndex = Math.floor(morphAnim._value * (symbols.length - 1));
  const currentSymbol = symbols[currentSymbolIndex] || symbols[0];

  // Анимированная линия
  const lineWidth = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  // Анимированные точки
  const dots = Array.from({ length: 3 }, (_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.dot,
        {
          backgroundColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
          opacity: dotAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.8],
          }),
          transform: [
            {
              scale: dotAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ],
        },
      ]}
    />
  ));

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.containerDark
    ]}>
      {/* Основной символ */}
      <Animated.View
        style={[
          styles.symbolContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={[
          styles.symbol,
          theme === 'dark' && styles.symbolDark
        ]}>
          {currentSymbol}
        </Text>
      </Animated.View>

      {/* Анимированная линия */}
      <Animated.View
        style={[
          styles.line,
          {
            width: lineWidth,
            opacity: lineAnim,
          },
        ]}
      />

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

      {/* Точки */}
      <View style={styles.dotsContainer}>
        {dots}
      </View>
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
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
    marginBottom: 40,
  },
  symbol: {
    fontSize: 80,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  symbolDark: {
    color: '#60a5fa',
  },
  line: {
    height: 2,
    backgroundColor: '#2563eb',
    borderRadius: 1,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});





