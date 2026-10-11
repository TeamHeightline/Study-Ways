import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Paper, Stack } from '@mui/material';
import { CSSObject } from '../Store/CardSelectorStore';
import { useGetConnectedThemesQuery } from '../../../../Shared/ConnectedThemes/api';
import { ThemeLoadError } from '../../../../Shared/ConnectedThemes/ThemeLoadError';
import { ThemeSelect } from '../../../../Shared/ConnectedThemes/ThemeSelect';

export const ConnectedThemes = observer(
  ({ onThemeChange }: { onThemeChange?: (id?: number) => void }) => {
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
              CSSObject.cardConnectedTheme === undefined
                ? []
                : [String(CSSObject.cardConnectedTheme)]
            }
            onChange={ids =>
              runInAction(() => {
                CSSObject.cardConnectedTheme = ids[0]
                  ? Number(ids[0])
                  : undefined;
                onThemeChange?.(CSSObject.cardConnectedTheme);
              })
            }
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
