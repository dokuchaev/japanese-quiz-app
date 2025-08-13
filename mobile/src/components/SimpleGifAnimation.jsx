import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

export default function SimpleGifAnimation({ result, onAnimationComplete }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Показываем анимацию только при отличном результате (90%+)
    if (result >= 90) {
      Animated.sequence([
        // Появление
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
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
        // Пауза для показа анимации
        Animated.delay(3000),
        // Исчезновение
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
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
    } else {
      // Если результат не отличный, сразу завершаем
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  }, [result]);

  // Показываем анимацию только при отличном результате
  if (result < 90) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animationContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Ваш GIF файл с конфетти */}
        <Image
          source={require('../../assets/wired-flat-1103-confetti-hover-pinch.gif')}
          style={styles.gifImage}
          resizeMode="contain"
        />
        <Text style={styles.message}>Отлично!</Text>
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
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
});
