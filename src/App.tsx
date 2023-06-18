import React, { useState, useEffect } from 'react';
import { create, useStore } from 'zustand';

type Answer = {
  questionId: number;
  answerId: number;
};

type AppState = {
  currentQuestionId: number;
  answers: Answer[];
  isLocked: boolean;
  setCurrentQuestionId: (currentQuestionId: number) => void;
  setAnswers: (answers: Answer[]) => void;
  setIsLocked: (isLocked: boolean) => void;
};

const useAppStore = create<AppState>((set) => ({
  currentQuestionId: 0,
  answers: [],
  isLocked: false,
  setCurrentQuestionId: (currentQuestionId: number) =>
    set((state) => ({ currentQuestionId })),
  setAnswers: (answers: Answer[]) => set((state) => ({ answers })),
  setIsLocked: (isLocked: boolean) => set((state) => ({ isLocked })),
}));

const SurveyApp: React.FC = () => {
  const [timer, setTimer] = useState(60); // Timer in seconds
  const currentQuestionId = useAppStore((state) => state.currentQuestionId);
  const answers = useAppStore((state) => state.answers);
  const isLocked = useAppStore((state) => state.isLocked);
  const setCurrentQuestionId = useAppStore(
    (state) => state.setCurrentQuestionId
  );
  const setAnswers = useAppStore((state) => state.setAnswers);
  const setIsLocked = useAppStore((state) => state.setIsLocked);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          handleTimeout();
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionId]);

  useEffect(() => {
    useAppStore.setState({ answers });
  }, [answers]);

  const handleSubmit = (questionId: number, answerId: number) => {
    setAnswers([...answers, { questionId, answerId }]);
    setIsLocked(true);
    setTimeout(() => {
      setCurrentQuestionId(currentQuestionId + 1);
      setIsLocked(false);
      setTimer(60); // Reset timer to initial value
    }, 1000);
  };

  const handleTimeout = () => {
    setCurrentQuestionId(currentQuestionId + 1);
    setIsLocked(false);
    setTimer(60); // Reset timer to initial value
  };

  const restartSurvey = () => {
    useAppStore.setState({
      currentQuestionId: 0,
      answers: [],
      isLocked: false,
    });
    setTimer(60);
  };

  const questions = [
    'Pertanyaan 1',
    'Pertanyaan 2',
    'Pertanyaan 3',
    'Pertanyaan 4',
    'Pertanyaan 5',
    'Pertanyaan 6',
    'Pertanyaan 7',
    'Pertanyaan 8',
    'Pertanyaan 9',
    'Pertanyaan 10',
  ];

  const currentQuestion = questions[currentQuestionId];

  if (currentQuestionId >= questions.length || timer === 0) {
    return (
      <div>
        <h1>Halaman Akhir</h1>
        <p>Survei selesai atau waktu habis.</p>
        <button onClick={restartSurvey}>Mulai Ulang Survei</button>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center flex-col'>
      <div className='flex flex-col gap-10'>
        <h1 className='text-6xl'>Survey App</h1>
        <h2>Pertanyaan {currentQuestionId + 1}</h2>
        <p className='text-left w-full'>Timer: {timer} detik</p>

        <p>{currentQuestion}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(currentQuestionId, Number(e.target.answer.value));
          }}
          className='flex flex-col gap-6'>
          <label htmlFor={`answer1`} className='cursor-pointer'>
            <input
              type='radio'
              name={`answer`}
              id={`answer1`}
              value='1'
              disabled={isLocked}
            />
            Jawaban 1
          </label>

          <label htmlFor={`answer2`} className='cursor-pointer'>
            <input
              type='radio'
              name={`answer`}
              id={`answer2`}
              value='2'
              disabled={isLocked}
            />
            Jawaban 2
          </label>

          <label htmlFor={`answer3`} className='cursor-pointer'>
            <input
              type='radio'
              name={`answer`}
              id={`answer3`}
              value='3'
              disabled={isLocked}
            />
            Jawaban 3
          </label>

          <button
            type='submit'
            disabled={isLocked}
            className='px-4 py-2 bg-amber-100'>
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyApp;
