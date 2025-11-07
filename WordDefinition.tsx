import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, BookOpen } from 'lucide-react';

interface WordDefinitionProps {
  word: string;
  children?: React.ReactNode;
  className?: string;
}

interface Definition {
  definition: string;
  partOfSpeech: string;
}

export default function WordDefinition({ word, children, className = '' }: WordDefinitionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      
      if (!response.ok) {
        throw new Error('Definition not found');
      }
      
      const data = await response.json();
      const firstMeaning = data[0]?.meanings?.[0];
      
      if (firstMeaning) {
        setDefinition({
          definition: firstMeaning.definitions[0].definition,
          partOfSpeech: firstMeaning.partOfSpeech,
        });
      } else {
        throw new Error('No definition available');
      }
    } catch (err) {
      setError('Definition not available');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setIsOpen(true);
    if (!definition && !error) {
      fetchDefinition();
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          inline-flex items-center gap-1 px-2 py-1 rounded-lg
          bg-gradient-to-r from-purple-100 to-pink-100
          hover:from-purple-200 hover:to-pink-200
          border border-purple-300
          transition-all hover:scale-105 active:scale-95
          cursor-pointer
          ${className}
        `}
        title={`Click to see definition of "${word}"`}
      >
        {children || word}
        <BookOpen className="w-3 h-3 opacity-60" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">
              {word.toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            
            {error && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{error}</p>
              </div>
            )}
            
            {definition && !loading && (
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                  {definition.partOfSpeech}
                </div>
                <p className="text-lg leading-relaxed text-foreground">
                  {definition.definition}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
