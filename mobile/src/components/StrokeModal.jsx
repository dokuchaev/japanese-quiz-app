import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Image, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';


const { width: screenWidth } = Dimensions.get('window');

export default function StrokeModal({ visible, onClose, strokeData }) {
  const { theme } = useTheme();

  if (!strokeData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[
        styles.overlay,
        theme === 'dark' && styles.overlayDark
      ]}>
        <View style={[
          styles.modalContent,
          theme === 'dark' && styles.modalContentDark
        ]}>
          <View style={styles.header}>
            <Text style={[
              styles.modalTitle,
              theme === 'dark' && styles.modalTitleDark
            ]}>
              Порядок написания
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.strokeContainer}>
            <Text style={[
              styles.strokeLabel,
              theme === 'dark' && styles.strokeLabelDark
            ]}>
              {strokeData.character} ({strokeData.reading})
            </Text>
            
            {strokeData.strokeImage && (
              <View style={[
                styles.strokeImageContainer,
                theme === 'dark' && styles.strokeImageContainerDark
              ]}>
                <Image
                  source={strokeData.strokeImage}
                  style={styles.strokeImage}
                  resizeMode="contain"
                  onError={(error) => console.warn('Ошибка загрузки изображения:', error)}
                />
              </View>
            )}
          </View>

          <Pressable style={styles.closeButtonLarge} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalTitleDark: {
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
  strokeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  strokeLabel: {
    fontSize: 18,
    marginBottom: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  strokeLabelDark: {
    color: '#9ca3af',
  },
  strokeImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  strokeImageContainerDark: {
    backgroundColor: 'rgba(45,45,45,0.8)',
    borderColor: colors.accentCoral,
  },
  strokeImage: {
    width: '100%',
    height: '100%',
  },
  closeButtonLarge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
