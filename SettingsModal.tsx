import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX, Trash2 } from 'lucide-react';
import { audioSystem } from '@/lib/audio';
import { clearGameState } from '@/lib/storage';
import { toast } from 'sonner';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleToggleSound = () => {
    const newState = audioSystem.toggleSound();
    setSoundEnabled(newState);
    toast.success(newState ? 'Sound enabled' : 'Sound disabled');
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      clearGameState();
      toast.success('Progress reset! Refreshing...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Sound Settings */}
          <Card className="glass p-4">
            <h3 className="text-lg font-bold mb-3">Audio</h3>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={handleToggleSound}
            >
              <span>Sound Effects</span>
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>
          </Card>

          {/* About */}
          <Card className="glass p-4">
            <h3 className="text-lg font-bold mb-3">About</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Word Surge 2025</strong></p>
              <p>The Most Addictive Word Game of 2025</p>
              <p className="text-xs">Version 1.0.0</p>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="glass p-4 border-destructive/20">
            <h3 className="text-lg font-bold mb-3 text-destructive">Danger Zone</h3>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleResetProgress}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Progress
            </Button>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
