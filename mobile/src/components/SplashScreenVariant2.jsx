import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SplashScreenVariant2({ onAnimationComplete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Последовательность анимаций
    Animated.sequence([
      // Появление с эффектом пульсации
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Пульсация
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Пауза
      Animated.delay(300),
      // Начало морфинга
      Animated.parallel([
        // Основной морфинг
        Animated.timing(morphAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Цветовая анимация
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Свечение
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        // Рябь
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Искры
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      // Пауза после морфинга
      Animated.delay(600),
      // Появление текста
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Финальная пауза
      Animated.delay(1200),
      // Исчезновение
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  // Символы для морфинга (более плавная последовательность)
  const symbols = [
    'あ', 'ア', 'い', 'イ', 'う', 'ウ', 'え', 'エ', 'お', 'オ',
    'か', 'カ', 'き', 'キ', 'く', 'ク', 'け', 'ケ', 'こ', 'コ'
  ];

  // Создаем рябь
  const ripples = Array.from({ length: 5 }, (_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.ripple,
        {
          borderColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
          transform: [
            {
              scale: rippleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 3 + i * 0.5],
              }),
            },
          ],
          opacity: rippleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 0],
          }),
        },
      ]}
    />
  ));

  // Создаем искры
  const sparkles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 22.5) * Math.PI / 180;
    const distance = 60 + Math.random() * 30;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    return (
      <Animated.View
        key={i}
        style={[
          styles.sparkle,
          {
            backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf'][i % 8],
            transform: [
              {
                translateX: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, x],
                }),
              },
              {
                translateY: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, y],
                }),
              },
              {
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0, 1.5, 1, 0],
                }),
              },
            ],
            opacity: sparkleAnim.interpolate({
              inputRange: [0, 0.2, 0.8, 1],
              outputRange: [0, 1, 1, 0],
            }),
          },
        ]}
      />
    );
  });

  // Текущий символ на основе анимации
  const currentSymbolIndex = Math.floor(morphAnim._value * (symbols.length - 1));
  const currentSymbol = symbols[currentSymbolIndex] || symbols[0];

  // Цветовая анимация
  const symbolColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#2563eb', '#8b5cf6', '#10b981'],
  });

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.containerDark
    ]}>
      {/* Рябь */}
      <View style={styles.rippleContainer}>
        {ripples}
      </View>

      {/* Основной символ с морфингом */}
      <Animated.View
        style={[
          styles.symbolContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            shadowColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.8],
            }),
            shadowRadius: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 40],
            }),
            elevation: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 20],
            }),
          },
        ]}
      >
        <Animated.Text style={[
          styles.symbol,
          {
            color: symbolColor,
          },
        ]}>
          {currentSymbol}
        </Animated.Text>
      </Animated.View>

      {/* Искры */}
      <View style={styles.sparkleContainer}>
        {sparkles}
      </View>

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
                  outputRange: [50, 0],
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

      {/* Дополнительные декоративные элементы */}
      <View style={styles.decorativeContainer}>
        {Array.from({ length: 10 }, (_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.decorativeDot,
              {
                backgroundColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
                opacity: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8],
                }),
                transform: [
                  {
                    scale: opacityAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
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
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    zIndex: 10,
  },
  symbol: {
    fontSize: 90,
    fontWeight: 'bold',
  },
  rippleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  ripple: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  sparkle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: '50%',
    left: '50%',
    marginLeft: -2,
    marginTop: -2,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 100,
    zIndex: 20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  appTitleDark: {
    color: '#f9fafb',
  },
  appSubtitle: {
    fontSize: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
  appSubtitleDark: {
    color: '#d1d5db',
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1,
  },
  decorativeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
  },
});





