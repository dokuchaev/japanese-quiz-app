import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MinimalistSplashScreen({ onAnimationComplete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  
  // Анимации для кота
  const catScaleAnim = useRef(new Animated.Value(0)).current;
  const catOpacityAnim = useRef(new Animated.Value(0)).current;
  const catBounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Последовательность анимаций
    Animated.sequence([
      // Появление символов хираганы
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 160,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
      // Пауза
      Animated.delay(180),
      // Появление текста "LEARNING JAPANESE"
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      // Пауза
      Animated.delay(260),
      // Появление кота с анимацией загрузки
      Animated.parallel([
        Animated.spring(catScaleAnim, {
          toValue: 1.08,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(catOpacityAnim, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
      ]),
      // Отскок кота обратно
      Animated.spring(catScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Покачивание кота во время "загрузки"
      Animated.sequence([
        Animated.timing(catBounceAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(catBounceAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(catBounceAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(catBounceAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(catBounceAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]),
      // Финальная пауза
      Animated.delay(360),
      // Исчезновение
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.94, duration: 260, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(textAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
        Animated.timing(catOpacityAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    ]).start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  // Анимация для символов (легкое покачивание)
  const symbolBounce = scaleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.1, 1],
  });

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.containerDark
    ]}>
      {/* Символы хираганы и катаканы */}
      <Animated.View
        style={[
          styles.symbolsContainer,
          {
            transform: [{ scale: symbolBounce }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={[
          styles.symbol,
          theme === 'dark' && styles.symbolDark
        ]}>
          あ
        </Text>
        <Text style={[
          styles.symbol,
          theme === 'dark' && styles.symbolDark
        ]}>
          ア
        </Text>
      </Animated.View>

      {/* Текст "LEARNING JAPANESE" */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textAnim,
            transform: [
              {
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[
          styles.learningText,
          theme === 'dark' && styles.learningTextDark
        ]}>
          LEARNING
        </Text>
        <Text style={[
          styles.learningText,
          theme === 'dark' && styles.learningTextDark
        ]}>
          JAPANESE
        </Text>
      </Animated.View>

      {/* Кот с анимацией загрузки */}
      <Animated.View
        style={[
          styles.catContainer,
          {
            transform: [
              { scale: catScaleAnim },
              {
                translateY: catBounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
            opacity: catOpacityAnim,
          },
        ]}
      >
        <Image
          source={require('../../assets/wired-flat-1957-maneki-cat-hover-pinch.gif')}
          style={styles.catAnimation}
          resizeMode="contain"
        />
        <Text style={[
          styles.loadingText,
          theme === 'dark' && styles.loadingTextDark
        ]}>
          Загружаем...
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
  symbolsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    gap: 20,
  },
  symbol: {
    fontSize: 120,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  symbolDark: {
    color: '#f9fafb',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  learningText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    letterSpacing: 2,
    marginBottom: 4,
  },
  learningTextDark: {
    color: '#f9fafb',
  },
  catContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  catAnimation: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadingTextDark: {
    color: '#d1d5db',
  },
});
