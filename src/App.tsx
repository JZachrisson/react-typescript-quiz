import React, {useState} from 'react';
import {fetchQuizQuestions} from './API' 
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";
import QuestionCard from './components/QuestionCard';

import {QuestionState, Difficulty} from './API'

import { GlobalStyle, Wrapper } from './App.styles'

const override = css`
display: block;
border-color: #3b84d2;
`;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    try {
      const newQuestions = await fetchQuizQuestions(
        TOTAL_QUESTIONS,
        Difficulty.EASY
      )
  
       setQuestions(newQuestions)
       setScore(0)
       setUserAnswers([])
       setNumber(0) 
       setLoading(false)

    } catch (error) {
      console.log(error)
    }

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      // User answer
      const answer = e.currentTarget.value
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score is answer is correct
      if(correct) setScore(prev => prev + 1)
      // Save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(prev => [...prev, answerObject])
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  };

  const TOTAL_QUESTIONS = 10

  return (
    <>
    <GlobalStyle/>
    <Wrapper>
      <h1>REACT QUIZ</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
            <button onClick={startTrivia} className="start">
            Start
          </button>
      ): null}

      {!gameOver ? <p className="score">Score: {score}</p> : null }
      {loading && <BeatLoader
          css={override}
          size={10}
          loading={loading}
        /> }

        {!loading && !gameOver && (
               <QuestionCard questionNr={number + 1} 
               totalQuestions={TOTAL_QUESTIONS}
               question={questions[number].question}
               answers={questions[number].answers}
               userAnswer={userAnswers ? userAnswers[number] : undefined}
               callback={checkAnswer}
               />
        )}
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
             <button className="next" onClick={nextQuestion}>
             Next Question
           </button>
      ): null
      
      }
 
 </Wrapper>
    </>
  );
};

export default App;
