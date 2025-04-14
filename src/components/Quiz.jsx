import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CountdownOverlay from "./CountdownOverlay";
import { hiraganaData } from "../data/hiragana";
import { katakanaData } from "../data/katakana";
import { dakutenData } from "../data/dakuten";
import { numbersData } from "../data/numbers";
import '../Quiz.css';


const quizSources = {
  hiragana: hiraganaData,
  katakana: katakanaData,
  dakuten: dakutenData,
  numbers: numbersData,
  hiraganaInput: hiraganaData,
  katakanaInput: katakanaData,
  dakutenInput: dakutenData,
  numbersInput: numbersData,
  allkana: [...hiraganaData, ...katakanaData, ...dakutenData],
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const Quiz = () => {
  const { quiz } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [quizStates, setQuizStates] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [pendingStartParams, setPendingStartParams] = useState(null);

  const currentQuizState = quizStates[quiz] || {
    questions: [],
    currentQuestionIndex: 0,
    selectedOption: null,
    score: { correct: 0, incorrect: 0 },
    timeElapsed: 0,
    showResults: false,
    incorrectAnswers: [],
    userAnswer: "",
  };

  const {
    questions,
    currentQuestionIndex,
    selectedOption,
    score,
    timeElapsed,
    showResults,
    incorrectAnswers,
    userAnswer,
  } = currentQuizState;

  const realStartQuiz = (numQuestionsToSet, filterFn = null) => {
    const allData = quizSources[quiz];
    if (!allData) return;

    const filteredData = filterFn ? allData.filter(filterFn) : allData;
    const correctAnswers = filteredData.map((q) => q.correctAnswer);

    const generateOptions = (correct) => {
      const incorrect = correctAnswers
          .filter((ans) => ans !== correct)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      return [...incorrect, correct].sort(() => Math.random() - 0.5);
    };

    const shuffled = [...filteredData]
        .sort(() => Math.random() - 0.5)
        .map((q) => ({
          ...q,
          options: generateOptions(q.correctAnswer),
        }))
        .slice(0, numQuestionsToSet || filteredData.length);

    setQuizStates((prev) => ({
      ...prev,
      [quiz]: {
        questions: shuffled,
        currentQuestionIndex: 0,
        selectedOption: null,
        score: { correct: 0, incorrect: 0 },
        timeElapsed: 0,
        showResults: false,
        incorrectAnswers: [],
        userAnswer: "",
      },
    }));

    setIsStarted(true);
    setIsPaused(false);
  };

  const startQuiz = (numQuestionsToSet, filterFn = null) => {
    setIsStarted(false); // ⬅️ добавляем это!
    setPendingStartParams({ numQuestionsToSet, filterFn });
    setShowCountdown(true);
    setCountdown(3);
  };

  useEffect(() => {
    let countdownInterval;

    if (showCountdown) {
      if (countdown > 0) {
        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setCountdown(0);
              setTimeout(() => {
                setShowCountdown(false);
                if (pendingStartParams) {
                  realStartQuiz(pendingStartParams.numQuestionsToSet, pendingStartParams.filterFn);
                  setPendingStartParams(null);
                }
              }, 1000);
            }
            return prev - 1;
          });
        }, 800);
      }
    }

    return () => clearInterval(countdownInterval);
  }, [showCountdown, countdown]);

  useEffect(() => {
    if (isStarted && !showResults && !isPaused) {
      timerRef.current = setInterval(() => {
        setQuizStates((prev) => {
          const prevQuiz = prev[quiz];
          if (!prevQuiz) return prev;
          return {
            ...prev,
            [quiz]: {
              ...prevQuiz,
              timeElapsed: prevQuiz.timeElapsed + 1,
            },
          };
        });
      }, 800);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, showResults, quiz, isPaused]);

  useEffect(() => {
    if (quizStates[quiz] && !isPaused) {
      setIsStarted(true);
    } else {
      setIsStarted(false);
    }
  }, [quiz]);

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;
    const correct = questions[currentQuestionIndex].correctAnswer;
    const isCorrect = option === correct;

    setQuizStates((prev) => {
      const quizData = prev[quiz];
      const updatedIncorrects = !isCorrect
          ? [...quizData.incorrectAnswers, {
            question: questions[currentQuestionIndex].question,
            yourAnswer: option,
            correctAnswer: correct,
          }]
          : quizData.incorrectAnswers;

      return {
        ...prev,
        [quiz]: {
          ...quizData,
          selectedOption: option,
          score: {
            correct: quizData.score.correct + (isCorrect ? 1 : 0),
            incorrect: quizData.score.incorrect + (isCorrect ? 0 : 1),
          },
          incorrectAnswers: updatedIncorrects,
        },
      };
    });

    setTimeout(() => {
      setQuizStates((prev) => {
        const quizData = prev[quiz];
        const nextIndex = quizData.currentQuestionIndex + 1;

        if (nextIndex < quizData.questions.length) {
          return {
            ...prev,
            [quiz]: {
              ...quizData,
              currentQuestionIndex: nextIndex,
              selectedOption: null,
            },
          };
        } else {
          clearInterval(timerRef.current);
          return {
            ...prev,
            [quiz]: {
              ...quizData,
              showResults: true,
              selectedOption: null,
            },
          };
        }
      });
    }, 700);
  };

  const handleAnswerChange = (event) => {
    const answer = event.target.value;
    setQuizStates((prev) => {
      const quizData = prev[quiz];
      return {
        ...prev,
        [quiz]: {
          ...quizData,
          userAnswer: answer,
        },
      };
    });
  };

  const handleSubmitAnswer = () => {
    const answer = userAnswer.trim().toLowerCase(); // ⬅️ сохраняем перед таймером
    const correct = String(questions[currentQuestionIndex].correctAnswer).trim().toLowerCase();
    const isCorrect = answer === correct;

    setQuizStates((prev) => {
      const quizData = prev[quiz];
      const updatedIncorrects = !isCorrect
          ? [...quizData.incorrectAnswers, {
            question: questions[currentQuestionIndex].question,
            yourAnswer: answer,
            correctAnswer: correct,
          }]
          : quizData.incorrectAnswers;

      return {
        ...prev,
        [quiz]: {
          ...quizData,
          score: {
            correct: quizData.score.correct + (isCorrect ? 1 : 0),
            incorrect: quizData.score.incorrect + (isCorrect ? 0 : 1),
          },
          incorrectAnswers: updatedIncorrects,
        },
      };
    });

    setTimeout(() => {
      setQuizStates((prev) => {
        const quizData = prev[quiz];
        const nextIndex = quizData.currentQuestionIndex + 1;

        if (nextIndex < quizData.questions.length) {
          return {
            ...prev,
            [quiz]: {
              ...quizData,
              currentQuestionIndex: nextIndex,
              userAnswer: "",
            },
          };
        } else {
          clearInterval(timerRef.current);
          return {
            ...prev,
            [quiz]: {
              ...quizData,
              showResults: true,
              userAnswer: "",
            },
          };
        }
      });
    }, 700);
  };


  if (!quizSources[quiz]) return <p>Квиз не найден.</p>;

  if (!isStarted) {
    return (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          {showCountdown && <CountdownOverlay countdown={countdown} />}


          <h2>Вы готовы начать тест по {
            quiz === 'hiragana' ? 'хирагане' :
                quiz === 'hiraganaInput' ? 'хирагане (ввод)' :
                quiz === 'katakana' ? 'катакане' :
                    quiz === 'katakanaInput' ? 'катакане (ввод)' :
                    quiz === 'dakuten' ? 'дакутэн/хандакутэн' :
                        quiz === 'dakutenInput' ? 'дакутэн/хандакутэн (ввод)' :
                        quiz === 'allkana' ? 'всем символам каны' :
                            quiz === 'numbers' ? 'числительным' :
                                quiz === 'numbersInput' ? 'числительным (ввод)' :
                                    'кане (ввод)'}</h2>

          {(quiz === "numbers" || quiz === "numbersInput") ? (
              <div className="button-wrapper">
                <button className="quiz-button" onClick={() => startQuiz(20, (q) => +q.correctAnswer <= 10)}>
                  От 1 до 10
                </button>
                <button className="quiz-button" onClick={() => startQuiz(20, (q) => +q.correctAnswer > 10)}>
                  От 10 до 100
                </button>
              </div>
          ) : (
              <div className="button-wrapper">
                <button className="quiz-button" onClick={() => startQuiz(quiz === 'allkana' ? 30 : 15)}>
                  {quiz === 'allkana' ? "30 случайных вопросов" : "15 случайных вопросов"}
                </button>
                <button className="quiz-button" onClick={() => startQuiz(null)}>Все вопросы</button>
                <button
                    className="quiz-button"
                    onClick={() => navigate('/quiz/hiragana/table')}
                    style={{marginBottom: '1rem'}}
                >
                  Таблица Хираганы
                </button>
              </div>
          )}
        </div>
    );
  }

  if (questions.length === 0) return <p>Загрузка вопросов...</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
      <div style={{ marginBottom: "20px" }}>
        <div className="progressBar">
          <div className="progressBar-line"
               style={{
                 width: `${
                     showResults ? 100 : (currentQuestionIndex / questions.length) * 100
                 }%`,
               }}
          />
        </div>
        <p style={{ fontSize: "14px", textAlign: "right", marginTop: "4px" }}>
          Вопрос {currentQuestionIndex + 1} из {questions.length}
          <span style={{ float: "left" }}>⏱️ {formatTime(timeElapsed)}</span>
        </p>

        {showResults ? (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <h2>Результаты</h2>
              <p>👍 Правильно: {score.correct}</p>
              <p>👎 Неправильно: {score.incorrect}</p>
              <p>⏱️ Время: {formatTime(timeElapsed)}</p>

              {incorrectAnswers.length > 0 && (
                  <div style={{ marginTop: "30px", textAlign: "left", maxWidth: "600px", marginInline: "auto" }}>
                    <h3 className="mistakes-title">Ошибки:</h3>
                    <ul className="mistakes-list">
                      {incorrectAnswers.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: "10px" }}>
                            <strong>{item.question}</strong>: ваш ответ – <span style={{ color: "red" }}>{item.yourAnswer}</span>, правильный – <span style={{ color: "green" }}>{item.correctAnswer}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              <div style={{ marginTop: "30px" }}>
                <div className='title-reload'>Хотите попробовать снова?</div>
                <div className="button-wrapper">
                  {(quiz === "numbers" || quiz === "numbersInput") ? (
                      <>
                        <button className="quiz-button" onClick={() => startQuiz(20, (q) => +q.correctAnswer <= 10)}>
                          От 1 до 10
                        </button>
                        <button className="quiz-button" onClick={() => startQuiz(20, (q) => +q.correctAnswer > 10)}>
                          От 10 до 100
                        </button>
                      </>
                  ) : (
                      <>
                        <button className="quiz-button" onClick={() => startQuiz(quiz === 'allkana' ? 30 : 15)}>
                          {quiz === 'allkana' ? "30 случайных вопросов" : "15 случайных вопросов"}
                        </button>
                        <button className="quiz-button" onClick={() => startQuiz(null)}>Все вопросы</button>
                      </>
                  )}
                </div>
              </div>
            </div>
        ) : (
            <>
              <div className={`qiuz-question${quiz === "numbers" ? " qiuz-question-number" : ""}`}>
                {quiz === "hiraganaInput" || quiz === "numbersInput" || quiz === "katakanaInput" || quiz === "dakutenInput"
                    ? `${currentQuestion.question}`
                    : quiz === "numbers"
                        ? `${currentQuestion.question} (${currentQuestion.reading})`
                        : currentQuestion.question}
              </div>

              {quiz === "hiraganaInput" || quiz === "numbersInput" || quiz === "katakanaInput" || quiz === "dakutenInput" ? (
                  <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <input
                        type="text"
                        value={userAnswer}
                        placeholder="Ваш ответ"
                        style={{
                          padding: "10px",
                          fontSize: "18px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          marginBottom: "20px",
                          marginRight: "10px",
                        }}
                        onChange={handleAnswerChange}
                    />
                    <button className="quiz-button" onClick={handleSubmitAnswer}>
                      Ответить
                    </button>
                  </div>
              ) : (
                  <div className="quiz-cards"
                  >
                    {currentQuestion.options.map((option, index) => {
                      let bg = "#e6effe";
                      let clr = "#222";

                      if (selectedOption) {
                        if (option === currentQuestion.correctAnswer) {
                          bg = "#10b981";
                          clr = "#fff";
                        } else if (option === selectedOption) {
                          bg = "#ef4444";
                          clr = "#fff";
                        }
                      }

                      return (
                          <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className="quiz-option"
                              style={{
                                backgroundColor: bg,
                                color: clr,
                              }}
                              disabled={!!selectedOption}
                          >
                            {option}
                          </button>
                      );
                    })}
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default Quiz;
