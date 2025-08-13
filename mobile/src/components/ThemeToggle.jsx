import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ThemeContext } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
      <Pressable 
        style={[styles.button, theme === 'dark' && styles.buttonDark]} 
        onPress={toggleTheme}
      >
        <Text style={[styles.icon, theme === 'dark' && styles.iconDark]}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Убираем абсолютное позиционирование
  },
  containerDark: {
    // Темная тема для контейнера
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  buttonDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    fontSize: 16,
  },
  iconDark: {
    // Стили для темной темы
  },
});
