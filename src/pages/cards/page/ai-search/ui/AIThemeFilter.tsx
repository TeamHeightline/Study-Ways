import React, { useEffect } from 'react';
import { Paper, Stack } from '@mui/material';
import { useGetConnectedThemesQuery } from '../../../../../shared/connected-themes/api';
import { getThemeDescendantIds } from '../../../../../shared/connected-themes/model';
import { ThemeLoadError } from '../../../../../shared/connected-themes/ThemeLoadError';
import { ThemeSelect } from '../../../../../shared/connected-themes/ThemeSelect';
import { useAISearch } from '../store/AISearch';
const AIThemeFilter = ({
  onThemeChange,
}: {
  onThemeChange?: (id?: number) => void;
}) => {
  const search = useAISearch();
  const themes = useGetConnectedThemesQuery();
  const selectedId = search.cardConnectedTheme;
  const changeTheme = (id: number | undefined) => {
    search.setThemeFilter(id, getThemeDescendantIds(themes.data ?? [], id));
    onThemeChange?.(id);
  };
  useEffect(() => {
    search.setThemeFilter(
      selectedId,
      getThemeDescendantIds(themes.data ?? [], selectedId),
    );
  }, [selectedId, themes.data]);
  return (
    <Paper
      className="sw-theme-filter"
      elevation={0}
      sx={{ width: '100%', backgroundColor: 'transparent' }}
    >
      <Stack>
        <ThemeSelect
          themes={themes.data ?? []}
          selectedIds={selectedId === undefined ? [] : [String(selectedId)]}
          onChange={ids => changeTheme(ids[0] ? Number(ids[0]) : undefined)}
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
export default AIThemeFilter;
