import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet, Dimensions, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useTheme } from '../components/ThemeContext';
import { hiraganaData } from '../data/hiragana';
import { katakanaData } from '../data/katakana';
import { dakutenData } from '../data/dakuten';
import { 
  getHiraganaGif, 
  getKatakanaGif, 
  getDakutenGif,
  getHiraganaAudio, 
  getKatakanaAudio, 
  getDakutenAudio 
} from '../utils/assetMap';


const { width: screenWidth } = Dimensions.get('window');

const KanaTableScreen = ({ route, navigation }) => {
  const { quiz } = route.params;
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [sound, setSound] = useState();
  const { theme } = useTheme();

  let tableData;
  let tableTitle;
  let audioPath;
  let strokePath;

  if (quiz.includes('dakuten')) {
    tableData = dakutenData;
    tableTitle = 'Дакутэн/Хандакутэн';
    audioPath = 'dakuten';
    strokePath = 'dakuten';
  } else if (quiz.includes('katakana')) {
    tableData = katakanaData;
    tableTitle = 'Катакана';
    audioPath = 'katakana';
    strokePath = 'katakana';
  } else {
    tableData = hiraganaData;
    tableTitle = 'Хирагана';
    audioPath = 'hiragana';
    strokePath = 'hiragana';
  }

  const openModal = (symbol) => {
    if (!symbol) return;
    setSelectedSymbol(symbol);
  };

  const closeModal = () => {
    setSelectedSymbol(null);
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAudio = async (romaji) => {
    try {
      let audioFile;
      
      if (quiz.includes('dakuten')) {
        audioFile = getDakutenAudio(romaji);
      } else if (quiz.includes('katakana')) {
        audioFile = getKatakanaAudio(romaji);
      } else {
        audioFile = getHiraganaAudio(romaji);
      }
      
      if (audioFile) {
        console.log(`Playing audio for: ${romaji}`);
        
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
        console.warn(`Аудио файл не найден для: ${romaji}`);
        alert(`Аудио файл не найден для "${romaji}"`);
      }
    } catch (error) {
      console.warn('Ошибка воспроизведения аудио:', error);
      alert(`Ошибка воспроизведения аудио для "${romaji}": ${error.message}`);
    }
  };

  const getStrokeOrderGif = (romaji) => {
    if (quiz.includes('dakuten')) {
      return null; // Убираем GIF для дакутэн
    } else if (quiz.includes('katakana')) {
      return getKatakanaGif(romaji);
    } else {
      return getHiraganaGif(romaji);
    }
  };

  const renderSymbol = (item, index) => (
    <Pressable
      key={index}
      style={[
        styles.cell,
        theme === 'dark' && styles.cellDark
      ]}
      onPress={() => openModal(item)}
    >
      <Text style={[
        styles.character,
        theme === 'dark' && styles.characterDark
      ]}>
        {item.question}
      </Text>
      <Text style={[
        styles.reading,
        theme === 'dark' && styles.readingDark
      ]}>
        {item.correctAnswer}
      </Text>
    </Pressable>
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
          {tableTitle}
        </Text>
        
        <View style={styles.tableGrid}>
          {tableData.map((item, index) => renderSymbol(item, index))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedSymbol !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={[
            styles.modalContent,
            theme === 'dark' && styles.modalContentDark
          ]}>
            <Text style={[
              styles.modalTitle,
              theme === 'dark' && styles.modalTitleDark
            ]}>
              {selectedSymbol?.question} - {selectedSymbol?.correctAnswer}
            </Text>

            {!quiz.includes('dakuten') && (
              <View style={styles.strokeContainer}>
                <Text style={[
                  styles.strokeLabel,
                  theme === 'dark' && styles.strokeLabelDark
                ]}>
                  Порядок написания:
                </Text>
                <View style={styles.strokeImageContainer}>
                  {getStrokeOrderGif(selectedSymbol?.correctAnswer) ? (
                    <Image
                      source={getStrokeOrderGif(selectedSymbol?.correctAnswer)}
                      style={styles.strokeImage}
                      resizeMode="contain"
                      onError={(error) => console.warn('Ошибка загрузки GIF:', error)}
                    />
                  ) : (
                    <Text style={styles.strokeLabel}>GIF не найден</Text>
                  )}
                </View>
              </View>
            )}

            <Pressable
              style={styles.audioButton}
              onPress={() => playAudio(selectedSymbol?.correctAnswer)}
            >
              <Text style={styles.audioButtonText}>🔊</Text>
            </Pressable>

            <Pressable
              style={[
                styles.closeButton,
                theme === 'dark' && styles.closeButtonDark
              ]}
              onPress={closeModal}
            >
              <Text style={[
                styles.closeButtonText,
                theme === 'dark' && styles.closeButtonTextDark
              ]}>
                Закрыть
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    gap: 10,
  },
  cell: {
    width: (screenWidth - 60) / 3,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cellDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
  },
  character: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  characterDark: {
    color: '#f9fafb',
  },
  reading: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  readingDark: {
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContentDark: {
    backgroundColor: '#374151',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  modalTitleDark: {
    color: '#f9fafb',
  },
  strokeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  strokeLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6b7280',
  },
  strokeLabelDark: {
    color: '#9ca3af',
  },
  strokeImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  strokeImage: {
    width: '100%',
    height: '100%',
  },
  audioButton: {
    backgroundColor: '#FFDC60',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  audioButtonText: {
    fontSize: 24,
  },
  closeButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonDark: {
    backgroundColor: '#dc2626',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonTextDark: {
    color: '#f9fafb',
  },
});

export default KanaTableScreen;

