import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Пример использования компонентов GIF анимации

export default function ExampleUsage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Примеры использования GIF анимации</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. GifEmotionAnimation (с существующими GIF)</Text>
        <Text style={styles.code}>
{`import GifEmotionAnimation from './GifEmotionAnimation';

<GifEmotionAnimation
  result={85}
  onAnimationComplete={() => console.log('Анимация завершена')}
/>`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. CustomGifAnimation (с вашим GIF)</Text>
        <Text style={styles.code}>
{`import CustomGifAnimation from './CustomGifAnimation';

<CustomGifAnimation
  result={95}
  onAnimationComplete={() => console.log('Анимация завершена')}
  customGifSource={require('../assets/your-animation.gif')}
  customMessage="Поздравляем! 🎊"
/>`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Размещение вашего GIF файла</Text>
        <Text style={styles.text}>
          Поместите ваш GIF файл в папку mobile/assets/ и используйте require() для импорта.
        </Text>
        <Text style={styles.code}>
{`// Пример структуры:
mobile/assets/
├── your-animation.gif
└── custom-animation.gif`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  code: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#e83e8c',
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});




