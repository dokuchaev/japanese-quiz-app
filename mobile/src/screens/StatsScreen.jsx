import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';
import { useLanguage } from '../components/LanguageContext';
import { useStats } from '../components/StatsContext';
import { createTranslate } from '../components/i18n';
import AnimatedView from '../components/AnimatedView';

const StatsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { userStats, refreshStats, isInitialized } = useStats();
  const t = createTranslate(language);

  // Обновляем статистику при фокусе экрана только если уже инициализированы
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialized) {
        refreshStats();
      }
    }, [isInitialized])
  );

  const clearStats = () => {
    Alert.alert(
      t('clearStatsTitle'),
      t('clearStatsMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Используем переключатель менеджера статистики
              const { clearAllStats } = require('../utils/statsManagerSwitch');
              await clearAllStats();
              refreshStats(); // Обновляем статистику после очистки
            } catch (error) {
              console.error('Error clearing stats:', error);
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м ${secs}с`;
    } else if (minutes > 0) {
      return `${minutes}м ${secs}с`;
    } else {
      return `${secs}с`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('noData');
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const getAccuracy = () => {
    const total = userStats.totalCorrect + userStats.totalIncorrect;
    return total > 0 ? Math.round((userStats.totalCorrect / total) * 100) : 0;
  };

  const getAverageTime = () => {
    return userStats.totalTests > 0 ? Math.round(userStats.totalTime / userStats.totalTests) : 0;
  };

  const StatCard = ({ title, value, subtitle, icon, iconSource }) => (
    <View style={[styles.statCard, theme === 'dark' && styles.statCardDark]}>
      <View style={styles.statHeader}>
        {iconSource ? (
          <Image source={iconSource} style={styles.statIconImage} />
        ) : (
          <Text style={styles.statIcon}>{icon}</Text>
        )}
        <Text style={[styles.statTitle, theme === 'dark' && styles.statTitleDark]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.statValue, theme === 'dark' && styles.statValueDark]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, theme === 'dark' && styles.statSubtitleDark]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, theme === 'dark' && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <AnimatedView animationType="fadeIn" duration={500}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image source={require('../../assets/icons/stat.png')} style={styles.titleIcon} />
            <Text style={[styles.title, theme === 'dark' && styles.titleDark]}>
              {t('statistics')}
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <Pressable 
              style={[styles.iconButton, theme === 'dark' && styles.iconButtonDark]}
              onPress={() => navigation.navigate('SymbolStats')}
            >
              <Image source={require('../../assets/icons/stat-dop.png')} style={styles.headerButtonIcon} />
            </Pressable>
            <Pressable 
              style={[styles.iconButton, theme === 'dark' && styles.iconButtonDark]}
              onPress={clearStats}
            >
              <Image source={require('../../assets/icons/krest.png')} style={styles.headerButtonIcon} />
            </Pressable>
          </View>
        </View>

        {/* Основные метрики */}
        <View style={styles.statsGrid}>
          <StatCard
            title={t('totalTests')}
            value={userStats.totalTests}
            iconSource={require('../../assets/icons/all-quiz.png')}
          />
          <StatCard
            title={t('correctAnswersCount')}
            value={userStats.totalCorrect}
            iconSource={require('../../assets/icons/checked.png')}
          />
          <StatCard
            title={t('incorrectAnswersCount')}
            value={userStats.totalIncorrect}
            iconSource={require('../../assets/icons/krest.png')}
          />
          <StatCard
            title={t('accuracy')}
            value={`${getAccuracy()}%`}
            iconSource={require('../../assets/icons/tochnost.png')}
          />
        </View>

        {/* Дополнительные метрики */}
        <View style={styles.statsGrid}>
          <StatCard
            title={t('totalTime')}
            value={formatTime(userStats.totalTime)}
            iconSource={require('../../assets/icons/timer.png')}
          />
          <StatCard
            title={t('averageTime')}
            value={`${getAverageTime()}${language === 'ru' ? 'с' : 's'}`}
            subtitle={t('perTest')}
            iconSource={require('../../assets/icons/pestime.png')}
          />
          <StatCard
            title={t('currentStreak')}
            value={userStats.currentStreak}
            subtitle={t('daysInARow')}
            iconSource={require('../../assets/icons/flame.png')}
          />
          <StatCard
            title={t('bestStreak')}
            value={userStats.bestStreak}
            subtitle={t('daysInARow')}
            iconSource={require('../../assets/icons/kubok.png')}
          />
        </View>

        {/* Последний тест */}
        <View style={[styles.lastTestCard, theme === 'dark' && styles.lastTestCardDark]}>
          <View style={styles.lastTestHeader}>
            <Image source={require('../../assets/icons/calendar.png')} style={styles.lastTestIcon} />
            <Text style={[styles.lastTestTitle, theme === 'dark' && styles.lastTestTitleDark]}>
              {t('lastTest')}
            </Text>
          </View>
          <Text style={[styles.lastTestDate, theme === 'dark' && styles.lastTestDateDark]}>
            {formatDate(userStats.lastTestDate)}
          </Text>
        </View>

        {/* Статистика по типам тестов */}
                  {Object.keys(userStats.quizStats).length > 0 && (
          <View style={styles.quizStatsSection}>
            <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
              📈 {t('byQuizType')}
            </Text>
            {Object.entries(userStats.quizStats).map(([quizType, quizData]) => (
              <View key={quizType} style={[styles.quizStatCard, theme === 'dark' && styles.quizStatCardDark]}>
                <Text style={[styles.quizType, theme === 'dark' && styles.quizTypeDark]}>
                  {getQuizDisplayName(quizType)}
                </Text>
                <View style={styles.quizStatDetails}>
                  <Text style={[styles.quizStatText, theme === 'dark' && styles.quizStatTextDark]}>
                    Тестов: {quizData.tests}
                  </Text>
                  <Text style={[styles.quizStatText, theme === 'dark' && styles.quizStatTextDark]}>
                    Точность: {quizData.accuracy}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Пустое состояние */}
                    {userStats.totalTests === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateIcon, theme === 'dark' && styles.emptyStateIconDark]}>
              📊
            </Text>
            <Text style={[styles.emptyStateTitle, theme === 'dark' && styles.emptyStateTitleDark]}>
              {t('statsEmpty')}
            </Text>
            <Text style={[styles.emptyStateText, theme === 'dark' && styles.emptyStateTextDark]}>
              {t('statsEmptyPrompt')}
            </Text>
            <Pressable 
              style={styles.startButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startButtonText}>{t('startQuizCTA')}</Text>
            </Pressable>
          </View>
        )}
      </AnimatedView>
    </ScrollView>
  );
};

const getQuizDisplayName = (quizType) => {
  const names = {
    'hiragana': 'Хирагана',
    'katakana': 'Катакана',
    'dakuten': 'Дакутэн/Хандакутэн',
    'allkana': 'Вся кана',
    'numbers': 'Числительные',
    'hiraganaInput': 'Хирагана (ввод)',
    'katakanaInput': 'Катакана (ввод)',
    'dakutenInput': 'Дакутэн (ввод)',
    'numbersInput': 'Числительные (ввод)',
  };
  return names[quizType] || quizType;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  titleDark: {
    color: '#f1f5f9',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  iconButtonDark: {
    // Убираем фон для темной темы
  },
  iconButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  headerButtonIcon: {
    width: 24,
    height: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardDark: {
    backgroundColor: '#1e293b',
    shadowOpacity: 0.3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statIconImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  statTitleDark: {
    color: '#94a3b8',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statValueDark: {
    color: '#f1f5f9',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statSubtitleDark: {
    color: '#64748b',
  },
  lastTestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastTestCardDark: {
    backgroundColor: '#1e293b',
    shadowOpacity: 0.3,
  },
  lastTestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastTestIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  lastTestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  lastTestTitleDark: {
    color: '#f1f5f9',
  },
  lastTestDate: {
    fontSize: 18,
    color: '#64748b',
  },
  lastTestDateDark: {
    color: '#94a3b8',
  },
  quizStatsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#f1f5f9',
  },
  quizStatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizStatCardDark: {
    backgroundColor: '#1e293b',
    shadowOpacity: 0.3,
  },
  quizType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  quizTypeDark: {
    color: '#f1f5f9',
  },
  quizStatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizStatText: {
    fontSize: 14,
    color: '#64748b',
  },
  quizStatTextDark: {
    color: '#94a3b8',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateIconDark: {
    opacity: 0.8,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateTitleDark: {
    color: '#f1f5f9',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyStateTextDark: {
    color: '#94a3b8',
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatsScreen;
