import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { useGetConnectedThemesQuery } from '../../../../../Shared/ConnectedThemes/api';
import { ThemeLoadError } from '../../../../../Shared/ConnectedThemes/ThemeLoadError';
import { ThemeSelect } from '../../../../../Shared/ConnectedThemes/ThemeSelect';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

const ConnectedThemeSelector = observer(() => {
  const themes = useGetConnectedThemesQuery();
  const selectedId = QuestionEditorStorage.selectedConnectedTheme;
  return (
    <div className="sw-qedit-theme">
      <ThemeSelect
        id="qedit-connected-theme"
        themes={themes.data ?? []}
        selectedIds={selectedId ? [selectedId] : []}
        onChange={ids =>
          runInAction(() => {
            QuestionEditorStorage.selectedConnectedTheme = ids[0];
          })
        }
        disabled={!themes.data}
        loading={themes.isFetching}
        label="Тема вопроса"
        placeholder="Выберите тему вопроса"
      />
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </div>
  );
});

export default ConnectedThemeSelector;
