import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

const ResultAnimation = ({ result, onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isExcellent = result >= 80;
  const isGood = result >= 60;

  // Определяем какой GIF показывать сразу
  const getGifSource = () => {
    if (isExcellent) {
      return require('../../assets/wired-flat-1103-confetti-hover-pinch.gif');
    } else if (!isGood) {
      return require('../../assets/sad.gif');
    }
    return null;
  };

  const gifSource = getGifSource();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.resultContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.gifContainer}>
          {gifSource ? (
            <Image
              key="result-gif"
              source={gifSource}
              style={styles.resultGif}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.resultEmoji}>
              {isExcellent ? '🎉' : isGood ? '👍' : '😔'}
            </Text>
          )}
        </View>
        <Text style={styles.resultText}>
          {isExcellent ? 'Отлично!' : isGood ? 'Хорошо!' : 'Попробуйте еще раз!'}
        </Text>
        <Text style={styles.resultScore}>
          {result}%
        </Text>

        {/* Дополнительные эффекты для хороших результатов */}
        {isGood && !isExcellent && (
          <View style={styles.goodEffects}>
            <Text style={styles.goodEmoji}>✨</Text>
            <Text style={styles.goodText}>Продолжайте в том же духе!</Text>
          </View>
        )}

        {/* Мотивация для плохих результатов */}
        {!isGood && (
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationEmoji}>がんばって!</Text>
            <Text style={styles.motivationText}>Не сдавайся! Каждая ошибка - это шаг к успеху!</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '85%',
    maxWidth: 400,
  },
  gifContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultGif: {
    width: '100%',
    height: '100%',
  },
  resultEmoji: {
    fontSize: 100,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 15,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
  goodEffects: {
    alignItems: 'center',
    marginTop: 20,
  },
  goodEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  goodText: {
    fontSize: 18,
    color: '#1f2937',
    textAlign: 'center',
  },
  motivationContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  motivationEmoji: {
    fontSize: 40,
    marginBottom: 15,
    color: '#000000',
  },
  motivationText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ResultAnimation;
