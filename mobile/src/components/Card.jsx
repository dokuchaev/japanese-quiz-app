import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';


export default function Card({ children, style }) {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.card,
      theme === 'dark' && styles.cardDark,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
  },
});
