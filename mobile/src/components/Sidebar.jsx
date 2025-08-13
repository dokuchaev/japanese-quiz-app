import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from './ThemeContext';

export default function Sidebar({ isVisible, onClose, navigation }) {
  const { theme } = useTheme();

  if (!isVisible) return null;

  const menuItems = [
    { title: 'Главная', icon: '🏠', route: 'Home' },
    { title: 'Хирагана', icon: 'あ', route: 'KanaTable', params: { quiz: 'hiragana' } },
    { title: 'Катакана', icon: 'シ', route: 'KanaTable', params: { quiz: 'katakana' } },
    { title: 'Дакутэн', icon: 'ガ', route: 'KanaTable', params: { quiz: 'dakuten' } },
    { title: 'Числительные', icon: '三', route: 'NumbersTable' },
  ];

  const handleNavigation = (item) => {
    if (item.params) {
      navigation.navigate(item.route, item.params);
    } else {
      navigation.navigate(item.route);
    }
    onClose();
  };

  return (
    <View style={[
      styles.overlay,
      theme === 'dark' && styles.overlayDark
    ]}>
      <View style={[
        styles.sidebar,
        theme === 'dark' && styles.sidebarDark
      ]}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            theme === 'dark' && styles.titleDark
          ]}>
            Меню
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </Pressable>
        </View>
        
        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.menuItem,
                theme === 'dark' && styles.menuItemDark
              ]}
              onPress={() => handleNavigation(item)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[
                styles.menuText,
                theme === 'dark' && styles.menuTextDark
              ]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  overlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarDark: {
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  titleDark: {
    color: '#f9fafb',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  menuItemDark: {
    backgroundColor: '#374151',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  menuTextDark: {
    color: '#d1d5db',
  },
});
