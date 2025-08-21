import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    // In case we ever add RTL languages, keep hook here
    const isRTL = false;
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ru' ? 'en' : 'ru'));
  };

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext };



