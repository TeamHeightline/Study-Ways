import React from 'react';
import { useGetConnectedThemesQuery } from '../../../../../shared/connected-themes/api';
import { ThemeLoadError } from '../../../../../shared/connected-themes/ThemeLoadError';
import { ThemeSelect } from '../../../../../shared/connected-themes/ThemeSelect';
import { useQuestionEditor } from '../store/use-question-editor';
const ConnectedThemeSelector = () => {
  const editor = useQuestionEditor();
  const themes = useGetConnectedThemesQuery();
  const selectedId = editor.selectedConnectedTheme;
  return (
    <div className="sw-qedit-theme">
      <ThemeSelect
        id="qedit-connected-theme"
        themes={themes.data ?? []}
        selectedIds={selectedId ? [selectedId] : []}
        onChange={ids => {
          editor.changeFields({ connectedThemeId: ids[0] });
        }}
        disabled={!themes.data}
        loading={themes.isFetching}
        label="Тема вопроса"
        placeholder="Выберите тему вопроса"
      />
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </div>
  );
};
export default ConnectedThemeSelector;
