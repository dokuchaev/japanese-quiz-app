import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

export default function ScrollToTop({ onPress, visible }) {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <Pressable
      style={[
        styles.button,
        theme === 'dark' && styles.buttonDark
      ]}
      onPress={onPress}
    >
      <Text style={styles.icon}>⬆️</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDark: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
  },
  icon: {
    fontSize: 20,
  },
});
