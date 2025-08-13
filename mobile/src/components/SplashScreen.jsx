import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SplashScreen({ onAnimationComplete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Последовательность анимаций
    Animated.sequence([
      // Появление основного символа
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
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
      // Отскок обратно
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Пауза
      Animated.delay(300),
      // Начало морфинга
      Animated.parallel([
        // Основной морфинг
        Animated.timing(morphAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        // Вращение во время морфинга
        Animated.sequence([
          Animated.timing(rotationAnim, {
            toValue: 0.5,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
        // Волновой эффект
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        // Свечение
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
        // Частицы
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      // Пауза после морфинга
      Animated.delay(500),
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

  // Символы для морфинга
  const symbols = ['あ', 'ア', 'か', 'カ', 'さ', 'サ', 'た', 'タ', 'な', 'ナ'];
  const currentSymbolIndex = Math.floor(morphAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, symbols.length - 1],
  }));

  // Создаем частицы для эффекта
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30) * Math.PI / 180;
    const distance = 80 + Math.random() * 40;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    return (
      <Animated.View
        key={i}
        style={[
          styles.particle,
          {
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][i % 6],
            transform: [
              {
                translateX: particleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, x],
                }),
              },
              {
                translateY: particleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, y],
                }),
              },
              {
                scale: particleAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1.2, 0],
                }),
              },
              {
                rotate: particleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
                }),
              },
            ],
            opacity: particleAnim.interpolate({
              inputRange: [0, 0.3, 0.8, 1],
              outputRange: [0, 1, 1, 0],
            }),
          },
        ]}
      />
    );
  });

  // Волновые кольца
  const waveRings = Array.from({ length: 3 }, (_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.waveRing,
        {
          borderColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
          transform: [
            {
              scale: waveAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 2 + i * 0.5],
              }),
            },
          ],
          opacity: waveAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 0],
          }),
        },
      ]}
    />
  ));

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.containerDark
    ]}>
      {/* Волновые кольца */}
      <View style={styles.waveContainer}>
        {waveRings}
      </View>

      {/* Основной символ с морфингом */}
      <Animated.View
        style={[
          styles.symbolContainer,
          {
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
            opacity: opacityAnim,
            shadowColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.9],
            }),
            shadowRadius: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 50],
            }),
            elevation: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 25],
            }),
          },
        ]}
      >
        <Text style={[
          styles.symbol,
          theme === 'dark' && styles.symbolDark
        ]}>
          {symbols[Math.floor(morphAnim._value * (symbols.length - 1))]}
        </Text>
      </Animated.View>

      {/* Частицы */}
      <View style={styles.particleContainer}>
        {particles}
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
                  outputRange: [40, 0],
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
        {Array.from({ length: 8 }, (_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.decorativeDot,
              {
                backgroundColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
                opacity: opacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.7],
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
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(37, 99, 235, 0.3)',
    zIndex: 10,
  },
  symbol: {
    fontSize: 100,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  symbolDark: {
    color: '#60a5fa',
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  waveRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    top: '50%',
    left: '50%',
    marginLeft: -3,
    marginTop: -3,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 80,
    zIndex: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  appTitleDark: {
    color: '#f9fafb',
  },
  appSubtitle: {
    fontSize: 18,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
});
