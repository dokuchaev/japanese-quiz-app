import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { ThemeProvider, useTheme } from './src/components/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import KanaTableScreen from './src/screens/KanaTableScreen';
import NumbersTableScreen from './src/screens/NumbersTableScreen';
import ThemeToggle from './src/components/ThemeToggle';
import SplashScreen from './src/components/MinimalistSplashScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = React.useState(true);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  if (showSplash) {
    return (
      <SplashScreen onAnimationComplete={handleSplashComplete} />
    );
  }
  
  return (
    <NavigationContainer>
      <View style={[styles.root, theme === 'dark' ? styles.rootDark : styles.rootLight]}>
        <SafeAreaView style={[
          styles.safeArea,
          theme === 'dark' && styles.safeAreaDark
        ]}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                borderBottomWidth: 0,
              },
              headerTintColor: theme === 'dark' ? '#60a5fa' : '#2563eb',
              headerTitleStyle: {
                fontWeight: '600',
                color: theme === 'dark' ? '#f9fafb' : '#1f2937',
              },
              headerShadowVisible: false,
              headerBlurEffect: theme === 'dark' ? 'dark' : 'light',
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={({ navigation }) => ({
                headerTitle: () => (
                  <View style={styles.headerContainer}>
                    <Text style={[
                      styles.headerTitle,
                      theme === 'dark' && styles.headerTitleDark
                    ]}>
                      日本語クイズ
                    </Text>
                    <View style={styles.themeToggleContainer}>
                      <ThemeToggle />
                    </View>
                  </View>
                ),
              })}
            />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Японский квиз' }} />
            <Stack.Screen name="KanaTable" component={KanaTableScreen} options={{ title: 'Кана' }} />
            <Stack.Screen name="NumbersTable" component={NumbersTableScreen} options={{ title: 'Числительные' }} />
          </Stack.Navigator>
        </SafeAreaView>
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
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
    backgroundColor: '#f8fafc',
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
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerTitleDark: {
    color: '#f9fafb',
  },
  themeToggleContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
