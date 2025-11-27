import { useState, useMemo } from 'react';
import quizData from '../data/questions.json';
import type { QuizData, MonkeyType, AnswerValue, MonkeyProfile } from '../types/quiz';
import { ANSWER_OPTIONS } from '../types/quiz';

const data = quizData as QuizData;

type QuizState = 'intro' | 'playing' | 'result';

export function Quiz() {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});

  const handleAnswer = (value: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [data.questions[currentQuestion].id]: value
    }));

    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setState('result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const result = useMemo(() => {
    if (state !== 'result') return null;

    const scores: Record<MonkeyType, number> = {
      chimpanzee: 0,
      bonobo: 0,
      gorilla: 0,
      orangutan: 0,
      gibbon: 0,
      capuchin: 0,
      macaque: 0,
      baboon: 0,
      tamarin: 0,
      mandrill: 0,
    };

    for (const question of data.questions) {
      const answerValue = answers[question.id] ?? 0;
      for (const [monkey, weight] of Object.entries(question.scores)) {
        scores[monkey as MonkeyType] += weight * answerValue;
      }
    }

    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const [topMonkey] = sortedScores[0];

    return {
      monkeyType: topMonkey as MonkeyType,
      profile: data.monkeyTypes[topMonkey as MonkeyType],
      allScores: sortedScores,
    };
  }, [state, answers]);

  const handleRestart = () => {
    setState('intro');
    setCurrentQuestion(0);
    setAnswers({});
  };

  if (state === 'intro') {
    return <IntroScreen onStart={() => setState('playing')} />;
  }

  if (state === 'result' && result) {
    return <ResultScreen result={result} onRestart={handleRestart} />;
  }

  const question = data.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / data.questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="question-counter">
        Question {currentQuestion + 1} / {data.questions.length}
      </div>
      <div className="question-card">
        <p className="question-text">{question.text}</p>
        <div className="answers">
          {ANSWER_OPTIONS.map((option) => (
            <button
              key={option.value}
              data-value={option.value}
              className={`answer-btn ${answers[question.id] === option.value ? 'selected' : ''}`}
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {currentQuestion > 0 && (
        <button className="nav-btn" onClick={handlePrevious}>
          Question précédente
        </button>
      )}
    </div>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="intro-screen">
      <h1>Quel singe es-tu ?</h1>
      <p className="intro-subtitle">
        Découvre quel primate sommeille en toi à travers 15 questions sur ta personnalité,
        ta vie sociale et tes relations.
      </p>
      <div className="monkey-preview">
        {Object.values(data.monkeyTypes).map((monkey) => (
          <span key={monkey.name} className="monkey-emoji" title={monkey.name}>
            {monkey.emoji}
          </span>
        ))}
      </div>
      <button className="start-btn" onClick={onStart}>
        Commencer le quiz
      </button>
    </div>
  );
}

interface ResultProps {
  result: {
    monkeyType: MonkeyType;
    profile: MonkeyProfile;
    allScores: [string, number][];
  };
  onRestart: () => void;
}

function ResultScreen({ result, onRestart }: ResultProps) {
  const { profile, allScores } = result;

  return (
    <div className="result-screen">
      <h2>Tu es un...</h2>
      <div className="result-monkey">
        <span className="result-emoji">{profile.emoji}</span>
        <h1 className="result-name">{profile.name}</h1>
      </div>
      <p className="result-description">{profile.description}</p>
      <div className="traits">
        {profile.traits.map((trait) => (
          <span key={trait} className="trait-badge">
            {trait}
          </span>
        ))}
      </div>
      <div className="scores-breakdown">
        <h3>Tes affinités avec les autres singes</h3>
        <div className="score-bars">
          {allScores.map(([monkey, score]) => {
            const monkeyProfile = data.monkeyTypes[monkey as MonkeyType];
            const maxPossibleScore = 30;
            const normalizedScore = Math.max(0, ((score + maxPossibleScore) / (2 * maxPossibleScore)) * 100);
            return (
              <div key={monkey} className="score-row">
                <span className="score-label">
                  {monkeyProfile.emoji} {monkeyProfile.name}
                </span>
                <div className="score-bar-bg">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${normalizedScore}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button className="restart-btn" onClick={onRestart}>
        Recommencer le quiz
      </button>
    </div>
  );
}
