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
    : 'Не сдавайся! Всё обязательно получится 💪';
  const accentColor = shouldShowConfetti ? '#10b981' : '#f43f5e';
  const softBgColor = shouldShowConfetti
    ? 'rgba(16, 185, 129, 0.14)'
    : 'rgba(244, 63, 94, 0.14)';
  const softBorderColor = shouldShowConfetti
    ? 'rgba(16, 185, 129, 0.45)'
    : 'rgba(244, 63, 94, 0.45)';
  const softShadowColor = shouldShowConfetti
    ? 'rgba(16, 185, 129, 0.45)'
    : 'rgba(244, 63, 94, 0.45)';

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: softBgColor,
            borderColor: softBorderColor,
            shadowColor: softShadowColor,
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
  // Квадратная карточка с тенью
  card: {
    width: 280,
    height: 280,
    padding: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 10,
  },
  gifImage: {
    width: 180,
    height: 180,
    marginBottom: 12,
  },
  message: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  scoreText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
  },
});

