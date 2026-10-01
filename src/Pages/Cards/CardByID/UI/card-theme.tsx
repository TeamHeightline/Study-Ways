import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Paper, Stack } from '@mui/material';
import { CardByIDStore } from '../Store/CardByIDStore';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ThemeWithAncestor from './theme-with-ancestor';

interface ICardThemeProps extends PaperProps {
  card_store: CardByIDStore;
}

const CardTheme = observer(({ card_store, ...props }: ICardThemeProps) => {
  const isShowTheme =
    !!card_store?.card_data?.cards_card_connected_theme[0]
      ?.unstructuredtheme_id;
  const themeIDArray = card_store?.card_data?.cards_card_connected_theme?.map(
    (theme) => theme.cards_unstructuredtheme,
  );

  return (
    <Paper elevation={0} {...props}>
      {isShowTheme && (
        <Stack direction={'row'} sx={{ alignItems: 'flex-start', gap: 1, minWidth: 0 }}>
          <Stack direction="row" sx={{ flexShrink: 0 }}><AccountTreeIcon fontSize="small" /></Stack>
          <Stack direction="row" sx={{ flexWrap: 'wrap', columnGap: 2.5, rowGap: 1, minWidth: 0 }}>

          {themeIDArray?.map((theme) => (
            <ThemeWithAncestor
              key={`${theme.id}ThemeKey`}
              theme={theme}
              card_store={card_store}
            />
          ))}
          </Stack>
        </Stack>
      )}
    </Paper>
  );
});

export default CardTheme;
