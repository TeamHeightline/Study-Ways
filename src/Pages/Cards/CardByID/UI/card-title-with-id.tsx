import { observer } from 'mobx-react';
import React from 'react';
import { CardByIDStore } from '../Store/CardByIDStore';
import { Chip, Stack, Typography, Tooltip } from '@mui/material';
import { isMobileHook } from '../../../../Shared/CustomHooks/isMobileHook';

interface ICardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  card_store: CardByIDStore;
}

const CardTitleWithId = observer(
  ({ card_store, ...props }: ICardTitleProps) => {
    const isMobile = isMobileHook();

    const title = card_store?.card_data?.title;
    const card_id = card_store?.card_data?.id;

    return (
      <Tooltip title={title || ''} arrow placement="top-start" enterDelay={350} describeChild componentsProps={{ tooltip: { sx: { maxWidth: 520, fontSize: 13, lineHeight: 1.6, bgcolor: '#294b37', p: 1.5, borderRadius: 2 } }, arrow: { sx: { color: '#294b37' } } }}>
      <Typography tabIndex={0} component={'h1'} variant={'h5'} className="sw-material-title">
        {title}
        <Chip
          sx={{ ml: 1 }}
          label={'№ ' + card_id}
          variant={'outlined'}
          color={'primary'}
          size={'small'}
        />
      </Typography>
      </Tooltip>
    );
  },
);

export default CardTitleWithId;
