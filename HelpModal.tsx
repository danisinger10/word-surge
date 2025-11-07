import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Zap, Target, Flame, Keyboard } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-primary/20 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">How to Play</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Basic Rules */}
          <Card className="glass p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Basic Rules
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Tap letters to form words (minimum 2 letters)</li>
              <li>• Each letter can only be used once per word</li>
              <li>• Submit valid words to earn points</li>
              <li>• Find as many words as possible before time runs out</li>
              <li>• Longer words earn more points!</li>
            </ul>
          </Card>

          {/* Game Modes */}
          <Card className="glass p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Game Modes
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-bold text-primary">⚡ Blitz (15 seconds)</p>
                <p className="text-muted-foreground">Fast-paced action! Find words quickly.</p>
              </div>
              <div>
                <p className="font-bold text-secondary">⏰ Marathon (60 seconds)</p>
                <p className="text-muted-foreground">Test your endurance and vocabulary.</p>
              </div>
              <div>
                <p className="font-bold text-accent">♾️ Zen (No timer)</p>
                <p className="text-muted-foreground">Relax and find every possible word.</p>
              </div>
            </div>
          </Card>

          {/* Combo System */}
          <Card className="glass p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Combo System
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Find words quickly to build your combo</li>
              <li>• Higher combos = bigger score multipliers</li>
              <li>• Combo resets if you wait too long between words</li>
              <li>• Reach 5x combo to enter SURGE MODE! 🔥</li>
            </ul>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="glass p-4">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-primary" />
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submit word</span>
                <kbd className="px-2 py-1 rounded bg-muted text-foreground font-mono text-xs">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clear guess</span>
                <kbd className="px-2 py-1 rounded bg-muted text-foreground font-mono text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Backspace</span>
                <kbd className="px-2 py-1 rounded bg-muted text-foreground font-mono text-xs">Backspace</kbd>
              </div>
            </div>
          </Card>

          {/* Scoring */}
          <Card className="glass p-4">
            <h3 className="text-lg font-bold mb-3">Scoring</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Base score: 10 points × word length</li>
              <li>• Combo bonus: +20% per combo level</li>
              <li>• Pangram bonus: +100 points (uses all letters)</li>
              <li>• XP earned: 5 XP × word length</li>
            </ul>
          </Card>

          {/* Tips */}
          <Card className="glass p-4 border-accent/20">
            <h3 className="text-lg font-bold mb-3 text-accent">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Look for common word patterns (ING, ED, ER)</li>
              <li>• Start with short words to build your combo</li>
              <li>• Use power-ups strategically in timed modes</li>
              <li>• Two-letter words count! (OF, TO, IN, etc.)</li>
              <li>• Practice in Zen mode to improve your skills</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
