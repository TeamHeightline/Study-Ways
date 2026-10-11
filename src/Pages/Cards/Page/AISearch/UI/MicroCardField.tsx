import { observer } from 'mobx-react';
import React from 'react';
import { Box, Grid } from '@mui/material';
import CardMicroView from '../../../CardMicroView';

interface IMicoCardsFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  cards_id: number[] | string[];
  onCardSelect: (card_id: number) => void;
}

export const MicoCardsField = observer(
  ({ cards_id, onCardSelect, ...props }: IMicoCardsFieldProps) => (
    <Box className="sw-card-results" {...props} sx={{ overflow: 'auto' }}>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: 'center',
          p: { xs: 1, md: 0 },
        }}
      >
        {cards_id?.map(card_id => (
          <Grid
            key={`${card_id}CardKey`}
            onClick={() => {
              onCardSelect(card_id);
            }}
            size={{
              xs: 12,
              sm: 6,
              md: 'auto',
            }}
          >
            <CardMicroView cardID={Number(card_id)} onChange={() => void 0} />
          </Grid>
        ))}
      </Grid>
    </Box>
  ),
);
