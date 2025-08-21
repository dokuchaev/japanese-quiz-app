import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useTheme } from '../components/ThemeContext';
import { numbersData } from '../data/numbers';
import { getNumbersAudio } from '../utils/assetMap';


const { width: screenWidth } = Dimensions.get('window');

const NumbersTableScreen = ({ route, navigation }) => {
  const { range } = route.params || {};
  const [sound, setSound] = useState();
  const { theme } = useTheme();

  const filteredData = range === "1-10"
    ? numbersData.filter(item => +item.correctAnswer <= 10)
    : numbersData;

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAudio = async (arabic) => {
    try {
      const audioFile = getNumbersAudio(arabic);
      if (audioFile) {
        console.log(`Playing audio for number: ${arabic}`);
        
        // Останавливаем предыдущий звук если он играет
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
        
        // Создаем и воспроизводим новый звук
        const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
        setSound(newSound);
        
        await newSound.playAsync();
      } else {
        console.warn(`Аудио файл не найден для числа: ${arabic}`);
        alert(`Аудио файл не найден для числа "${arabic}"`);
      }
    } catch (error) {
      console.warn('Ошибка воспроизведения аудио:', error);
      alert(`Ошибка воспроизведения аудио для числа "${arabic}": ${error.message}`);
    }
  };

  const renderNumberCard = (item, index) => (
    <View key={index} style={[
      styles.card,
      theme === 'dark' && styles.cardDark
    ]}>
      {/* Фоновое число с адаптивным размером */}
      <Text style={[
        styles.backgroundNumber,
        item.correctAnswer <= 9 && styles.backgroundNumberLarge,
        item.correctAnswer >= 10 && item.correctAnswer <= 99 && styles.backgroundNumberMedium,
        item.correctAnswer >= 100 && styles.backgroundNumberSmall,
        theme === 'dark' && styles.backgroundNumberDark
      ]}>
        {item.correctAnswer}
      </Text>
      

      <Text style={[
        styles.kanji,
        theme === 'dark' && styles.kanjiDark
      ]}>
        {item.question}
      </Text>
      <Text style={[
        styles.reading,
        theme === 'dark' && styles.readingDark
      ]}>
        {item.reading}
      </Text>
      
      {getNumbersAudio(item.correctAnswer) && (
        <Pressable
          style={styles.audioButton}
          onPress={() => playAudio(item.correctAnswer)}
        >
          <Text style={styles.audioButtonText}>🔊</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={[
      styles.container,
      theme === 'dark' && styles.containerDark
    ]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[
          styles.title,
          theme === 'dark' && styles.titleDark
        ]}>
          Таблица числительных {range === "1-10" ? "(от 1 до 10)" : ""}
        </Text>
        
        <View style={styles.tableGrid}>
          {filteredData.map((item, index) => renderNumberCard(item, index))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  titleDark: {
    color: '#f9fafb',
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  card: {
    width: (screenWidth - 56) / 3,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  arabicNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
    zIndex: 1,
  },
  arabicNumberDark: {
    color: '#f9fafb',
  },
  kanji: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 26,
    zIndex: 1,
  },
  kanjiDark: {
    color: '#f9fafb',
  },
  reading: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 15,
    zIndex: 1,
  },
  readingDark: {
    color: '#9ca3af',
  },
  audioButton: {
    backgroundColor: '#FFDC60',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  audioButtonText: {
    fontSize: 14,
  },
  backgroundNumber: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 50,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.08)',
    zIndex: 0,
    userSelect: 'none',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  backgroundNumberLarge: {
    fontSize: 90,
    fontWeight: '900',
  },
  backgroundNumberMedium: {
    fontSize: 80,
    fontWeight: '900',
    textAlign: 'right',
    textAlignVertical: 'center',
    right: 10,
  },
  backgroundNumberSmall: {
    fontSize: 50,
    fontWeight: '900',
  },
  backgroundNumberDark: {
    color: 'rgba(255, 255, 255, 0.08)',
  },
});

export default NumbersTableScreen;


