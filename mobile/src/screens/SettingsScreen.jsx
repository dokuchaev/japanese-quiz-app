import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
import { createTranslate } from '../components/i18n';
// AsyncStorage test removed to prevent runtime errors

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const t = createTranslate(language);

  const isDark = theme === 'dark';
  const isRu = language === 'ru';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>{t('themeLabel')}</Text>
        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>{isDark ? t('dark') : t('light')}</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
            thumbColor={'#ffffff'}
          />
        </View>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>{t('languageLabel')}</Text>
        <View style={styles.row}>
          <Text style={[styles.label, isDark && styles.labelDark]}>{isRu ? 'Русский' : 'English'}</Text>
          <Switch
            value={!isRu}
            onValueChange={toggleLanguage}
            trackColor={{ false: '#e5e7eb', true: '#10b981' }}
            thumbColor={'#ffffff'}
          />
        </View>
      </View>

      {/* Блок статистики удален по запросу */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerDark: {},
  backButton: {
    fontSize: 22,
    color: '#2563eb',
    width: 24,
  },
  backButtonDark: {
    color: '#60a5fa',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerTitleDark: {
    color: '#f9fafb',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  cardDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderColor: 'rgba(255,255,255,0.06)'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  titleDark: {
    color: '#f9fafb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  labelDark: {
    color: '#d1d5db',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDark: {
    backgroundColor: '#1d4ed8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextDark: {
    color: '#f9fafb',
  },
  clearButton: {
    backgroundColor: '#dc2626',
  },
  clearButtonDark: {
    backgroundColor: '#b91c1c',
  },
  clearButtonText: {
    color: '#fff',
  },
  debugButton: {
    backgroundColor: '#6b7280',
  },
  debugButtonDark: {
    backgroundColor: '#4b5563',
  },
  debugButtonText: {
    color: '#fff',
  },
  testButton: {
    backgroundColor: '#059669',
  },
  testButtonDark: {
    backgroundColor: '#047857',
  },
  testButtonText: {
    color: '#fff',
  },
  asyncTestButton: {
    backgroundColor: '#7c3aed',
  },
  asyncTestButtonDark: {
    backgroundColor: '#6d28d9',
  },
  asyncTestButtonText: {
    color: '#fff',
  },
  comprehensiveTestButton: {
    backgroundColor: '#ea580c',
  },
  comprehensiveTestButtonDark: {
    backgroundColor: '#c2410c',
  },
  comprehensiveTestButtonText: {
    color: '#fff',
  },
  storageInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  storageLabel: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
    fontWeight: '600',
  },
  storageLabelDark: {
    color: '#93c5fd',
  },
});


