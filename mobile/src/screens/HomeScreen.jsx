import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import AnimatedView from '../components/AnimatedView';

const Tile = ({ title, subtitle, icon, onPress, theme, bgColor }) => (
  <Pressable style={[styles.tile, theme === 'dark' && styles.tileDark]} onPress={onPress}>
    <View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]} />
    <View style={styles.tileContent}>
      <Text style={[styles.tileIcon, theme === 'dark' && styles.tileIconDark]}>{icon}</Text>
      <Text style={[styles.tileTitle, theme === 'dark' && styles.tileTitleDark]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.tileSubtitle, theme === 'dark' && styles.tileSubtitleDark]}>{subtitle}</Text>
      ) : null}
    </View>
  </Pressable>
);

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  
  return (
    <ScrollView 
      style={[styles.container, theme === 'dark' && styles.containerDark]}
      contentContainerStyle={[styles.contentContainer, theme === 'dark' && styles.contentContainerDark]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero card */}
      <AnimatedView animationType="fadeIn" duration={500}>
        <View style={[styles.heroCard, theme === 'dark' && styles.heroCardDark]}>
          <Text style={[styles.heroTitle, theme === 'dark' && styles.heroTitleDark]}>こんにちは!</Text>
          <Text style={[styles.heroSubtitle, theme === 'dark' && styles.heroSubtitleDark]}>Добро пожаловать в японский квиз</Text>
          <Text style={[styles.heroDescription, theme === 'dark' && styles.heroDescriptionDark]}>Выберите режим, чтобы начать изучение каны и числительных.</Text>
        </View>
      </AnimatedView>

      {/* Primary grid */}
      <AnimatedView animationType="scaleIn" duration={700} delay={150}>
        <View style={styles.grid}>
          <Tile
            title="Хирагана"
            subtitle="Таблица и тренажёр"
            icon="あ"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#2563eb'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'hiragana' })}
          />
          <Tile
            title="Катакана"
            subtitle="Таблица и тренажёр"
            icon="シ"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#f59e0b'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'katakana' })}
          />
          <Tile
            title="Дакутэн"
            subtitle="Диакритика"
            icon="ガ"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#10b981'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'dakuten' })}
          />
          <Tile
            title="Числительные"
            subtitle="От 1 до 10 и далее"
            icon="三"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#ec4899'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'numbers' })}
          />
        </View>
      </AnimatedView>

      {/* Input grid */}
      <AnimatedView animationType="fadeIn" duration={700} delay={250}>
        <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>Практика ввода</Text>
      </AnimatedView>

      <AnimatedView animationType="scaleIn" duration={700} delay={350}>
        <View style={styles.grid}>
          <Tile
            title="Хирагана ввод"
            icon="ぬ"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#8b5cf6'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'hiraganaInput' })}
          />
          <Tile
            title="Катакана ввод"
            icon="ヌ"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#f87171'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'katakanaInput' })}
          />
          <Tile
            title="Дакутэн ввод"
            icon="ゔ"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#60a5fa'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'dakutenInput' })}
          />
          <Tile
            title="Числа ввод"
            icon="四"
            theme={theme}
            bgColor={theme === 'dark' ? '#1f2937' : '#fbbf24'}
            onPress={() => navigation.navigate('Quiz', { quiz: 'numbersInput' })}
          />
        </View>
      </AnimatedView>

      <AnimatedView animationType="fadeIn" duration={800} delay={500}>
        <Text style={[styles.footer, theme === 'dark' && styles.footerDark]}>がんばって！</Text>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  contentContainerDark: { 
    backgroundColor: 'transparent',
  },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 14,
  },
  heroCardDark: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderColor: 'rgba(255,255,255,0.06)'
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1f2937',
  },
  heroTitleDark: { color: '#f9fafb' },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
    color: '#334155',
  },
  heroSubtitleDark: { color: '#d1d5db' },
  heroDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    color: '#6b7280',
  },
  heroDescriptionDark: { color: '#9ca3af' },
  sectionTitle: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  sectionTitleDark: {
    color: '#9ca3af',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  tile: {
    position: 'relative',
    width: '48%',
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  tileDark: {
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tileContent: {
    flex: 1,
    padding: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  tileIcon: { fontSize: 22, color: 'rgba(255,255,255,0.95)' },
  tileIconDark: { color: 'rgba(255,255,255,0.95)' },
  tileTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginTop: 6 },
  tileTitleDark: { color: '#fff' },
  tileSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  tileSubtitleDark: { color: 'rgba(255,255,255,0.75)' },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 16, color: '#6b7280' },
  footerDark: { color: '#9ca3af' },
});


