import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Zap, Clock, Infinity, Trophy, Settings, HelpCircle } from 'lucide-react';
import { GameMode } from '@/lib/types';
import GameScreen from '@/components/GameScreen';
import ResultsScreen from '@/components/ResultsScreen';
import SettingsModal from '@/components/SettingsModal';
import HelpModal from '@/components/HelpModal';


export default function Home() {
  const { state, startGame } = useGame();
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const xpPercentage = (state.xp / state.xpToNextLevel) * 100;

  const modes = [
    {
      id: 'blitz' as GameMode,
      name: 'Blitz',
      icon: Zap,
      description: '15 seconds. Pure speed.',
      color: 'from-primary to-primary/50',
      glow: 'box-glow',
    },
    {
      id: 'marathon' as GameMode,
      name: 'Marathon',
      icon: Clock,
      description: '60 seconds. Test your endurance.',
      color: 'from-secondary to-secondary/50',
      glow: 'shadow-secondary/50',
    },
    {
      id: 'zen' as GameMode,
      name: 'Zen',
      icon: Infinity,
      description: 'No timer. Find every word.',
      color: 'from-accent to-accent/50',
      glow: 'shadow-accent/50',
    },
  ];

  if (state.screen === 'game') {
    return <GameScreen />;
  }

  if (state.screen === 'results') {
    return <ResultsScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      
      <div className="relative z-10 w-full max-w-4xl space-y-8">
        {/* Settings & Help Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="glass"
            onClick={() => setShowHelp(true)}
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="glass"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 animate-bounce-in">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text text-glow-strong">
            WORD SURGE
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            The Most Addictive Word Game of 2025
          </p>
        </div>

        {/* Player Stats */}
        <Card className="glass p-6 space-y-4 animate-bounce-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold text-primary">{state.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Coins</p>
              <p className="text-2xl font-bold text-accent">{state.coins}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">XP Progress</span>
              <span className="text-primary font-medium">{state.xp} / {state.xpToNextLevel}</span>
            </div>
            <Progress value={xpPercentage} className="h-3 animate-pulse-glow" />
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass p-4 text-center animate-bounce-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-3xl font-bold text-primary">{state.totalWordsFound}</p>
            <p className="text-sm text-muted-foreground">Words Found</p>
          </Card>
          <Card className="glass p-4 text-center animate-bounce-in" style={{ animationDelay: '0.25s' }}>
            <p className="text-3xl font-bold text-secondary">{state.bestScore}</p>
            <p className="text-sm text-muted-foreground">Best Score</p>
          </Card>
          <Card className="glass p-4 text-center animate-bounce-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-3xl font-bold text-accent">{state.bestCombo}x</p>
            <p className="text-sm text-muted-foreground">Best Combo</p>
          </Card>
        </div>

        {/* Mode Selection */}
        {!showModeSelect ? (
          <Button
            size="lg"
            className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:scale-105 transition-transform animate-bounce-in box-glow-strong"
            style={{ animationDelay: '0.4s' }}
            onClick={() => setShowModeSelect(true)}
          >
            <Sparkles className="w-6 h-6 mr-2" />
            START PLAYING
          </Button>
        ) : (
          <div className="space-y-4 animate-bounce-in">
            <h2 className="text-2xl font-bold text-center text-glow">Select Game Mode</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {modes.map((mode, index) => (
                <Card
                  key={mode.id}
                  className={`glass p-6 cursor-pointer hover:scale-105 transition-all ${mode.glow} animate-bounce-in`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  onClick={() => startGame(mode.id)}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{mode.name}</h3>
                  <p className="text-sm text-center text-muted-foreground">{mode.description}</p>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowModeSelect(false)}
            >
              Back
            </Button>
          </div>
        )}
      </div>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <HelpModal open={showHelp} onOpenChange={setShowHelp} />
    </div>
  );
}


