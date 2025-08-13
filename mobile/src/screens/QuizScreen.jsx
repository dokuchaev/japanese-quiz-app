import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Switch } from 'react-native';
// Gradient temporarily removed to fix runtime error; using solid modern color
import { hiraganaData } from '../data/hiragana';
import { katakanaData } from '../data/katakana';
import { dakutenData } from '../data/dakuten';
import { numbersData as numbersDataQuiz } from '../data/numbers';
import { useTheme } from '../components/ThemeContext';
import AnimatedView from '../components/AnimatedView';
import WorkingGifAnimation from '../components/WorkingGifAnimation';
import ConfettiCannon from 'react-native-confetti-cannon';


const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const quizSources = {
  hiragana: hiraganaData,
  katakana: katakanaData,
  dakuten: dakutenData,
  numbers: numbersDataQuiz,
  allkana: [...hiraganaData, ...katakanaData, ...dakutenData],
  // Тесты с вводом текста
  hiraganaInput: hiraganaData,
  katakanaInput: katakanaData,
  dakutenInput: dakutenData,
  numbersInput: numbersDataQuiz,
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function QuizScreen({ route, navigation }) {
  const { quiz } = route.params ?? { quiz: 'hiragana' };
  const { theme } = useTheme();
  const [speedMode, setSpeedMode] = useState(false);
  const [state, setState] = useState({
    questions: [],
    currentQuestionIndex: 0,
    selectedOption: null,
    score: { correct: 0, incorrect: 0 },
    timeElapsed: 0,
    showResults: false,
    incorrectAnswers: [],
    userAnswer: '',
    started: false,
    showEmotionAnimation: false,
    finalResult: null,
    questionTimer: speedMode ? (quiz.includes('Input') ? 5 : 3) : 3, // Разное время для разных типов тестов
    questionTimerActive: false,
  });

  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);

  const startQuiz = (numQuestionsToSet, filterFn = null) => {
    const allData = quizSources[quiz];
    if (!allData) return;
    const filteredData = filterFn ? allData.filter(filterFn) : allData;
    const correctAnswers = filteredData.map((q) => q.correctAnswer);

    const generateOptions = (correct) => {
      const incorrect = correctAnswers
        .filter((ans) => String(ans) !== String(correct))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      return [...incorrect, correct].sort(() => Math.random() - 0.5);
    };

    const shuffled = [...filteredData]
      .sort(() => Math.random() - 0.5)
      .map((q) => ({ ...q, options: generateOptions(q.correctAnswer) }))
      .slice(0, numQuestionsToSet || filteredData.length);

    setState({
      questions: shuffled,
      currentQuestionIndex: 0,
      selectedOption: null,
      score: { correct: 0, incorrect: 0 },
      timeElapsed: 0,
      showResults: false,
      incorrectAnswers: [],
      userAnswer: '',
      started: true,
      showEmotionAnimation: false,
    });
  };

  const showEmotionAnimation = () => {
    setState(prev => ({ ...prev, showEmotionAnimation: true }));
  };

  const hideEmotionAnimation = () => {
    setState(prev => ({ ...prev, showEmotionAnimation: false }));
  };

  const startQuestionTimer = () => {
    if (!speedMode) return;
    
    const timeLimit = quiz.includes('Input') ? 5 : 3;
    setState(prev => ({ ...prev, questionTimer: timeLimit, questionTimerActive: true }));
    
    questionTimerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.questionTimer <= 1) {
          clearInterval(questionTimerRef.current);
          const currentQuestion = prev.questions[prev.currentQuestionIndex];

          const newScore = {
            ...prev.score,
            incorrect: prev.score.incorrect + 1,
          };

          const newIncorrectAnswers = [
            ...prev.incorrectAnswers,
            {
              question: currentQuestion.question,
              userAnswer: 'Время истекло',
              correctAnswer: currentQuestion.correctAnswer,
              reading: currentQuestion.reading,
            },
          ];

          const nextIndex = prev.currentQuestionIndex + 1;
          const showResults = nextIndex >= prev.questions.length;

          return {
            ...prev,
            questionTimer: timeLimit,
            questionTimerActive: false,
            selectedOption: null,
            score: newScore,
            incorrectAnswers: newIncorrectAnswers,
            currentQuestionIndex: nextIndex,
            showResults,
          };
        }
        return { ...prev, questionTimer: prev.questionTimer - 1 };
      });
    }, 1000);
  };

  const stopQuestionTimer = () => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      setState(prev => ({ ...prev, questionTimerActive: false }));
    }
  };

  useEffect(() => {
    if (state.started && !state.showResults) {
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 800);
    }
    return () => clearInterval(timerRef.current);
  }, [state.started, state.showResults]);

  // Запуск таймера вопроса при смене вопроса или режима скорости
  useEffect(() => {
    if (state.started && !state.showResults && speedMode && state.questions.length > 0) {
      stopQuestionTimer();
      // Сбрасываем selectedOption при смене вопроса
      setState(prev => ({ ...prev, selectedOption: null }));
      setTimeout(() => {
        startQuestionTimer();
      }, 500); // Небольшая задержка для анимации
    } else if (!speedMode) {
      stopQuestionTimer();
    }
    return () => stopQuestionTimer();
  }, [state.currentQuestionIndex, state.started, state.showResults, speedMode]);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, []);

  const isInputQuiz = quiz.includes('Input');
  const isNumbersQuiz = quiz === 'numbers' || quiz === 'numbersInput';

  // Внимание: currentQuestion вычисляем только когда мы не в результатах и вопросы есть
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const totalAnswers = state.score.correct + state.score.incorrect;
  const percentage = totalAnswers > 0 ? Math.round((state.score.correct / totalAnswers) * 100) : 0;

  const handleOptionClick = (option) => {
    if (state.selectedOption !== null) return;
    
    // Останавливаем таймер вопроса
    stopQuestionTimer();
    
    const correct = currentQuestion?.correctAnswer;
    const isCorrect = String(option) === String(correct);
    setState((prev) => ({
      ...prev,
      selectedOption: option,
      score: {
        correct: prev.score.correct + (isCorrect ? 1 : 0),
        incorrect: prev.score.incorrect + (isCorrect ? 0 : 1),
      },
      incorrectAnswers: isCorrect
        ? prev.incorrectAnswers
        : [
            ...prev.incorrectAnswers,
            { question: currentQuestion?.question, yourAnswer: String(option), correctAnswer: String(correct) },
          ],
    }));

    setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentQuestionIndex + 1;
        if (nextIndex < prev.questions.length) {
          return { ...prev, currentQuestionIndex: nextIndex, selectedOption: null };
        }
        clearInterval(timerRef.current);
        // Финальный процент фиксируем отдельно, чтобы избежать мигания
        const finalPercentage = Math.round((prev.score.correct / prev.questions.length) * 100);
        // Показываем анимацию эмоций перед результатами
        showEmotionAnimation();
        return { ...prev, selectedOption: null, finalResult: finalPercentage };
      });
    }, 700);
  };

  const handleSubmitAnswer = () => {
    // Останавливаем таймер вопроса
    stopQuestionTimer();
    
    const answer = state.userAnswer.trim().toLowerCase();
    const correct = String(currentQuestion?.correctAnswer).trim().toLowerCase();
    const isCorrect = answer === correct;
    setState((prev) => ({
      ...prev,
      score: {
        correct: prev.score.correct + (isCorrect ? 1 : 0),
        incorrect: prev.score.incorrect + (isCorrect ? 0 : 1),
      },
      incorrectAnswers: isCorrect
        ? prev.incorrectAnswers
        : [
            ...prev.incorrectAnswers,
            { question: currentQuestion?.question, yourAnswer: String(answer), correctAnswer: String(correct) },
          ],
    }));

    setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentQuestionIndex + 1;
        if (nextIndex < prev.questions.length) {
          return { ...prev, currentQuestionIndex: nextIndex, userAnswer: '' };
        }
        clearInterval(timerRef.current);
        const finalPercentage = Math.round((prev.score.correct / prev.questions.length) * 100);
        // Показываем анимацию эмоций перед результатами
        showEmotionAnimation();
        return { ...prev, userAnswer: '', finalResult: finalPercentage };
      });
    }, 700);
  };

  const getQuizTitle = () => {
    if (quiz === 'hiragana' || quiz === 'hiraganaInput') return 'хирагане';
    if (quiz === 'katakana' || quiz === 'katakanaInput') return 'катакане';
    if (quiz === 'dakuten' || quiz === 'dakutenInput') return 'дакутэн/хандакутэн';
    if (quiz === 'allkana') return 'всем символам каны';
    if (quiz === 'numbers' || quiz === 'numbersInput') return 'числительным';
    return 'кане';
  };

  const getInputQuizTitle = () => {
    if (quiz === 'hiraganaInput') return 'хирагане (ввод)';
    if (quiz === 'katakanaInput') return 'катакане (ввод)';
    if (quiz === 'dakutenInput') return 'дакутэн/хандакутэн (ввод)';
    if (quiz === 'numbersInput') return 'числительным (ввод)';
    return 'кане (ввод)';
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, theme === 'dark' && styles.containerDark]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Конфетти после успешного прохождения */}
      {state.showResults && percentage >= 80 && (
        <ConfettiCannon
          count={160}
          origin={{ x: deviceWidth / 2, y: -10 }}
          fadeOut
          autoStart
          explosionSpeed={450}
          fallSpeed={260}
        />
      )}
      {/* Анимация эмоций */}
      {state.showEmotionAnimation && (
        <WorkingGifAnimation
          result={state.finalResult ?? percentage}
          onAnimationComplete={() => {
            hideEmotionAnimation();
            setState(prev => ({ ...prev, showResults: true }));
          }}
        />
      )}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {state.started && (
          <>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressLine,
                  { width: `${state.showResults ? 100 : (state.currentQuestionIndex / state.questions.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={[styles.meta, theme === 'dark' && styles.metaDark]}>
              Вопрос {state.currentQuestionIndex + 1} из {state.questions.length} 
              <Text style={styles.timer}> ⏱ {formatTime(state.timeElapsed)}</Text>
            </Text>
          </>
        )}

        {!state.started ? (
          <AnimatedView animationType="fadeIn" duration={500}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={[styles.title, theme === 'dark' && styles.titleDark]}>
                Тест по {isInputQuiz ? getInputQuizTitle() : getQuizTitle()}
              </Text>
              
              {/* Переключатель режима скорости */}
              <View style={[styles.speedModeContainer, theme === 'dark' && styles.speedModeContainerDark]}>
                <View style={styles.speedModeContent}>
                  <View style={styles.speedModeTextContainer}>
                    <Text style={[styles.speedModeTitle, theme === 'dark' && styles.speedModeTitleDark]}>
                      Режим скорости ({isInputQuiz ? '5с' : '3с'})
                    </Text>
                  </View>
                  <Switch
                    value={speedMode}
                    onValueChange={setSpeedMode}
                    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                    thumbColor={speedMode ? '#ffffff' : '#ffffff'}
                  />
                </View>
              </View>

              <View style={{ gap: 10, marginTop: 20, width: '100%' }}>
                {/* Кнопки для тестирования */}
                <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                  Тестирование
                </Text>
                
                {isNumbersQuiz ? (
                  <>
                    <Pressable style={styles.button} onPress={() => startQuiz(20, (q) => +q.correctAnswer <= 10)}>
                      <Text style={styles.buttonText}>От 1 до 10</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => startQuiz(20, (q) => +q.correctAnswer > 10)}>
                      <Text style={styles.buttonText}>От 10 до 100</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable style={styles.button} onPress={() => startQuiz(quiz === 'allkana' ? 30 : 15)}>
                      <Text style={styles.buttonText}>{quiz === 'allkana' ? '30 случайных вопросов' : '15 случайных вопросов'}</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => startQuiz(null)}>
                      <Text style={styles.buttonText}>Все вопросы</Text>
                    </Pressable>
                  </>
                )}

                {/* Кнопки для просмотра таблиц */}
                <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                  Изучение
                </Text>
                
                {isNumbersQuiz ? (
                  <Pressable style={styles.button} onPress={() => navigation.navigate('NumbersTable', { range: 'all' })}>
                    <Text style={styles.buttonText}>Таблица числительных</Text>
                  </Pressable>
                ) : (
                  <>
                    {(quiz === 'hiragana' || quiz === 'hiraganaInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'hiragana' })}>
                        <Text style={styles.buttonText}>Таблица Хираганы</Text>
                      </Pressable>
                    )}
                    {(quiz === 'katakana' || quiz === 'katakanaInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'katakana' })}>
                        <Text style={styles.buttonText}>Таблица Катаканы</Text>
                      </Pressable>
                    )}
                    {(quiz === 'dakuten' || quiz === 'dakutenInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'dakuten' })}>
                        <Text style={styles.buttonText}>Таблица Дакутен/хандакутэн</Text>
                      </Pressable>
                    )}
                  </>
                )}
              </View>
            </View>
          </AnimatedView>
        ) : state.showResults ? (
          <AnimatedView animationType="scaleIn" duration={500}>
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={[styles.title, theme === 'dark' && styles.titleDark]}>Результаты</Text>
              <Text style={[styles.percentage, theme === 'dark' && styles.percentageDark]}>{percentage}% правильных</Text>
              <Text style={[styles.scoreText, theme === 'dark' && styles.scoreTextDark]}>👍 {state.score.correct}   👎 {state.score.incorrect}</Text>
              <Text style={[styles.timerText, theme === 'dark' && styles.timerTextDark]}>⏱ {formatTime(state.timeElapsed)}</Text>

              {state.incorrectAnswers.length > 0 && (
                <View style={{ marginTop: 16, width: '100%' }}>
                  <Text style={[styles.title, theme === 'dark' && styles.titleDark]}>Ошибки</Text>
                  <View style={styles.incorrectAnswersContainer}>
                    {state.incorrectAnswers.map((item, index) => (
                      <Text key={index} style={[styles.incorrectAnswer, theme === 'dark' && styles.incorrectAnswerDark]}>
                        • {item.question}: {item.yourAnswer === 'Время истекло' ? '⏰ Время истекло' : `ваш ответ ${item.yourAnswer || 'не указан'}`}, правильный {item.correctAnswer}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              <View style={{ gap: 10, marginTop: 20, width: '100%' }}>
                {/* Кнопки повторного запуска как в веб-версии */}
                {isNumbersQuiz ? (
                  <>
                    <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                      Хотите повторить числительные?
                    </Text>
                    <Pressable style={styles.button} onPress={() => navigation.navigate('NumbersTable', { range: 'all' })}>
                      <Text style={styles.buttonText}>Таблица числительных</Text>
                    </Pressable>
                    
                    <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                      {quiz === 'numbers' ? 'Тест по числительным' : 'Тест по числительным (ввод)'}
                    </Text>
                    <Pressable style={styles.button} onPress={() => startQuiz(20, (q) => +q.correctAnswer <= 10)}>
                      <Text style={styles.buttonText}>От 1 до 10</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => startQuiz(20, (q) => +q.correctAnswer > 10)}>
                      <Text style={styles.buttonText}>От 10 до 100</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    {(quiz === 'hiragana' || quiz === 'hiraganaInput') && (
                      <>
                        <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                          Хотите повторить хирагану?
                        </Text>
                        <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'hiragana' })}>
                          <Text style={styles.buttonText}>Таблица Хираганы</Text>
                        </Pressable>
                      </>
                    )}

                    {(quiz === 'katakana' || quiz === 'katakanaInput') && (
                      <>
                        <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                          Хотите повторить катакану?
                        </Text>
                        <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'katakana' })}>
                          <Text style={styles.buttonText}>Таблица Катаканы</Text>
                        </Pressable>
                      </>
                    )}

                    {(quiz === 'dakuten' || quiz === 'dakutenInput') && (
                      <>
                        <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                          Хотите повторить дакутэн/хандакутэн?
                        </Text>
                        <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'dakuten' })}>
                          <Text style={styles.buttonText}>Таблица Дакутен/хандакутэн</Text>
                        </Pressable>
                      </>
                    )}

                    <Text style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
                      Тест по {isInputQuiz ? getInputQuizTitle() : getQuizTitle()}
                    </Text>
                    <Pressable style={styles.button} onPress={() => startQuiz(quiz === 'allkana' ? 30 : 15)}>
                      <Text style={styles.buttonText}>{quiz === 'allkana' ? '30 случайных вопросов' : '15 случайных вопросов'}</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => startQuiz(null)}>
                      <Text style={styles.buttonText}>Все вопросы</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </AnimatedView>
        ) : currentQuestion ? (
          <>
            <AnimatedView animationType="fadeIn" duration={400}>
              <View style={[styles.question, (quiz === 'numbers') && styles.questionNumber, theme === 'dark' && styles.questionDark]}>
                <Text style={[styles.questionText, theme === 'dark' && styles.questionTextDark]}>
                  {quiz === 'numbers' ? `${currentQuestion?.question} (${currentQuestion?.reading})` : currentQuestion?.question}
                </Text>
              </View>
            </AnimatedView>

            <AnimatedView animationType="slideIn" duration={500} delay={200}>
              {'options' in currentQuestion && !isInputQuiz ? (
                <View style={styles.options}>
                  {currentQuestion.options.map((option, index) => {
                    let bg = '#e6effe';
                    let clr = '#222';
                    if (state.selectedOption) {
                      if (String(option) === String(currentQuestion.correctAnswer)) {
                        bg = '#10b981';
                        clr = '#fff';
                      } else if (String(option) === String(state.selectedOption)) {
                        bg = '#ef4444';
                        clr = '#fff';
                      }
                    }
                    return (
                      <Pressable key={index} onPress={() => handleOptionClick(option)} style={[styles.option, { backgroundColor: bg }]} disabled={!!state.selectedOption}>
                        <Text style={[styles.optionText, { color: clr }]}>{String(option)}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={{ alignItems: 'center', marginTop: 16 }}>
                  <Text style={[styles.inputHint, theme === 'dark' && styles.inputHintDark]}>
                    {isNumbersQuiz ? 'Введите число (например: 5)' : 'Введите чтение каны (например: a)'}
                  </Text>
                  <TextInput
                    value={state.userAnswer}
                    onChangeText={(t) => setState((prev) => ({ ...prev, userAnswer: t }))}
                    placeholder="Ваш ответ"
                    placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                    style={[styles.input, theme === 'dark' && styles.inputDark]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmitAnswer}
                  />
                  <Pressable style={styles.button} onPress={handleSubmitAnswer}>
                    <Text style={styles.buttonText}>Ответить</Text>
                  </Pressable>
                </View>
              )}

              {/* Индикатор таймера вопроса для режима скорости */}
              {speedMode && state.questionTimerActive && (
                <View style={styles.questionTimerContainer}>
                  <Text style={[styles.questionTimerText, theme === 'dark' && styles.questionTimerTextDark]}>
                    ⏰ {state.questionTimer}с
                  </Text>
                  <View style={styles.questionTimerBar}>
                    <View
                      style={[
                        styles.questionTimerProgress,
                        { width: `${(state.questionTimer / (quiz.includes('Input') ? 5 : 3)) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              )}
            </AnimatedView>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700', 
    textAlign: 'center',
    marginBottom: 20,
    color: '#1f2937',
  },
  titleDark: {
    color: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#6b7280',
  },
  sectionTitleDark: {
    color: '#9ca3af',
  },
  button: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 10, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16,
  },
  link: { 
    marginTop: 16, 
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.3)',
  },
  linkText: { 
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16,
  },
  progressBar: { 
    height: 6, 
    backgroundColor: 'rgba(229, 231, 235, 0.5)', 
    borderRadius: 3, 
    overflow: 'hidden', 
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressLine: { 
    height: 6, 
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  meta: { 
    fontSize: 12, 
    textAlign: 'right',
    color: '#6b7280',
    marginBottom: 10,
  },
  metaDark: {
    color: '#9ca3af',
  },
  timer: { 
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  question: { 
    marginTop: 24, 
    alignSelf: 'center', 
    padding: 20, 
    borderRadius: 16, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    minWidth: '80%',
  },
  questionDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
  },
  questionNumber: { 
    paddingHorizontal: 30,
  },
  questionText: { 
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
  },
  questionTextDark: {
    color: '#f9fafb',
  },
  options: { 
    marginTop: 20, 
    gap: 12,
    paddingHorizontal: 20,
  },
  option: { 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  optionText: { 
    fontSize: 18, 
    fontWeight: '600',
    color: '#1f2937',
  },
  input: { 
    borderWidth: 2, 
    borderColor: '#d1d5db', 
    borderRadius: 12, 
    padding: 16, 
    width: '80%', 
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderColor: '#4b5563',
    color: '#f9fafb',
  },
  inputHint: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputHintDark: {
    color: '#9ca3af',
  },
  percentage: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginVertical: 8,
    color: '#1f2937',
  },
  percentageDark: {
    color: '#f9fafb',
  },
  scoreText: {
    fontSize: 16,
    color: '#374151',
    marginVertical: 4,
  },
  scoreTextDark: {
    color: '#d1d5db',
  },
  timerText: {
    fontSize: 16,
    color: '#6b7280',
    marginVertical: 4,
  },
  timerTextDark: {
    color: '#9ca3af',
  },
  incorrectAnswersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  incorrectAnswer: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  incorrectAnswerDark: {
    color: '#d1d5db',
  },
  questionTimerContainer: {
    marginTop: 28, // опустили ниже на ~20px
    marginBottom: 16,
    alignItems: 'center',
  },
  questionTimerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 8,
  },
  questionTimerTextDark: {
    color: '#f87171',
  },
  questionTimerBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  questionTimerProgress: {
    height: '100%',
    backgroundColor: '#ef4444',
    borderRadius: 4,
  },
  speedModeContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    width: '100%',
  },
  speedModeContainerDark: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderColor: 'rgba(255,255,255,0.06)',
  },
  speedModeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedModeTextContainer: {
    flex: 1,
  },
  speedModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  speedModeTitleDark: {
    color: '#f9fafb',
  },
  speedModeDescription: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  speedModeDescriptionDark: {
    color: '#d1d5db',
    fontWeight: '500',
  },
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingsButtonDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsIcon: {
    fontSize: 16,
  },
  settingsIconDark: {
    color: '#f9fafb',
  },
  settingsContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    width: '100%',
  },
  settingsContainerDark: {
    backgroundColor: 'rgba(17,24,39,0.85)',
    borderColor: 'rgba(255,255,255,0.06)',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingsTextDark: {
    color: '#f9fafb',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
    minWidth: 200,
  },
  dropdownMenuDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 12,
  },
  dropdownTextDark: {
    color: '#f9fafb',
  },
});


