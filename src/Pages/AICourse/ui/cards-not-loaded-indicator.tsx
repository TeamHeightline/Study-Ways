import { observer } from 'mobx-react';
import { Box, Fade, LinearProgress, Typography } from '@mui/material';
import { useCardPreviewMap } from '../../Cards/CardMicroView/store/api';

export const CardsNotLoadedIndicator = observer(() => {
  const card_hash_map = useCardPreviewMap();

  const isCardsNotLoaded = Object.keys(card_hash_map).length === 0;

  return (
    <Fade in={isCardsNotLoaded} timeout={500}>
      <Box sx={{ width: '100%', mt: 1, px: 1, maxWidth: 700 }}>
        <Typography variant={'caption'}>Загрузка необходимых данных</Typography>
        <LinearProgress />
      </Box>
    </Fade>
  );
});
