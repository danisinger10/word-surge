import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Target, Flame, Home, RotateCcw, Star, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import { createConfetti } from '@/lib/particles';
import WordDefinition from './WordDefinition';

export default function ResultsScreen() {
  const { state, startGame, resetToHome } = useGame();

  const handleGoHome = () => {
    resetToHome();
  };

  const foundPercentage = state.allPossibleWords.size > 0
    ? Math.round((state.foundWords.size / state.allPossibleWords.size) * 100)
    : 0;

  const isPerfect = foundPercentage === 100;
  const isGreat = foundPercentage >= 75;

  useEffect(() => {
    if (isPerfect) {
      createConfetti(100);
    } else if (isGreat) {
      createConfetti(50);
    }
  }, [isPerfect, isGreat]);

  const stats = [
    {
      icon: Trophy,
      label: 'Score',
      value: state.score,
      color: 'text-accent',
    },
    {
      icon: Target,
      label: 'Words Found',
      value: `${state.foundWords.size} / ${state.allPossibleWords.size}`,
      color: 'text-primary',
    },
    {
      icon: Flame,
      label: 'Max Combo',
      value: `${state.maxCombo}x`,
      color: 'text-secondary',
    },
    {
      icon: Star,
      label: 'Completion',
      value: `${foundPercentage}%`,
      color: 'text-accent',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center p-4 py-8 relative overflow-y-auto">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-4 animate-bounce-in">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text text-glow-strong">
            {isPerfect ? '🎉 PERFECT!' : isGreat ? '🌟 AMAZING!' : '✨ GOOD GAME!'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {isPerfect
              ? 'You found every single word!'
              : isGreat
              ? 'Outstanding performance!'
              : 'Keep practicing to improve!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="glass p-6 text-center animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <p className={`text-3xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Missed Words */}
        {state.foundWords.size < state.allPossibleWords.size && (
          <Card className="glass p-6 animate-bounce-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold mb-4">Missed Words</h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {Array.from(state.allPossibleWords)
                .filter(word => !state.foundWords.has(word))
                .sort((a, b) => b.length - a.length)
                .slice(0, 20)
                .map((word) => (
                  <WordDefinition 
                    key={word}
                    word={word}
                    className="text-sm"
                  />
                ))}
            </div>
            {state.allPossibleWords.size - state.foundWords.size > 20 && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                +{state.allPossibleWords.size - state.foundWords.size - 20} more words
              </p>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 animate-bounce-in" style={{ animationDelay: '0.5s' }}>
          <Button
            size="lg"
            variant="outline"
            onClick={handleGoHome}
            className="glass h-16 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
          <Button
            size="lg"
            onClick={() => startGame(state.gameMode || 'blitz')}
            className="h-16 text-lg bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform box-glow"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}
