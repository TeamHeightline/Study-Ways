import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { CSSObject } from '../Store/CardSelectorStore';
import TreeSelect from 'antd/es/tree-select';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { useConnectedThemeOptions } from '../../../../Shared/ConnectedThemes/api';
import { ThemeLoadError } from '../../../../Shared/ConnectedThemes/ThemeLoadError';

export const ConnectedThemes = observer(() => {
  const themes = useConnectedThemeOptions();
  const tProps = {
    treeDataSimpleMode: true,
    treeData: themes.treeData,
    value:
      CSSObject.cardConnectedTheme === undefined
        ? undefined
        : String(CSSObject.cardConnectedTheme),
    onChange: data => {
      runInAction(() => {
        CSSObject.cardConnectedTheme =
          data === undefined ? undefined : Number(data);
      });
    },
    disabled: !themes.data,
    loading: themes.isFetching,
    placeholder: 'Выберите тему карточки',
    className: 'sw-theme-select',
    dropdownClassName: 'sw-theme-dropdown',
    dropdownStyle: { minWidth: 460, maxHeight: '72vh' },
    listHeight: 560,
    style: {
      width: '100%',
    },
  };
  return (
    <Paper
      className="sw-theme-filter"
      elevation={0}
      sx={{ width: '100%', backgroundColor: 'transparent' }}
    >
      <Stack direction={'row'}>
        <TreeSelect {...tProps} size={'large'} />
        <IconButton
          aria-label="Сбросить тему"
          disabled={!CSSObject.cardConnectedTheme}
          onClick={() =>
            runInAction(() => {
              CSSObject.cardConnectedTheme = undefined;
            })
          }
        >
          <ClearIcon />
        </IconButton>
      </Stack>
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </Paper>
  );
});
