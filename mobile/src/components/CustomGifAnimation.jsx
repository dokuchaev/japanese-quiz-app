import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useTheme } from './ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CustomGifAnimation({ 
  result, 
  onAnimationComplete, 
  customGifSource, // Путь к вашему GIF файлу
  customMessage = null // Кастомное сообщение
}) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
      // Пауза для проигрывания GIF
      Animated.delay(4000), // Увеличиваем время для вашего GIF
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
        message: customMessage || 'Отлично! 🎉',
        color: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      };
    } else if (result >= 70) {
      return {
        message: customMessage || 'Хорошо! 😊',
        color: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      };
    } else if (result >= 50) {
      return {
        message: customMessage || 'Неплохо 🤔',
        color: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
      };
    } else {
      return {
        message: customMessage || 'Попробуйте еще раз 📚',
        color: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      };
    }
  };

  const emotionData = getEmotionData();

  return (
    <View style={styles.container}>
      {/* Основная GIF анимация */}
      <Animated.View
        style={[
          styles.gifContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            backgroundColor: emotionData.backgroundColor,
            borderColor: emotionData.color,
          },
        ]}
      >
        <View style={styles.gifWrapper}>
          <Image
            source={customGifSource}
            style={styles.gifImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[
          styles.message,
          theme === 'dark' && styles.messageDark,
          { color: emotionData.color }
        ]}>
          {emotionData.message}
        </Text>
        <Text style={[
          styles.scoreText,
          theme === 'dark' && styles.scoreTextDark
        ]}>
          {result}% правильных ответов
        </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  gifContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 3,
    minWidth: 300,
    minHeight: 350,
  },
  gifWrapper: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  messageDark: {
    color: '#f9fafb',
  },
  scoreText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  scoreTextDark: {
    color: '#9ca3af',
  },
});




