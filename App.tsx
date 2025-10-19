import React, { useState, useCallback } from 'react';
import { getRacePrediction } from './services/geminiService';
import type { PredictionData, DriverStats } from './types';
import { RACE_CIRCUITS, F1_2025_CALENDAR, F1_WDC_STANDINGS } from './constants';
import Loader from './components/Loader';
import PredictionCard from './components/PredictionCard';
import Podium from './components/Podium';
import ResultsTable from './components/ResultsTable';
import WinProbabilityChart from './components/WinProbabilityChart';
import ChampionshipStandings from './components/ChampionshipStandings';
import StrategicInsights from './components/StrategicInsights';

// Icons for Prediction Cards
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const PitstopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 18L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M6 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.364 18.364L15.5355 15.5355" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8.46447 8.46447L5.63604 5.63604" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.364 5.63604L15.5355 8.46447" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8.46447 15.5355L5.63604 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const WeatherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const PoleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;

const UpcomingRaces: React.FC = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    const upcoming = F1_2025_CALENDAR.filter(race => {
        const raceDate = new Date(race.startDate);
        return raceDate >= today;
    }).slice(0, 5);

    return (
        <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-gray-900/80 backdrop-blur-lg border border-gray-700 rounded-lg shadow-2xl p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
            <h4 className="font-bold text-white text-lg mb-3 border-b border-gray-600 pb-2">Upcoming Races (2025)</h4>
            <ul className="space-y-3">
                {upcoming.map((race, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-grow">
                            <p className="font-semibold text-white">{race.name}</p>
                            <p className="text-gray-400">{race.circuit}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                             <p className="font-bold text-gray-200 bg-red-600/50 px-2 py-1 rounded text-xs">{race.date}</p>
                        </div>
                    </li>
                ))}
            </ul>
             <p className="text-xs text-gray-500 mt-4 text-center">Dates provisional. Times are TBC (CEST).</p>
        </div>
    );
};


const App: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState<string>(RACE_CIRCUITS[0]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<string>('');
  const [showHistoryInput, setShowHistoryInput] = useState<boolean>(false);


  const handlePrediction = useCallback(async () => {
    if (!selectedRace) return;
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const predictionData = await getRacePrediction(selectedRace, historicalData);
      setPrediction(predictionData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRace, historicalData]);

  const Header = () => (
    <div className="text-center p-6 md:p-8 bg-black/30 backdrop-blur-md rounded-b-3xl mb-8 shadow-2xl shadow-black/30">
        <div className="relative max-w-7xl mx-auto flex justify-center items-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter [text-shadow:_0_4px_10px_rgb(0_0_0_/_0.5)]">
              <span className="text-red-600">Formula 1</span>
              <span className="text-white"> Race Predictor</span>
            </h1>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 group hidden sm:block">
                <div className="flex items-center gap-2 cursor-pointer border border-gray-600 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-gray-300 font-semibold text-sm hidden md:block">2025 Calendar</span>
                </div>
                <UpcomingRaces />
            </div>
        </div>
        <p
            className="text-gray-300 mt-4 max-w-3xl mx-auto text-lg animate-fade-in"
            style={{ animationDelay: '0.2s' }}
        >
            Select a circuit and let Gemini AI analyze 75 years of data to predict the upcoming race.
        </p>
    </div>
  );

  const Controls = () => (
    <div className="flex flex-col items-center justify-center gap-4 mb-8 px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-4">
        <select
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
          className="w-full sm:flex-grow p-4 bg-gray-800/80 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
          disabled={isLoading}
        >
          {RACE_CIRCUITS.map((race) => (
            <option key={race} value={race}>
              {race}
            </option>
          ))}
        </select>
        <button
          onClick={handlePrediction}
          disabled={isLoading}
          className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {isLoading ? 'ANALYZING...' : 'PREDICT'}
        </button>
      </div>
      <div className="w-full max-w-xl text-center mt-2">
        <button
          onClick={() => setShowHistoryInput(prev => !prev)}
          className="text-gray-400 hover:text-white transition-colors text-sm font-semibold py-2"
        >
          {showHistoryInput ? 'Hide' : 'Add'} Historical Notes (Optional)
          <span className="ml-2 transition-transform duration-300 inline-block" style={{ transform: showHistoryInput ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </button>
        {showHistoryInput && (
          <div className="animate-fade-in">
            <textarea
              value={historicalData}
              onChange={(e) => setHistoricalData(e.target.value)}
              placeholder="E.g., 'Last year, Verstappen had engine trouble here. Rain is often a factor at Spa.'"
              className="w-full mt-2 p-3 bg-gray-900/50 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-all h-24"
            />
          </div>
        )}
      </div>
    </div>
  );

  const PredictionResults = () => {
    if (!prediction) return null;

    const driverStatsMap = (prediction.driverStats || []).reduce((acc, entry) => {
        acc[entry.driver] = entry.stats;
        return acc;
    }, {} as { [driverName: string]: DriverStats });

    return (
      <div className="space-y-8 animate-fade-in">
        <Podium drivers={prediction.podium} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto px-4">
          <PredictionCard title="Weather" icon={<WeatherIcon />} mainText={prediction.weather.condition} subText={prediction.weather.temperature} />
          <PredictionCard title="Pole Position" icon={<PoleIcon />} mainText={prediction.polePosition.driver.split(' ').pop() || ''} subText={prediction.polePosition.time} team={prediction.polePosition.team} />
          <PredictionCard title="Fastest Lap" icon={<ClockIcon />} mainText={prediction.fastestLap.driver.split(' ').pop() || ''} subText={prediction.fastestLap.time} team={prediction.fastestLap.team} />
          <PredictionCard title="Driver of the Day" icon={<StarIcon />} mainText={prediction.driverOfTheDay.driver.split(' ').pop() || ''} team={prediction.driverOfTheDay.team} />
          <PredictionCard title="Fastest Pitstop" icon={<PitstopIcon />} mainText={prediction.fastestPitstop.team} subText={prediction.fastestPitstop.time} team={prediction.fastestPitstop.team} />
        </div>
        <StrategicInsights rivalries={prediction.keyRivalries} strategies={prediction.teamStrategies} />
        <WinProbabilityChart data={prediction.winProbabilities} />
        <ResultsTable results={prediction.fullResults} title="Predicted Race Results" driverStats={driverStatsMap} />
        <div className="text-center mt-8">
            <a
                href={`https://www.google.com/search?q=Formula+1+${encodeURIComponent(selectedRace)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700/50 text-white font-semibold rounded-lg hover:bg-gray-700/80 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
                Learn More & See Official Info
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        </div>
      </div>
    );
  };

  const MainContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="text-center p-6 bg-red-900/50 border border-red-600 rounded-lg max-w-2xl mx-auto animate-fade-in">
          <p className="font-semibold">Prediction Failed</p>
          <p className="text-red-300">{error}</p>
        </div>
      );
    }
    if (prediction) {
      return <PredictionResults />;
    }
    return <ChampionshipStandings standings={F1_WDC_STANDINGS} />;
  };

  return (
    <div className="min-h-screen text-white">
      <div className="min-h-screen w-full bg-black/60 backdrop-blur-sm">
        <main className="container mx-auto px-4 py-8">
          <Header />
          <Controls />
          <div className="mt-12">
            <MainContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;