import { useTimer } from 'react-timer-hook';

export default function Timer({ expiryTimestamp, onExpire }) {
  const {
    totalSeconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn('onExpire called');
      onExpire?.();
    },
    interval: 20,
    autoStart: false,
  });

  var myformat = new Intl.NumberFormat('en-US', { 
    minimumIntegerDigits: 2, 
    minimumFractionDigits: 0
});


  return (
    <div className='bg-brand-dark p-4 flex flex-col justify-around items-center text-brand-light text-2xl border rounded-md space-y-5'>
      <h1 className='text-brand-primary text-3xl md:text-5xl'>Timer</h1>
      <div className='md:text-9xl text-7xl'>
       <span>{minutes}</span>:<span>{myformat.format(seconds)}</span>
      </div>
      <div className='flex justify-between flex-col gap-2'>
          <button onClick={start} className='bg-brand-primary border border-brand-primary text-brand-dark rounded-md p-2 cursor-pointer hover:bg-brand-primary/90'>Começar</button>
          <button onClick={pause} className='bg-brand-primary border border-brand-primary text-brand-dark rounded-md p-2 cursor-pointer hover:bg-brand-primary/90'>Pausar</button>
          <button onClick={() => {
            // Restarts to 5 minutes timer
            const time = new Date();
            time.setSeconds(time.getSeconds() + 1800);
            restart(time)
          }} className='bg-brand-primary border border-brand-primary text-brand-dark rounded-md p-2 cursor-pointer hover:bg-brand-primary/90'>Reiniciar</button>
      </div>
    </div>
  );
}

