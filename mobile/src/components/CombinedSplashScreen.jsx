import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CombinedSplashScreen({ onAnimationComplete }) {
  const { theme } = useTheme();
  const [currentVariant, setCurrentVariant] = useState(1);
  
  // Анимации для первого варианта
  const scaleAnim1 = useRef(new Animated.Value(0)).current;
  const opacityAnim1 = useRef(new Animated.Value(0)).current;
  const morphAnim1 = useRef(new Animated.Value(0)).current;
  const glowAnim1 = useRef(new Animated.Value(0)).current;
  const textAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;

  // Анимации для второго варианта
  const scaleAnim2 = useRef(new Animated.Value(0)).current;
  const opacityAnim2 = useRef(new Animated.Value(0)).current;
  const morphAnim2 = useRef(new Animated.Value(0)).current;
  const glowAnim2 = useRef(new Animated.Value(0)).current;
  const textAnim2 = useRef(new Animated.Value(0)).current;
  const rippleAnim2 = useRef(new Animated.Value(0)).current;
  const sparkleAnim2 = useRef(new Animated.Value(0)).current;
  const colorAnim2 = useRef(new Animated.Value(0)).current;

  // Анимация перехода между вариантами
  const transitionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentVariant === 1) {
      playFirstVariant();
    } else {
      playSecondVariant();
    }
  }, [currentVariant]);

  const playFirstVariant = () => {
    // Последовательность анимаций для первого варианта
    Animated.sequence([
      // Появление основного символа
      Animated.parallel([
        Animated.spring(scaleAnim1, {
          toValue: 1.1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim1, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Отскок обратно
      Animated.spring(scaleAnim1, {
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
        Animated.timing(morphAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        // Вращение во время морфинга
        Animated.sequence([
          Animated.timing(waveAnim1, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        // Свечение
        Animated.sequence([
          Animated.timing(glowAnim1, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim1, {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
        // Частицы
        Animated.timing(particleAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      // Пауза после морфинга
      Animated.delay(500),
      // Появление текста
      Animated.timing(textAnim1, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Финальная пауза
      Animated.delay(800),
      // Переход ко второму варианту
      Animated.timing(transitionAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Сбрасываем анимации первого варианта
      scaleAnim1.setValue(0);
      opacityAnim1.setValue(0);
      morphAnim1.setValue(0);
      glowAnim1.setValue(0);
      textAnim1.setValue(0);
      waveAnim1.setValue(0);
      particleAnim1.setValue(0);
      
      // Переключаемся на второй вариант
      setCurrentVariant(2);
    });
  };

  const playSecondVariant = () => {
    // Сбрасываем transition анимацию
    transitionAnim.setValue(0);
    
    // Последовательность анимаций для второго варианта
    Animated.sequence([
      // Появление с эффектом пульсации
      Animated.parallel([
        Animated.spring(scaleAnim2, {
          toValue: 1.2,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim2, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Пульсация
      Animated.sequence([
        Animated.timing(scaleAnim2, {
          toValue: 0.9,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim2, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim2, {
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
        Animated.timing(morphAnim2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Цветовая анимация
        Animated.timing(colorAnim2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Свечение
        Animated.sequence([
          Animated.timing(glowAnim2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        // Рябь
        Animated.timing(rippleAnim2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        // Искры
        Animated.timing(sparkleAnim2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      // Пауза после морфинга
      Animated.delay(600),
      // Появление текста
      Animated.timing(textAnim2, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Финальная пауза
      Animated.delay(1200),
      // Исчезновение
      Animated.parallel([
        Animated.timing(scaleAnim2, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim2, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim2, {
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
  };

  // Символы для первого варианта
  const symbols1 = ['あ', 'ア', 'か', 'カ', 'さ', 'サ', 'た', 'タ', 'な', 'ナ'];
  
  // Символы для второго варианта
  const symbols2 = [
    'あ', 'ア', 'い', 'イ', 'う', 'ウ', 'え', 'エ', 'お', 'オ',
    'か', 'カ', 'き', 'キ', 'く', 'ク', 'け', 'ケ', 'こ', 'コ'
  ];

  // Частицы для первого варианта
  const particles1 = Array.from({ length: 12 }, (_, i) => {
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
                translateX: particleAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, x],
                }),
              },
              {
                translateY: particleAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, y],
                }),
              },
              {
                scale: particleAnim1.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1.2, 0],
                }),
              },
            ],
            opacity: particleAnim1.interpolate({
              inputRange: [0, 0.3, 0.8, 1],
              outputRange: [0, 1, 1, 0],
            }),
          },
        ]}
      />
    );
  });

  // Волновые кольца для первого варианта
  const waveRings1 = Array.from({ length: 3 }, (_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.waveRing,
        {
          borderColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
          transform: [
            {
              scale: waveAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 2 + i * 0.5],
              }),
            },
          ],
          opacity: waveAnim1.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 0],
          }),
        },
      ]}
    />
  ));

  // Рябь для второго варианта
  const ripples2 = Array.from({ length: 5 }, (_, i) => (
    <Animated.View
      key={i}
      style={[
        styles.ripple,
        {
          borderColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
          transform: [
            {
              scale: rippleAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 3 + i * 0.5],
              }),
            },
          ],
          opacity: rippleAnim2.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 0],
          }),
        },
      ]}
    />
  ));

  // Искры для второго варианта
  const sparkles2 = Array.from({ length: 16 }, (_, i) => {
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
                translateX: sparkleAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, x],
                }),
              },
              {
                translateY: sparkleAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, y],
                }),
              },
              {
                scale: sparkleAnim2.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0, 1.5, 1, 0],
                }),
              },
            ],
            opacity: sparkleAnim2.interpolate({
              inputRange: [0, 0.2, 0.8, 1],
              outputRange: [0, 1, 1, 0],
            }),
          },
        ]}
      />
    );
  });

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.containerDark
    ]}>
      {/* Первый вариант */}
      <Animated.View
        style={[
          styles.variantContainer,
          {
            opacity: transitionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            transform: [
              {
                scale: transitionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.8],
                }),
              },
            ],
          },
        ]}
      >
        {/* Волновые кольца */}
        <View style={styles.waveContainer}>
          {waveRings1}
        </View>

        {/* Основной символ с морфингом */}
        <Animated.View
          style={[
            styles.symbolContainer,
            {
              transform: [
                { scale: scaleAnim1 },
              ],
              opacity: opacityAnim1,
              shadowColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: glowAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.9],
              }),
              shadowRadius: glowAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 50],
              }),
              elevation: glowAnim1.interpolate({
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
            {symbols1[Math.floor(morphAnim1._value * (symbols1.length - 1))]}
          </Text>
        </Animated.View>

        {/* Частицы */}
        <View style={styles.particleContainer}>
          {particles1}
        </View>

        {/* Текст приложения */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textAnim1,
              transform: [
                {
                  translateY: textAnim1.interpolate({
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
      </Animated.View>

      {/* Второй вариант */}
      <Animated.View
        style={[
          styles.variantContainer,
          {
            opacity: transitionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [
              {
                scale: transitionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        {/* Рябь */}
        <View style={styles.rippleContainer}>
          {ripples2}
        </View>

        {/* Основной символ с морфингом */}
        <Animated.View
          style={[
            styles.symbolContainer2,
            {
              transform: [{ scale: scaleAnim2 }],
              opacity: opacityAnim2,
              shadowColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: glowAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.8],
              }),
              shadowRadius: glowAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 40],
              }),
              elevation: glowAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 20],
              }),
            },
          ]}
        >
          <Animated.Text style={[
            styles.symbol2,
            {
              color: colorAnim2.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['#2563eb', '#8b5cf6', '#10b981'],
              }),
            },
          ]}>
            {symbols2[Math.floor(morphAnim2._value * (symbols2.length - 1))]}
          </Animated.Text>
        </Animated.View>

        {/* Искры */}
        <View style={styles.sparkleContainer}>
          {sparkles2}
        </View>

        {/* Текст приложения */}
        <Animated.View
          style={[
            styles.textContainer2,
            {
              opacity: textAnim2,
              transform: [
                {
                  translateY: textAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[
            styles.appTitle2,
            theme === 'dark' && styles.appTitleDark
          ]}>
            日本語クイズ
          </Text>
          <Text style={[
            styles.appSubtitle2,
            theme === 'dark' && styles.appSubtitleDark
          ]}>
            Изучайте японский язык
          </Text>
        </Animated.View>
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
  variantContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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
  symbolContainer2: {
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
    fontSize: 100,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  symbol2: {
    fontSize: 90,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    top: '50%',
    left: '50%',
    marginLeft: -5,
    marginTop: -5,
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
    marginTop: 80,
    zIndex: 20,
  },
  textContainer2: {
    alignItems: 'center',
    marginTop: 100,
    zIndex: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  appTitle2: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  appTitleDark: {
    color: '#f9fafb',
  },
  appSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  appSubtitle2: {
    fontSize: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
  appSubtitleDark: {
    color: '#d1d5db',
  },
});





