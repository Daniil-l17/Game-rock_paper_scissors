import { useEffect, useState } from 'react';
import { VariantBot } from './components/VariantBot';

const variants = [
  {
    name: 'paper',
    beat: 'rock',
  },
  {
    name: 'rock',
    beat: 'scissors',
  },
  {
    name: 'scissors',
    beat: 'paper',
  },
] as const;

const audopElement = ['paper.wav', 'rock.wav', 'scissors.wav'] as const;

function App() {
  const [user, setUser] = useState({
    vin: +localStorage.getItem('user')! ?? 0,
    active: '',
  });
  const [bot, setBot] = useState({
    vin: +localStorage.getItem('bot')! ?? 0,
    active: '',
    loading: false,
  });
  const [states, setStates] = useState(1);
  const [loading, setLoading] = useState(true);
  const audio = new Audio(`/assets/${audopElement[states]}`);
  const audioVin = new Audio('/assets/jg-032316-sfx-clapping.mp3');
  const audioLoss = new Audio('/assets/49dfdef97d65e09.mp3');

  useEffect(() => {
    if (user.vin) {
      audioVin.play();
      localStorage.setItem('user', String(user.vin));
    }
  }, [user.vin]);

  useEffect(() => {
    if (bot.vin) {
      audioLoss.play();
      localStorage.setItem('bot', String(bot.vin));
    }
  }, [bot.vin]);

  const clickVariant = () => {
    if (!bot.loading) {
      if (variants.length - 1 !== states) return setStates(prev => prev + 1);
      setStates(0);
    }
  };

  const startBotLoaiding = () => {
    setLoading(false);
    setBot(prev => (prev = { ...prev, loading: true, active: '' }));
    audioVin.pause();
    audioLoss.pause();
  };

  useEffect(() => {
    if (bot.active && !bot.loading) {
      if (variants[states].name === bot.active) return;
      if (variants[states].beat === bot.active)
        return setUser(prev => (prev = { ...prev, vin: prev.vin + 1 }));
      if (variants[states].name !== bot.active)
        return setBot(prev => (prev = { ...prev, vin: prev.vin + 1 }));
    }
  }, [bot.loading]);

  useEffect(() => {
    if (bot.loading) {
      const fun = () => {
        const result = variants[Math.floor(Math.random() * variants.length)];
        setBot(prev => (prev = { ...prev, active: result.name, loading: false }));
      };
      const time = setTimeout(fun, 2000);
      return () => clearTimeout(time);
    }
  }, [bot.loading]);

  useEffect(() => {
    setUser(prev => (prev = { ...prev, active: variants[states].name }));
    audio.play();
  }, [states]);

  return (
    <div className="App">
      <header>
        <h3>
          <span>Вы:</span> <b>{user.vin}</b>
        </h3>
        <h3>VS</h3>
        <h3>
          PC: <b>{bot.vin}</b>
        </h3>
      </header>
      <div className="flex items-center justify-between">
        <img
          onClick={clickVariant}
          className="waiting w-[200px] h-[200px] cursor-pointer"
          src={`/assets/${variants[states].name}.svg`}
          alt=""
        />
        <img
          className="game__arrow"
          src="/assets/arrow-right.svg"
          onClick={startBotLoaiding}
          alt=""
        />
        <VariantBot bot={bot.active} waiting={loading} botLoading={bot.loading} />
      </div>
    </div>
  );
}

export default App;
