import { useEffect, useState } from 'react';

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
];

function VariantBot({
  waiting,
  botLoading,
  bot,
}: {
  waiting: boolean;
  botLoading: boolean;
  bot: string;
}) {
  if (waiting) {
    return (
      <svg
        className="w-[150px] waiting h-[150px] cursor-pointer"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg">
        <g>
          <g>
            <path d="M16,1C7.7157202,1,1,7.7157202,1,16s6.7157202,15,15,15s15-6.7157192,15-15S24.2842808,1,16,1z M16,27.7857151    C9.4909277,27.7857151,4.2142859,22.5090733,4.2142859,16S9.4909277,4.2142859,16,4.2142859S27.7857151,9.4909277,27.7857151,16    S22.5090733,27.7857151,16,27.7857151z" />
          </g>
          <g>
            <path d="M22.5761719,22.1396484c-0.2148438,0-0.4316406-0.0693359-0.6152344-0.2119141l-6.5771484-5.1396484    C15.1416016,16.5986328,15,16.3076172,15,16V9.4228516c0-0.5522461,0.4472656-1,1-1s1,0.4477539,1,1v6.0893555    l6.1933594,4.8393555c0.4345703,0.340332,0.5117188,0.96875,0.171875,1.4038086    C23.1679688,22.0078125,22.8740234,22.1396484,22.5761719,22.1396484z" />
          </g>
        </g>
      </svg>
    );
  }

  if (botLoading) {
    return <img className="thinking" src="/assets/loading.svg" />;
  }

  return (
    <img className="waiting w-[200px] h-[200px] cursor-pointer" src={`/assets/${bot}.svg`} alt="" />
  );
}

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

  useEffect(() => {
    if (user.vin) {
      localStorage.setItem('user', String(user.vin));
    }
  }, [user.vin]);

  useEffect(() => {
    if (bot.vin) {
      localStorage.setItem('bot', String(bot.vin));
    }
  }, [bot.vin]);

  const clicks = () => {
    if (!bot.loading) {
      if (variants.length - 1 !== states) return setStates(prev => prev + 1);
      setStates(0);
    }
  };

  const clicksds = () => {
    setLoading(false);
    setBot(prev => (prev = { ...prev, loading: true }));
  };

  useEffect(() => {
    if (bot.active && !bot.loading) {
      if (variants[states].name === bot.active) return;
      if (variants[states].beat === bot.active)
        return setUser(prev => (prev = { ...prev, vin: (prev.vin += 1) }));
      if (variants[states].name !== bot.active)
        return setBot(prev => (prev = { ...prev, vin: (prev.vin += 1) }));
    }
  }, [bot.loading]);



  useEffect(() => {
    if (bot.loading) {
      setBot(prev => (prev = { ...prev, active: '' }));
      const fun = () => {
        const result = variants[Math.floor(Math.random() * variants.length)];
        setBot(prev => (prev = { ...prev, active: result.name }));
      };
      const time = setTimeout(fun, 2000);
      return () => clearTimeout(time);
    }
  }, [bot.loading]);

  useEffect(() => {
    if (bot.active) {
      setLoading(false);
      setBot(prev => (prev = { ...prev, loading: false }));
    }
  }, [bot.active]);

  useEffect(() => {
    setUser(
      prev => (prev = { ...prev, active: variants[states].name }),
    );
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
          onClick={clicks}
          className="waiting w-[200px] h-[200px] cursor-pointer"
          src={`/assets/${variants[states].name}.svg`}
          alt=""
        />
        <p onClick={clicksds}>play</p>
        <VariantBot bot={bot.active} waiting={loading} botLoading={bot.loading} />
      </div>
    </div>
  );
}

export default App;
