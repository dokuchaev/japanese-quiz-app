import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Dimensions,
  Image,
} from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { useStats } from '../components/StatsContext';
import AnimatedView from '../components/AnimatedView';
import ResultAnimation from '../components/ResultAnimation';
import { questionsData } from '../data/questions';
import { updateStatsAfterTest, updateSymbolStats, updateDailyStats } from '../utils/statsManagerSwitch';
import { hiraganaData } from '../data/hiragana';
import { katakanaData } from '../data/katakana';
import { dakutenData } from '../data/dakuten';
import { numbersData as numbersDataQuiz } from '../data/numbers';


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
  const { refreshStats } = useStats();
  const [speedMode, setSpeedMode] = useState(false);
  const [randomMode, setRandomMode] = useState(true); // 3 случайных символа
  const [allSymbolsMode, setAllSymbolsMode] = useState(false); // все символы
  const [expandedBlocks, setExpandedBlocks] = useState({
    correct: false,
    incorrect: false,
  });
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

  const resetQuizState = () => {
    setState({
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
      questionTimer: speedMode ? (quiz.includes('Input') ? 5 : 3) : 3,
      questionTimerActive: false,
    });
    setExpandedBlocks({ correct: false, incorrect: false });
    if (timerRef.current) clearInterval(timerRef.current);
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
  };

  const toggleBlock = (blockType) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockType]: !prev[blockType]
    }));
  };

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

  // Функции для обработки переключателей режимов тестирования
  const handleRandomMode = (value) => {
    if (value) {
      setRandomMode(true);
      setAllSymbolsMode(false);
    } else {
      // Нельзя выключить, если другой тоже выключен
      if (!allSymbolsMode) {
        return; // Игнорируем попытку выключить
      }
      setRandomMode(false);
    }
  };

  const handleAllSymbolsMode = (value) => {
    if (value) {
      setAllSymbolsMode(true);
      setRandomMode(false);
    } else {
      // Нельзя выключить, если другой тоже выключен
      if (!randomMode) {
        return; // Игнорируем попытку выключить
      }
      setAllSymbolsMode(false);
    }
  };

  // Функция запуска теста с выбранными опциями
  const startTestWithOptions = () => {
    // Убеждаемся, что хотя бы один режим выбран
    if (!randomMode && !allSymbolsMode) {
      // Если оба выключены, включаем случайный режим по умолчанию
      setRandomMode(true);
      return;
    }

    if (isNumbersQuiz) {
      // Для числительных используем старую логику с диапазонами
      if (randomMode) {
        startQuiz(20, (q) => +q.correctAnswer <= 10);
      } else if (allSymbolsMode) {
        startQuiz(20, (q) => +q.correctAnswer > 10);
      }
    } else {
      // Для каны используем новую логику
      if (randomMode) {
        startQuiz(quiz === 'allkana' ? 30 : 3);
      } else if (allSymbolsMode) {
        startQuiz(null);
      }
    }
  };

  // Функция для сохранения статистики после завершения теста
  const saveTestStats = async () => {
    if (!state.showResults || state.questions.length === 0) return;

    try {
      // Сохраняем общую статистику
      const testResults = {
        correct: state.score.correct,
        incorrect: state.score.incorrect,
        timeElapsed: state.timeElapsed,
        quizType: quiz,
        accuracy: Math.round((state.score.correct / (state.score.correct + state.score.incorrect)) * 100),
      };

      const updatedStats = await updateStatsAfterTest(testResults);
      if (!updatedStats) {
        console.warn('Failed to update stats');
        return;
      }

      // Сохраняем статистику по символам
      if (state.incorrectAnswers.length > 0) {
        for (const answer of state.incorrectAnswers) {
          await updateSymbolStats(answer.question, false);
        }
      }

      // Сохраняем статистику правильных ответов (все вопросы минус неправильные)
      const correctAnswers = state.questions.filter((q) =>
        !state.incorrectAnswers.some((incorrect) => incorrect.question === q.question)
      );

      for (const question of correctAnswers) {
        await updateSymbolStats(question.question, true);
      }

      // Обновляем дневную статистику
      await updateDailyStats(testResults);

      // Обновляем контекст статистики для UI с небольшой задержкой
      setTimeout(() => {
        refreshStats();
      }, 100);

    } catch (error) {
      console.error('Error saving test stats:', error);
    }
  };

  const showEmotionAnimation = () => {
    setState(prev => ({ ...prev, showEmotionAnimation: true }));
    // Автоматически скрываем анимацию через 3 секунды
    setTimeout(() => {
      hideEmotionAnimation();
      setState(prev => ({ ...prev, showResults: true }));
    }, 3000);
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

  // Сохранение статистики при показе результатов
  useEffect(() => {
    if (state.showResults) {
      saveTestStats();
    }
  }, [state.showResults]);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, []);

  // Гарантируем, что всегда выбран хотя бы один режим тестирования
  useEffect(() => {
    if (!randomMode && !allSymbolsMode) {
      setRandomMode(true);
    }
  }, [randomMode, allSymbolsMode]);

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
      style={[
        styles.container, 
        theme === 'dark' && styles.containerDark,
        { backgroundColor: theme === 'dark' ? '#111827' : '#f8fafc' }
      ]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* Анимация результатов */}
      {state.showEmotionAnimation && (
        <ResultAnimation
          result={state.finalResult}
          onAnimationComplete={() => {
            hideEmotionAnimation();
            setState(prev => ({ ...prev, showResults: true }));
          }}
        />
      )}
      <ScrollView 
        style={[styles.scrollView, theme === 'dark' && styles.scrollViewDark]}
        contentContainerStyle={[styles.contentContainer, theme === 'dark' && styles.contentContainerDark]}
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
            <View style={styles.metaContainer}>
              <Text style={[styles.timer, theme === 'dark' && styles.timerDark]}>
                ⏱ {formatTime(state.timeElapsed)}
              </Text>
              <Text style={[styles.meta, theme === 'dark' && styles.metaDark]}>
                Вопрос {state.currentQuestionIndex + 1} из {state.questions.length}
              </Text>
            </View>
          </>
        )}

        {!state.started ? (
          <AnimatedView animationType="fadeIn" duration={500}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              {/* Заголовок по центру */}
              <Text style={[styles.title, theme === 'dark' && styles.titleDark]}>
                Тест по {isInputQuiz ? getInputQuizTitle() : getQuizTitle()}
              </Text>
              
              <View style={{ width: '100%', marginTop: 20 }}>
                {/* Переключатель режима случайных символов */}
                <View style={[styles.testModeToggle, theme === 'dark' && styles.testModeToggleDark]}>
                  <View style={styles.testModeInfo}>
                    <Image 
                      source={require('../../assets/icons/game-kost.png')}
                      style={styles.testModeIcon}
                    />
                    <View style={styles.testModeTextContainer}>
                      <Text style={[styles.testModeLabel, theme === 'dark' && styles.testModeLabelDark]}>
                        {isNumbersQuiz ? 'От 1 до 10' : (quiz === 'allkana' ? '30 случайных символов' : '3 случайных символа')}
                      </Text>
                                       <Text style={[styles.testModeDescription, theme === 'dark' && styles.testModeDescriptionDark]}>
                   {isNumbersQuiz ? 'Простые числа' : 'Быстрый тест (3 вопроса)'}
                 </Text>
                    </View>
                  </View>
                  <Switch
                    value={randomMode}
                    onValueChange={handleRandomMode}
                    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                    thumbColor={randomMode ? '#ffffff' : '#ffffff'}
                  />
                </View>

                {/* Переключатель режима всех символов */}
                <View style={[styles.testModeToggle, theme === 'dark' && styles.testModeToggleDark]}>
                  <View style={styles.testModeInfo}>
                    {theme === 'dark' ? (
                      <Image 
                        source={require('../../assets/icons/hiragana-k-white.png')}
                        style={styles.testModeIcon}
                      />
                    ) : (
                      <Image 
                        source={require('../../assets/icons/hiragana-k.png')}
                        style={styles.testModeIcon}
                      />
                    )}
                    <View style={styles.testModeTextContainer}>
                      <Text style={[styles.testModeLabel, theme === 'dark' && styles.testModeLabelDark]}>
                        {isNumbersQuiz ? 'От 10 до 100' : 'Все символы'}
                      </Text>
                      <Text style={[styles.testModeDescription, theme === 'dark' && styles.testModeDescriptionDark]}>
                        {isNumbersQuiz ? 'Сложные числа' : 'Полный тест'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={allSymbolsMode}
                    onValueChange={handleAllSymbolsMode}
                    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                    thumbColor={allSymbolsMode ? '#ffffff' : '#ffffff'}
                  />
                </View>

                {/* Переключатель режима скорости */}
                <View style={[styles.testModeToggle, theme === 'dark' && styles.testModeToggleDark]}>
                  <View style={styles.testModeInfo}>
                    <Text style={[styles.testModeIcon, theme === 'dark' && styles.testModeIconDark]}>
                      ⚡
                    </Text>
                    <View style={styles.testModeTextContainer}>
                      <Text style={[styles.testModeLabel, theme === 'dark' && styles.testModeLabelDark]}>
                        Режим скорости
                      </Text>
                      <Text style={[styles.testModeDescription, theme === 'dark' && styles.testModeDescriptionDark]}>
                        {isInputQuiz ? '5 секунд на ответ' : '3 секунды на ответ'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={speedMode}
                    onValueChange={setSpeedMode}
                    trackColor={{ false: '#e5e7eb', true: '#10b981' }}
                    thumbColor={speedMode ? '#ffffff' : '#ffffff'}
                  />
                </View>

                {/* Кнопка "Начать тест" */}
                <Pressable 
                  style={[styles.startTestButton, theme === 'dark' && styles.startTestButtonDark]} 
                  onPress={startTestWithOptions}
                >
                  <Text style={styles.startTestButtonText}>
                    Начать тест
                  </Text>
                </Pressable>
                
                {/* Отступ между кнопками */}
                <View style={styles.buttonSpacer} />
                
                {isNumbersQuiz ? (
                  <Pressable style={styles.button} onPress={() => navigation.navigate('NumbersTable', { range: 'all' })}>
                    <Text style={styles.buttonText}>Открыть таблицу числительных</Text>
                  </Pressable>
                ) : (
                  <>
                    {(quiz === 'hiragana' || quiz === 'hiraganaInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'hiragana' })}>
                        <Text style={styles.buttonText}>Открыть таблицу Хираганы</Text>
                      </Pressable>
                    )}
                    {(quiz === 'katakana' || quiz === 'katakanaInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'katakana' })}>
                        <Text style={styles.buttonText}>Открыть таблицу Катаканы</Text>
                      </Pressable>
                    )}
                    {(quiz === 'dakuten' || quiz === 'dakutenInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'dakuten' })}>
                        <Text style={styles.buttonText}>Открыть таблицу Дакутен/хандакутэн</Text>
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

              {/* Блок с ошибками */}
              {state.incorrectAnswers.length > 0 && (
                <View style={[styles.mistakesBlock, theme === 'dark' && styles.mistakesBlockDark]}>
                  <Pressable 
                    style={styles.blockHeader} 
                    onPress={() => toggleBlock('incorrect')}
                  >
                    <Text style={[styles.mistakesTitle, theme === 'dark' && styles.mistakesTitleDark]}>
                      ❌ Ошибки ({state.score.incorrect})
                    </Text>
                    <Text style={styles.expandIcon}>
                      {expandedBlocks.incorrect ? '▼' : '▶'}
                    </Text>
                  </Pressable>
                  
                  {expandedBlocks.incorrect && (
                    <View style={styles.blockContent}>
                      {state.incorrectAnswers.map((item, index) => (
                        <View key={index} style={[styles.mistakeItem, theme === 'dark' && styles.mistakeItemDark]}>
                          <Text style={[styles.mistakeSymbol, theme === 'dark' && styles.mistakeSymbolDark]}>
                            {item.question}
                          </Text>
                          <Text style={[styles.mistakeDetails, theme === 'dark' && styles.mistakeDetailsDark]}>
                            {item.yourAnswer === 'Время истекло' ? '⏰ Время истекло' : `Ваш ответ: ${item.yourAnswer || 'не указан'}`}
                          </Text>
                          <Text style={[styles.mistakeCorrect, theme === 'dark' && styles.mistakeCorrectDark]}>
                            Правильно: {item.correctAnswer}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Блок с правильными ответами */}
              {state.score.correct > 0 && (
                <View style={[styles.correctBlock, theme === 'dark' && styles.correctBlockDark]}>
                  <Pressable 
                    style={styles.blockHeader} 
                    onPress={() => toggleBlock('correct')}
                  >
                    <Text style={[styles.correctTitle, theme === 'dark' && styles.correctTitleDark]}>
                      ✅ Правильные ответы ({state.score.correct})
                    </Text>
                    <Text style={styles.expandIcon}>
                      {expandedBlocks.correct ? '▼' : '▶'}
                    </Text>
                  </Pressable>
                  
                  {expandedBlocks.correct && (
                    <View style={styles.blockContent}>
                      {state.questions
                        .filter((item) => {
                          // Проверяем, что этот вопрос не в списке ошибок
                          return !state.incorrectAnswers.some(inc => 
                            inc.question === item.question
                          );
                        })
                        .map((item, index) => (
                          <View key={index} style={[styles.mistakeItem, styles.correctItem, theme === 'dark' && styles.mistakeItemDark]}>
                            <Text style={[styles.mistakeSymbol, styles.correctSymbol, theme === 'dark' && styles.mistakeSymbolDark]}>
                              {item.question}
                            </Text>
                            <Text style={[styles.mistakeCorrect, styles.correctAnswer, theme === 'dark' && styles.mistakeCorrectDark]}>
                              Правильно: {item.correctAnswer}
                            </Text>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              )}

              <View style={{ gap: 16, marginTop: 20, width: '100%' }}>
                {/* Кнопки для страницы результатов */}
                {isNumbersQuiz ? (
                  <Pressable style={styles.button} onPress={() => navigation.navigate('NumbersTable', { range: 'all' })}>
                    <Text style={styles.buttonText}>Повторить числительные</Text>
                  </Pressable>
                ) : (
                  <>
                    {(quiz === 'hiragana' || quiz === 'hiraganaInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'hiragana' })}>
                        <Text style={styles.buttonText}>Повторить хирагану</Text>
                      </Pressable>
                    )}

                    {(quiz === 'katakana' || quiz === 'katakanaInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'katakana' })}>
                        <Text style={styles.buttonText}>Повторить катакану</Text>
                      </Pressable>
                    )}

                    {(quiz === 'dakuten' || quiz === 'dakutenInput') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'dakuten' })}>
                        <Text style={styles.buttonText}>Повторить дакутэн/хандакутэн</Text>
                      </Pressable>
                    )}

                    {(quiz === 'allkana') && (
                      <Pressable style={styles.button} onPress={() => navigation.navigate('KanaTable', { quiz: 'hiragana' })}>
                        <Text style={styles.buttonText}>Повторить кану</Text>
                      </Pressable>
                    )}
                  </>
                )}

                {/* Кнопка "Попробовать снова" */}
                <Pressable style={[styles.button, { backgroundColor: '#10b981' }]} onPress={resetQuizState}>
                  <Text style={styles.buttonText}>Попробовать снова</Text>
                </Pressable>

                {/* Кнопка "На главную" */}
                <Pressable style={[styles.button, { backgroundColor: '#6b7280' }]} onPress={() => navigation.navigate('Home')}>
                  <Text style={styles.buttonText}>На главную</Text>
                </Pressable>
              </View>
            </View>
          </AnimatedView>
        ) : currentQuestion ? (
          <>
            <AnimatedView animationType="fadeIn" duration={400}>
              <View style={[styles.questionContainer, (quiz === 'numbers') && styles.questionNumber, theme === 'dark' && styles.questionContainerDark]}>
                {/* Вопрос */}
                <View style={styles.questionSection}>
                  <Text style={[styles.questionText, theme === 'dark' && styles.questionTextDark]}>
                    {quiz === 'numbers' ? `${currentQuestion?.question} (${currentQuestion?.reading})` : currentQuestion?.question}
                  </Text>
                </View>

                {/* Ответы */}
                <AnimatedView animationType="slideIn" duration={500} delay={200}>
                  {'options' in currentQuestion && !isInputQuiz ? (
                    <View style={styles.optionsGrid}>
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
                          <Pressable key={index} onPress={() => handleOptionClick(option)} style={[styles.optionGrid, { backgroundColor: bg }]} disabled={!!state.selectedOption}>
                            <Text style={[styles.optionText, { color: clr }]}>{String(option)}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.inputSection}>
                      <TextInput
                        value={state.userAnswer}
                        onChangeText={(t) => setState((prev) => ({ ...prev, userAnswer: t }))}
                        placeholder={isNumbersQuiz ? 'Введите число (например: 5)' : 'Введите чтение каны (например: a)'}
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
              </View>
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
    flex: 1,
  },
  scrollView: {
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  scrollViewDark: {
    backgroundColor: '#111827',
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f8fafc',
  },
  contentContainerDark: {
    backgroundColor: '#111827',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    textAlign: 'center',
    marginBottom: 0,
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
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  meta: { 
    fontSize: 12, 
    textAlign: 'right',
    color: '#6b7280',
  },
  metaDark: {
    color: '#9ca3af',
  },
  timer: { 
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  timerDark: {
    color: '#60a5fa',
  },
  questionContainer: { 
    marginTop: 24, 
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
    minHeight: 120,
  },
  questionContainerDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
  },
  question: { 
    marginTop: 24, 
    padding: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
    minHeight: 120,
  },
  questionDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
  },
  questionSection: {
    marginBottom: 24,
  },
  questionNumber: { 
    paddingHorizontal: 30,
  },
  questionText: { 
    fontSize: 80,
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
    fontSize: 28, 
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  inputSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  input: { 
    borderWidth: 2, 
    borderColor: '#d1d5db', 
    borderRadius: 12, 
    padding: 16, 
    width: '100%', 
    marginBottom: 16,
    fontSize: 16,
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
  mistakesBlock: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  mistakesBlockDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  mistakesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 0,
    lineHeight: 24,
    textAlignVertical: 'center',
  },
  mistakesTitleDark: {
    color: '#f87171',
  },
  mistakeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  mistakeItemDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.9)',
    borderLeftColor: '#f87171',
  },
  mistakeSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  mistakeSymbolDark: {
    color: '#f9fafb',
  },
  mistakeDetails: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  mistakeDetailsDark: {
    color: '#f87171',
  },
  mistakeCorrect: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
    fontWeight: '600',
  },
  mistakeCorrectDark: {
    color: '#34d399',
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    minHeight: 50,
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b7280',
    lineHeight: 24,
    textAlignVertical: 'center',
  },
  blockContent: {
    marginTop: 8,
  },
  correctItem: {
    borderLeftColor: '#10b981',
  },
  correctSymbol: {
    color: '#10b981',
  },
  correctAnswer: {
    color: '#10b981',
  },
  correctBlock: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  correctBlockDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  correctTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 0,
    lineHeight: 24,
    textAlignVertical: 'center',
  },
  correctTitleDark: {
    color: '#34d399',
  },
  questionTimerContainer: {
    marginTop: 20,
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
  headerWithSpeedToggle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    gap: 12,
  },
  compactSpeedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 140,
  },
  compactSpeedToggleDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  speedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  speedLabelDark: {
    color: '#f9fafb',
  },
  smallSwitch: {
    transform: [{ scale: 0.8 }],
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
  speedIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  speedIconButton: {
    padding: 4,
  },
  speedIconButtonActive: {
    backgroundColor: '#10b981',
  },
  speedIconButtonDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  speedIcon: {
    fontSize: 20,
    color: '#1f2937',
  },
  speedIconActive: {
    color: '#fff',
  },
  speedIconDark: {
    color: '#f9fafb',
  },
  speedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  speedButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  speedButtonDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  speedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  speedButtonTextActive: {
    color: '#ffffff',
  },
  speedButtonTextDark: {
    color: '#f9fafb',
  },
  speedInfo: {
    flex: 1,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#1f2937',
  },
  speedIconDark: {
    color: '#f9fafb',
  },
  speedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  speedLabelDark: {
    color: '#f9fafb',
  },
  speedDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  speedDescriptionDark: {
    color: '#9ca3af',
  },
  detailedSpeedToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    width: '100%',
  },
  detailedSpeedToggleDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  speedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  speedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  speedTitleDark: {
    color: '#f9fafb',
  },
  speedExplanation: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  speedExplanationDark: {
    color: '#d1d5db',
  },
  fullWidthSpeedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidthSpeedToggleDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  speedTextContainer: {
    flex: 1,
  },
  testModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  testModeToggleDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  testModeInfo: {
    flex: 1,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  testModeIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },

  testModeTextContainer: {
    flex: 1,
  },
  testModeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  testModeLabelDark: {
    color: '#f9fafb',
  },
  testModeDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  testModeDescriptionDark: {
    color: '#9ca3af',
  },
  startTestButton: {
    backgroundColor: '#10b981',
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
  startTestButtonDark: {
    backgroundColor: '#059669',
  },
  startTestButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonSpacer: {
    height: 20,
  },
  optionsGrid: {
    marginTop: 0,
    paddingHorizontal: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },
  optionGrid: {
    width: '45%',
    paddingVertical: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    minHeight: 120,
    marginBottom: 0,
  },


});


