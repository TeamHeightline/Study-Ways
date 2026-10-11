import Grid from '@mui/material/Grid';
import React from 'react';
import { useCardSelector } from '../store/CardSelectorStore';
import CardMicroView from '../../card-micro-view';
import { CreateCard } from './CreateCard';
import { Box } from '@mui/material';
interface IMicroCardFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  cardIds: string[];
  showCreateNewCard?: boolean;
}
export const MicroCardField = ({
  cardIds,
  showCreateNewCard,
  ...props
}: IMicroCardFieldProps) => {
  const selector = useCardSelector();
  return (
    <Box className="sw-card-results" {...props} sx={{ overflow: 'auto' }}>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: 'center',
        }}
      >
        {showCreateNewCard && (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 'auto',
            }}
          >
            <CreateCard />
          </Grid>
        )}
        {cardIds?.map(card_id => (
          <Grid
            key={`${card_id}CardMicroView`}
            onClick={() => {
              selector.selectCard(card_id);
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
  );
};
