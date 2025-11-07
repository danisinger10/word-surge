import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { POWER_UPS } from '@/lib/gameData';
import { toast } from 'sonner';

export default function PowerUpsPanel() {
  const { state, usePowerUp } = useGame();

  const handleUsePowerUp = (powerUpId: string) => {
    const powerUp = POWER_UPS.find(p => p.id === powerUpId);
    const count = (state.powerUps as any)[powerUpId];
    
    if (count <= 0) {
      toast.error(`No ${powerUp?.name} available!`);
      return;
    }
    
    usePowerUp(powerUpId);
    toast.success(`${powerUp?.name} activated!`);
  };

  return (
    <Card className="glass p-4">
      <h3 className="text-sm font-bold mb-3 text-muted-foreground">Power-Ups</h3>
      <div className="grid grid-cols-5 gap-2">
        {POWER_UPS.map((powerUp) => {
          const count = (state.powerUps as any)[powerUp.id] || 0;
          const isActive = state.activePowerUp === powerUp.id;
          
          return (
            <button
              key={powerUp.id}
              onClick={() => handleUsePowerUp(powerUp.id)}
              disabled={count <= 0 || isActive}
              type="button"
              className={`
                relative aspect-square rounded-xl border-2 transition-all cursor-pointer
                ${count > 0 ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 hover:scale-110 hover:shadow-lg active:scale-95' : 'border-gray-300 bg-gray-100 opacity-50'}
                ${isActive ? 'animate-pulse-scale border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg' : ''}
                disabled:cursor-not-allowed disabled:hover:scale-100
                focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
              `}
              title={powerUp.description}
              aria-label={`Use ${powerUp.name}`}
            >
              <div className="text-2xl">{powerUp.icon}</div>
              {count > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-xs font-bold flex items-center justify-center">
                  {count}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
