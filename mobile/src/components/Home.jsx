import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        theme === 'dark' && styles.titleDark
      ]}>
        Выберите тест для тренировки
      </Text>
      <Text style={[
        styles.subtitle,
        theme === 'dark' && styles.subtitleDark
      ]}>
        Выберите тест, чтобы начать изучение японского языка.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  titleDark: {
    color: '#f9fafb',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 24,
  },
  subtitleDark: {
    color: '#9ca3af',
  },
});
