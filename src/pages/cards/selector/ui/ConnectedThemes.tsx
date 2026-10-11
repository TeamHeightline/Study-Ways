import React from 'react';
import { Paper, Stack } from '@mui/material';
import { useCardSelector } from '../store/CardSelectorStore';
import { useGetConnectedThemesQuery } from '../../../../shared/connected-themes/api';
import { ThemeLoadError } from '../../../../shared/connected-themes/ThemeLoadError';
import { ThemeSelect } from '../../../../shared/connected-themes/ThemeSelect';
export const ConnectedThemes = ({
  onThemeChange,
}: {
  onThemeChange?: (id?: number) => void;
}) => {
  const selector = useCardSelector();
  const themes = useGetConnectedThemesQuery();
  return (
    <Paper
      className="sw-theme-filter"
      elevation={0}
      sx={{ width: '100%', backgroundColor: 'transparent' }}
    >
      <Stack>
        <ThemeSelect
          themes={themes.data ?? []}
          selectedIds={
            selector.cardConnectedTheme === undefined
              ? []
              : [String(selector.cardConnectedTheme)]
          }
          onChange={ids => {
            const id = ids[0] ? Number(ids[0]) : undefined;
            selector.setFilters({ cardConnectedTheme: id });
            onThemeChange?.(id);
          }}
          disabled={!themes.data}
          loading={themes.isFetching}
          label="Тема карточки"
          placeholder="Выберите тему карточки"
        />
      </Stack>
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </Paper>
  );
};
