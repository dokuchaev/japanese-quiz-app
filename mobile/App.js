import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView, StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { ThemeProvider, useTheme } from './src/components/ThemeContext';
import { LanguageProvider, useLanguage } from './src/components/LanguageContext';
import { StatsProvider } from './src/components/StatsContext';
import LanguageToggle from './src/components/LanguageToggle';
import { createTranslate } from './src/components/i18n';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import KanaTableScreen from './src/screens/KanaTableScreen';
import NumbersTableScreen from './src/screens/NumbersTableScreen';
import StatsScreen from './src/screens/StatsScreen';
import SymbolStatsScreen from './src/screens/SymbolStatsScreen';
import ThemeToggle from './src/components/ThemeToggle';
import SplashScreen from './src/components/MinimalistSplashScreen';
import SettingsScreen from './src/screens/SettingsScreen';
// AsyncStorage initialization removed to prevent runtime errors

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppContent() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = createTranslate(language);
  const [showSplash, setShowSplash] = React.useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Простая инициализация приложения
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('🚀 Инициализация приложения...');
        console.log('📱 Используется fallback режим (память)');
        
        // Небольшая задержка для стабильности
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error('❌ Ошибка инициализации приложения:', error);
      } finally {
        setIsAppReady(true);
      }
    };

    initApp();
  }, []);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const HeaderTitle = ({ title }) => (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, theme === 'dark' && styles.headerTitleDark]}>{title}</Text>
    </View>
  );

  const renderBackButton = (navigation) => (
    <HeaderBackButton
      tintColor={theme === 'dark' ? '#60a5fa' : '#2563eb'}
      onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.getParent()?.navigate('HomeTab'))}
    />
  );

  // Home stack
  const HomeStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderBottomWidth: 0,
        },
        headerTintColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
        headerTitleStyle: { fontWeight: '600', color: theme === 'dark' ? '#f9fafb' : '#1f2937' },
        headerShadowVisible: false,
        headerBlurEffect: theme === 'dark' ? 'dark' : 'light',
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerTitle: () => <HeaderTitle title={'日本語クイズ'} /> }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title={t('quiz')} />,
          headerLeft: () => renderBackButton(navigation),
          headerLeftContainerStyle: { paddingLeft: 12 },
        })}
      />
      <Stack.Screen
        name="KanaTable"
        component={KanaTableScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title={t('kana')} />,
          headerLeft: () => renderBackButton(navigation),
          headerLeftContainerStyle: { paddingLeft: 12 },
        })}
      />
      <Stack.Screen
        name="NumbersTable"
        component={NumbersTableScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title={t('numbers')} />,
          headerLeft: () => renderBackButton(navigation),
          headerLeftContainerStyle: { paddingLeft: 12 },
        })}
      />
    </Stack.Navigator>
  );

  // Stats stack
  const StatsStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderBottomWidth: 0,
        },
        headerTintColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
        headerTitleStyle: { fontWeight: '600', color: theme === 'dark' ? '#f9fafb' : '#1f2937' },
        headerShadowVisible: false,
        headerBlurEffect: theme === 'dark' ? 'dark' : 'light',
      }}
    >
      <Stack.Screen
        name="StatsMain"
        component={StatsScreen}
        options={{ headerTitle: () => <HeaderTitle title={t('stats')} /> }}
      />
      <Stack.Screen
        name="SymbolStats"
        component={SymbolStatsScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title={t('symbols')} />,
          headerLeft: () => renderBackButton(navigation),
          headerLeftContainerStyle: { paddingLeft: 12 },
        })}
      />
    </Stack.Navigator>
  );

  // Settings stack
  const SettingsStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderBottomWidth: 0,
        },
        headerTintColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
        headerTitleStyle: { fontWeight: '600', color: theme === 'dark' ? '#f9fafb' : '#1f2937' },
        headerShadowVisible: false,
        headerBlurEffect: theme === 'dark' ? 'dark' : 'light',
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title={t('settingsTab')} />,
          headerBackTitleVisible: false,
          headerLeft: () => renderBackButton(navigation),
          headerLeftContainerStyle: { paddingLeft: 12 },
        })}
      />
    </Stack.Navigator>
  );
  
  if (showSplash) {
    return (
      <SplashScreen onAnimationComplete={handleSplashComplete} />
    );
  }
  
  return (
    <NavigationContainer>
      <View style={[styles.root, theme === 'dark' ? styles.rootDark : styles.rootLight]}>
        <SafeAreaView style={[styles.safeArea, theme === 'dark' && styles.safeAreaDark]}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: 'transparent',
                borderTopColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                height: 50,
                paddingTop: 14,
                paddingBottom: 2,
              },
              tabBarBackground: () => (
                <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#111827' : '#ffffff' }} />
              ),
              tabBarLabelStyle: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginBottom: -2, marginTop: -2 },
              tabBarIconStyle: { marginTop: -2 },
              tabBarItemStyle: { paddingVertical: 0, alignItems: 'center' },
              tabBarHideOnKeyboard: true,
            }}
          >
            <Tab.Screen
              name="HomeTab"
              component={HomeStack}
              options={{
                tabBarLabel: t('homeTab'),
                tabBarIcon: () => (
                  <Image source={require('./assets/icons/home.png')} style={{ width: 22, height: 22, alignSelf: 'center' }} />
                ),
              }}
            />
            <Tab.Screen
              name="StatsTab"
              component={StatsStack}
              options={{
                tabBarLabel: t('statsTab'),
                tabBarIcon: () => (
                  <Image source={require('./assets/icons/stats.png')} style={{ width: 22, height: 22, alignSelf: 'center' }} />
                ),
              }}
            />
            <Tab.Screen
              name="SettingsTab"
              component={SettingsStack}
              options={{
                tabBarLabel: t('settingsTab'),
                tabBarIcon: () => (
                  <Image source={require('./assets/icons/settings.png')} style={{ width: 22, height: 22, alignSelf: 'center' }} />
                ),
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <StatsProvider>
          <AppContent />
        </StatsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootLight: {
    backgroundColor: '#f8fafc',
  },
  rootDark: {
    backgroundColor: '#111827',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeAreaDark: {
    flex: 1,
    backgroundColor: '#111827',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 44,
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    flex: 1,
  },
  headerTitleDark: {
    color: '#f9fafb',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'absolute',
    right: -20,
    top: 0,
    bottom: 0,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: -8,
  },
  headerButtonDark: {
    // Убираем фон для темной темы тоже
  },
  headerButtonText: {
    fontSize: 20,
  },
  headerButtonImage: {
    width: 32,
    height: 32,
  },
  themeToggleContainer: {
    justifyContent: 'center',
  },
});
