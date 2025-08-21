import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

export default function WorkingGifAnimation({ result, onAnimationComplete }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const shouldShowConfetti = result >= 90;
  const shouldShowSad = result < 50;

  useEffect(() => {
    // Показываем анимацию только для крайних случаев
    if (shouldShowConfetti || shouldShowSad) {
      // Анимация появления с отскоком
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.08,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Небольшое покачивание
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
        ]),
        // Пауза для показа GIF
        Animated.delay(1800),
        // Исчезновение
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 0.96, duration: 220, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]),
      ]).start(() => {
        onAnimationComplete && onAnimationComplete();
      });
    } else {
      // Средние результаты — сразу переходим к результатам
      onAnimationComplete && onAnimationComplete();
    }
  }, [shouldShowConfetti, shouldShowSad, onAnimationComplete, scaleAnim, opacityAnim]);

  if (!shouldShowConfetti && !shouldShowSad) {
    return null;
  }

  const gifSource = shouldShowConfetti
    ? require('../../assets/wired-flat-1103-confetti-hover-pinch.gif')
    : require('../../assets/sad.gif');
  const message = shouldShowConfetti
    ? 'Отлично! 🎉'
    : 'がんばって! Всё обязательно получится 💪';
  const accentColor = shouldShowConfetti ? '#10b981' : '#f43f5e';

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { scale: scaleAnim },
              {
                translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }),
              },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image source={gifSource} style={styles.gifImage} resizeMode="contain" />
        <Text style={[styles.message, { color: accentColor }]}>{message}</Text>
        {shouldShowConfetti && <Text style={styles.scoreText}>{result}% правильных ответов</Text>}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  // Карточка с белым фоном, размером под содержимое
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 200,
    minHeight: 200,
  },
  gifImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  scoreText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
});

