import { observer } from 'mobx-react';
import React from 'react';
import { AISObject } from '../Store/AISearch';
import { MicoCardsField } from './MicroCardField';
import { AISearchString } from './AISearchString';
import { Box } from '@mui/material';

interface IAIHomePageProps extends React.HTMLAttributes<HTMLDivElement> {
  onThemeChange?: (id?: number) => void;
  onCardSelect: (card_id: number) => void;
}

export const AICardSelector = observer(
  ({ onCardSelect, onThemeChange, ...props }: IAIHomePageProps) => (
    // useEffect(()=>AISObject.loadPersonalHomePage(), [])
    <div {...props}>
      <AISearchString onThemeChange={onThemeChange} />
      <Box sx={{ mt: 2 }}>
        <MicoCardsField
          cards_id={AISObject.cardsIDArray}
          onCardSelect={onCardSelect}
        />
      </Box>
    </div>
  ),
);
