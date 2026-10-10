import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { useConnectedThemeOptions } from '../../../../../Shared/ConnectedThemes/api';
import { ThemeLoadError } from '../../../../../Shared/ConnectedThemes/ThemeLoadError';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';
import TreeSelect from 'antd/es/tree-select';

const { SHOW_CHILD } = TreeSelect;

const ConnectedThemeSelector = observer(() => {
  const themes = useConnectedThemeOptions();
  const tProps = {
    treeDataSimpleMode: true,
    treeData: themes.treeData,
    value: QuestionEditorStorage.selectedConnectedTheme,
    onChange: (e: string) => {
      runInAction(() => { QuestionEditorStorage.selectedConnectedTheme = e; });
    },
    disabled: !themes.data,
    loading: themes.isFetching,
    showSearch: true,
    treeNodeFilterProp: 'title',
    id: 'qedit-connected-theme',
    dropdownClassName: 'sw-qedit-theme-popup',
    showCheckedStrategy: SHOW_CHILD,
    placeholder: 'Выберите тему вопроса',
    // bordered: true,
    style: {
      width: '100%',
    },
  };

  return (
    <div className="sw-qedit-theme">
      <label htmlFor="qedit-connected-theme">Тема вопроса</label>
      <TreeSelect {...tProps} size={'large'} />
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </div>
  );
});

export default ConnectedThemeSelector;
