// Контекст для управления состоянием статистики
// Обеспечивает обновление UI в реальном времени

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadStats, getSymbolStats } from '../utils/statsManagerSwitch';

const StatsContext = createContext();

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export const StatsProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    totalTests: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalTime: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastTestDate: null,
    quizStats: {},
  });
  
  const [symbolStats, setSymbolStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка статистики
  const loadUserStats = async () => {
    try {
      const stats = await loadStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadSymbolStatsData = async () => {
    try {
      const stats = await getSymbolStats();
      setSymbolStats(stats);
    } catch (error) {
      console.error('Error loading symbol stats:', error);
    }
  };

  // Обновление статистики
  const refreshStats = useCallback(async () => {
    // Избегаем лишних обновлений если уже загружаем
    if (loading) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadUserStats(),
        loadSymbolStatsData()
      ]);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Инициализация при загрузке
  useEffect(() => {
    refreshStats();
  }, []);

  const value = {
    userStats,
    symbolStats,
    loading,
    isInitialized,
    refreshStats,
    loadUserStats,
    loadSymbolStatsData,
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};
