import React, { useEffect, useState } from 'react';
import Timer from './timer';

const startingHour = 10;

const getNumberString = (num) => {
  switch (num) {
    case 1:
      return num + 'st';
    case 2:
      return num + 'nd';
    case 3:
      return num + 'rd';
    default:
      return num + 'th';
  }
};

const Options = () => {
  const [seconds, setSeconds] = useState(60);
  const [index, setIndex] = useState<number | null>(null);

  const [start, setState] = useState(false);

  const handleStateUpdate = () => {
    chrome.storage.sync.get(['hours', 'completed', 'reset'], (res) => {
      chrome.storage.sync.set(
        {
          hours: res.hours,
          completed: res.completed.map((item, idx) =>
            index === idx ? { ...item, open: true, done: true } : { ...item }
          ),
          reset: index === res.completed.length - 1 ? false : res.reset,
        },
        () => {}
      );
    });
  };

  useEffect(() => {
    if (start) {
      if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        handleStateUpdate();
      }
    }
  }, [seconds, start]);

  useEffect(() => {
    const idx = Math.round(window.screenTop / 10);
    console.log(window.screenTop);
    console.log(idx);
    setIndex(idx);
    setTimeout(() => {
      chrome.runtime.sendMessage({ action: 'removeWindow' });
    }, 300000);
  }, []);

  return (
    <div className='h-screen w-full p-4 bg-[#35363A]'>
      <div className='bg-[#E79548] py-2 px-5 rounded-lg mb-3 text-white text-[18px] font-bold text-center'>
        {seconds === 0 ? (
          <>
            <h1>
              Congratulations, you have completed {getNumberString(index + 1)}{' '}
              walk successfully
            </h1>
            <h1>This is your {index + startingHour}:55 AM walk</h1>
          </>
        ) : (
          <>
            <h1>Take a brief 1 minute walk</h1>
            <h1>This is your {index + startingHour}:55 AM walk</h1>
          </>
        )}
      </div>
      {seconds === 0 ? null : (
        <>
          <div className='flex justify-center items-center '>
            <Timer percentage={seconds * (10 / 6)} />
          </div>
          <div className='flex justify-center items-center my-4'>
            <button
              disabled={start || index === null}
              onClick={() => setState(true)}
              className='px-5 py-2 rounded-lg bg-[#E79548] text-xl font-semibold disabled:opacity-80 flex text-white items-baseline justify-center'
            >
              Start
            </button>
          </div>
          <p className='text-white text-[14px] font-bold text-center'>
            This window will auto close in 5 minutes
          </p>
        </>
      )}
    </div>
  );
};

export default Options;
