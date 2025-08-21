import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';
import { useStats } from '../components/StatsContext';
import AnimatedView from '../components/AnimatedView';

const SymbolStatsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { symbolStats, refreshStats, isInitialized, loading } = useStats();

  // Обновляем статистику при фокусе экрана только если уже инициализированы
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialized) {
        refreshStats();
      }
    }, [isInitialized])
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Нет данных';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getAccuracy = (correct, incorrect) => {
    const total = correct + incorrect;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const sortedSymbols = Object.entries(symbolStats)
    .sort(([, a], [, b]) => (b.correct + b.incorrect) - (a.correct + a.incorrect));

  const SymbolCard = ({ symbol, stats }) => (
    <View style={[styles.symbolCard, theme === 'dark' && styles.symbolCardDark]}>
      <View style={styles.symbolHeader}>
        <Text style={[styles.symbol, theme === 'dark' && styles.symbolDark]}>
          {symbol}
        </Text>
        <Text style={[styles.accuracy, theme === 'dark' && styles.accuracyDark]}>
          {getAccuracy(stats.correct, stats.incorrect)}%
        </Text>
      </View>
      
      <View style={styles.symbolDetails}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, theme === 'dark' && styles.statLabelDark]}>
            ✅ Правильно:
          </Text>
          <Text style={[styles.statValue, theme === 'dark' && styles.statValueDark]}>
            {stats.correct}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, theme === 'dark' && styles.statLabelDark]}>
            ❌ Неправильно:
          </Text>
          <Text style={[styles.statValue, theme === 'dark' && styles.statValueDark]}>
            {stats.incorrect}
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, theme === 'dark' && styles.statLabelDark]}>
            🔥 Серия:
          </Text>
          <Text style={[styles.statValue, theme === 'dark' && styles.statValueDark]}>
            {stats.streak} (лучшая: {stats.bestStreak})
          </Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, theme === 'dark' && styles.statLabelDark]}>
            📅 Последний раз:
          </Text>
          <Text style={[styles.statValue, theme === 'dark' && styles.statValueDark]}>
            {formatDate(stats.lastSeen)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
        <Text style={[styles.loadingText, theme === 'dark' && styles.loadingTextDark]}>
          Загрузка статистики...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, theme === 'dark' && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <AnimatedView animationType="fadeIn" duration={500}>
        <View style={styles.header}>
          <Text style={[styles.title, theme === 'dark' && styles.titleDark]}>
            📈 Статистика по символам
          </Text>
          <Text style={[styles.subtitle, theme === 'dark' && styles.subtitleDark]}>
            {Object.keys(symbolStats).length} символов изучено
          </Text>
        </View>

        {sortedSymbols.length > 0 ? (
          sortedSymbols.map(([symbol, stats]) => (
            <SymbolCard key={symbol} symbol={symbol} stats={stats} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateIcon, theme === 'dark' && styles.emptyStateIconDark]}>
              📊
            </Text>
            <Text style={[styles.emptyStateTitle, theme === 'dark' && styles.emptyStateTitleDark]}>
              Статистика по символам пуста
            </Text>
            <Text style={[styles.emptyStateText, theme === 'dark' && styles.emptyStateTextDark]}>
              Пройдите несколько тестов, чтобы увидеть статистику по символам
            </Text>
            <Pressable 
              style={styles.startButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startButtonText}>🚀 Начать тест</Text>
            </Pressable>
          </View>
        )}
      </AnimatedView>
    </ScrollView>
  );
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  titleDark: {
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  subtitleDark: {
    color: '#94a3b8',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 100,
  },
  loadingTextDark: {
    color: '#94a3b8',
  },
  symbolCard: {
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
  symbolCardDark: {
    backgroundColor: '#1e293b',
    shadowOpacity: 0.3,
  },
  symbolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  symbolDark: {
    color: '#f1f5f9',
  },
  accuracy: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  accuracyDark: {
    color: '#34d399',
  },
  symbolDetails: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  statLabelDark: {
    color: '#94a3b8',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  statValueDark: {
    color: '#f1f5f9',
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

export default SymbolStatsScreen;
