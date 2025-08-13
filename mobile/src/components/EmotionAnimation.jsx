import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function EmotionAnimation({ result, onAnimationComplete }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Начинаем анимацию
    Animated.sequence([
      // Появление с эффектом отскока
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
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
      // Пауза для восприятия
      Animated.delay(500),
      // Анимация эмоции с множественными эффектами
      Animated.parallel([
        // Конфетти и вращение
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        // Вращение с покачиванием
        Animated.sequence([
          Animated.timing(rotationAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Покачивание
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Свечение
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Финальная пауза
      Animated.delay(800),
      // Исчезновение с эффектом
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);

  const getEmotionData = () => {
    if (result >= 90) {
      return {
        emoji: '🎉',
        message: 'Отлично!',
        color: '#10b981',
        confetti: true,
        glowColor: '#10b981',
      };
    } else if (result >= 70) {
      return {
        emoji: '😊',
        message: 'Хорошо!',
        color: '#f59e0b',
        confetti: false,
        glowColor: '#f59e0b',
      };
    } else if (result >= 50) {
      return {
        emoji: '😐',
        message: 'Неплохо',
        color: '#8b5cf6',
        confetti: false,
        glowColor: '#8b5cf6',
      };
    } else {
      return {
        emoji: '😔',
        message: 'Попробуйте еще раз',
        color: '#ef4444',
        confetti: false,
        glowColor: '#ef4444',
      };
    }
  };

  const emotionData = getEmotionData();

  const confettiPieces = Array.from({ length: 20 }, (_, i) => {
    const angle = (i * 18) * Math.PI / 180;
    const distance = 120 + Math.random() * 40;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    return (
      <Animated.View
        key={i}
        style={[
          styles.confettiPiece,
          {
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#ff8b94'][i % 8],
            transform: [
              {
                translateX: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, x],
                }),
              },
              {
                translateY: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, y],
                }),
              },
              {
                rotate: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${720 + Math.random() * 360}deg`],
                }),
              },
              {
                scale: confettiAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1.2, 0],
                }),
              },
            ],
            opacity: confettiAnim.interpolate({
              inputRange: [0, 0.3, 0.8, 1],
              outputRange: [0, 1, 1, 0],
            }),
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      {/* Основная эмоция */}
      <Animated.View
        style={[
          styles.emotionContainer,
          {
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-5deg', '5deg'],
                }),
              },
              {
                translateY: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
            opacity: opacityAnim,
            shadowColor: emotionData.glowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
            shadowRadius: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 40],
            }),
            elevation: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 20],
            }),
          },
        ]}
      >
        <Text style={[styles.emoji, { color: emotionData.color }]}>
          {emotionData.emoji}
        </Text>
        <Text style={[
          styles.message,
          theme === 'dark' && styles.messageDark
        ]}>
          {emotionData.message}
        </Text>
      </Animated.View>

      {/* Конфетти для отличных результатов */}
      {emotionData.confetti && (
        <View style={styles.confettiContainer}>
          {confettiPieces}
        </View>
      )}

      {/* Дополнительные эмоции для разных результатов */}
      {result < 90 && result >= 70 && (
        <Animated.View
          style={[
            styles.secondaryEmotion,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.secondaryEmoji}>💪</Text>
        </Animated.View>
      )}

      {result < 70 && result >= 50 && (
        <Animated.View
          style={[
            styles.secondaryEmotion,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.secondaryEmoji}>🤔</Text>
        </Animated.View>
      )}

      {result < 50 && (
        <Animated.View
          style={[
            styles.secondaryEmotion,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim },
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.secondaryEmoji}>📚</Text>
        </Animated.View>
      )}
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
  emotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emoji: {
    fontSize: 100,
    marginBottom: 15,
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  messageDark: {
    color: '#f9fafb',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: '50%',
    left: '50%',
    marginLeft: -5,
    marginTop: -5,
  },
  secondaryEmotion: {
    position: 'absolute',
    top: '65%',
    right: '25%',
  },
  secondaryEmoji: {
    fontSize: 50,
  },
});
