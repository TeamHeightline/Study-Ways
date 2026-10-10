import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useConnectedThemeOptions } from '../../../../../Shared/ConnectedThemes/api';
import { getThemeDescendantIds } from '../../../../../Shared/ConnectedThemes/model';
import { ThemeLoadError } from '../../../../../Shared/ConnectedThemes/ThemeLoadError';
import TreeSelect from 'antd/es/tree-select';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { AISObject } from '../Store/AISearch';

const AIThemeFilter = observer(() => {
  const themes = useConnectedThemeOptions();
  const selectedId = AISObject.cardConnectedTheme;
  const changeTheme = (id: number | undefined) => {
    AISObject.setThemeFilter(id, getThemeDescendantIds(themes.data ?? [], id));
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
      <Stack direction={'row'}>
        <TreeSelect
          treeDataSimpleMode={true}
          treeData={themes.treeData}
          value={selectedId === undefined ? undefined : String(selectedId)}
          onChange={data => {
            changeTheme(data === undefined ? undefined : Number(data));
          }}
          disabled={!themes.data}
          loading={themes.isFetching}
          className="sw-theme-select"
          dropdownClassName="sw-theme-dropdown"
          dropdownStyle={{ minWidth: 460, maxHeight: '72vh' }}
          listHeight={560}
          placeholder={'Выберите тему карточки'}
          style={{ width: '100%' }}
          size={'large'}
        />
        <IconButton
          aria-label="Сбросить тему"
          disabled={!selectedId}
          onClick={() => changeTheme(undefined)}
        >
          <ClearIcon />
        </IconButton>
      </Stack>
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </Paper>
  );
});
export default AIThemeFilter;
