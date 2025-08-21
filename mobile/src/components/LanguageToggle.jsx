import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

export default function LanguageToggle() {
  const { theme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const label = language === 'ru' ? 'EN' : 'RU';

  return (
    <View>
      <Pressable 
        style={[styles.button, theme === 'dark' && styles.buttonDark]} 
        onPress={toggleLanguage}
        accessibilityLabel={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 4,
  },
  buttonDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
  },
});



