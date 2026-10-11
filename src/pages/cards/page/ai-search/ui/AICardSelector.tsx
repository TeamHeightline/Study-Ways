import React from 'react';
import { useAISearch } from '../store/AISearch';
import { MicoCardsField } from './MicroCardField';
import { AISearchString } from './AISearchString';
import { Alert, Button, Box, LinearProgress } from '@mui/material';
interface IAIHomePageProps extends React.HTMLAttributes<HTMLDivElement> {
  onThemeChange?: (id?: number) => void;
  onCardSelect: (card_id: number) => void;
}
export const AICardSelector = ({
  onCardSelect,
  onThemeChange,
  ...props
}: IAIHomePageProps) => {
  const search = useAISearch({ results: true });
  return (
    // useEffect(()=>AISObject.loadPersonalHomePage(), [])
    <div {...props}>
      <AISearchString onThemeChange={onThemeChange} />
      <Box sx={{ mt: 2 }}>
        {search.isLoading && <LinearProgress />}
        {search.isError && (
          <Alert
            severity="error"
            action={<Button onClick={() => search.retry()}>Повторить</Button>}
          >
            Не удалось загрузить рекомендации.
          </Alert>
        )}
        <MicoCardsField
          cards_id={search.cardsIDArray}
          onCardSelect={onCardSelect}
        />
      </Box>
    </div>
  );
};
