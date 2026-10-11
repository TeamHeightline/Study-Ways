import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Paper, Stack } from '@mui/material';
import { useGetConnectedThemesQuery } from '../../../../../Shared/ConnectedThemes/api';
import { getThemeDescendantIds } from '../../../../../Shared/ConnectedThemes/model';
import { ThemeLoadError } from '../../../../../Shared/ConnectedThemes/ThemeLoadError';
import { ThemeSelect } from '../../../../../Shared/ConnectedThemes/ThemeSelect';
import { AISObject } from '../Store/AISearch';

const AIThemeFilter = observer(
  ({ onThemeChange }: { onThemeChange?: (id?: number) => void }) => {
    const themes = useGetConnectedThemesQuery();
    const selectedId = AISObject.cardConnectedTheme;
    const changeTheme = (id: number | undefined) => {
      AISObject.setThemeFilter(
        id,
        getThemeDescendantIds(themes.data ?? [], id),
      );
      onThemeChange?.(id);
    };
    useEffect(() => {
      AISObject.setThemeFilter(
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
  },
);
export default AIThemeFilter;
