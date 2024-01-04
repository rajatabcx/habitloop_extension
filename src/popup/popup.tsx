import React, { useEffect, useState } from 'react';

const Popup = () => {
  const [hours, setHours] = useState(8);
  const [completed, setCompleted] = useState([]);
  const [hourAvailable, setHourAvailable] = useState(false);

  const handleSave = () => {
    const completed = Array(hours).fill({
      done: false,
      open: false,
    });
    chrome.storage.sync.set(
      {
        hours,
        completed,
        reset: true,
      },
      () => {
        setHourAvailable(true);
        setCompleted(completed);
        chrome.runtime.sendMessage({
          action: 'callMain',
        });
      }
    );
  };

  useEffect(() => {
    chrome.storage.sync.get(['hours', 'completed'], (res) => {
      if (res?.hours) {
        setHours(res.hours);
        setCompleted(res.completed);
        setHourAvailable(true);
      }
    });
  }, []);

  return hourAvailable ? (
    <div className='h-[350px] w-[450px] p-4 bg-[#35363A]'>
      <div className='bg-[#E79548] py-2 px-5 rounded-lg mb-3 text-white text-[18px] font-bold text-center'>
        <h1>
          You have completed{' '}
          {completed.reduce((acc, item) => {
            if (item.done) {
              acc++;
            }
            return acc;
          }, 0)}{' '}
          out of your {hours} walks
        </h1>
      </div>
      <div className='flex gap-2 flex-wrap justify-center mt-4'>
        {completed.map((completed, index) => (
          <div
            key={index}
            className={`h-12 w-4 rounded-md ${
              completed.done ? 'bg-[#E79548]' : 'bg-[#8f8f8f]'
            }`}
          ></div>
        ))}
      </div>
    </div>
  ) : (
    <div className='h-[350px] w-[450px] p-4 bg-[#35363A]'>
      <div className='bg-[#E79548] py-2 px-5 rounded-lg mb-3 text-white text-[18px] font-bold text-center'>
        <h1>How many hours do you work everyday</h1>
      </div>

      <div className='flex justify-around items-center'>
        <button
          onClick={() => setHours((prev) => (prev > 6 ? prev - 1 : prev))}
          disabled={hours === 6}
          className='h-10 w-10 rounded-full bg-[#E79548] text-3xl font-bold disabled:opacity-80 flex text-white items-baseline justify-center'
        >
          -
        </button>
        <p className='text-4xl font-bold text-white'>{hours} hours</p>
        <button
          className='h-10 w-10 rounded-full bg-[#E79548] text-3xl font-bold disabled:opacity-80 flex text-white items-start justify-center'
          onClick={() => setHours((prev) => (prev < 12 ? prev + 1 : prev))}
          disabled={hours === 12}
        >
          +
        </button>
      </div>
      <div className='flex justify-center items-center mt-4'>
        <button
          onClick={handleSave}
          className='px-5 py-2 rounded-lg bg-[#E79548] text-xl font-semibold disabled:opacity-80 flex text-white items-baseline justify-center'
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Popup;
