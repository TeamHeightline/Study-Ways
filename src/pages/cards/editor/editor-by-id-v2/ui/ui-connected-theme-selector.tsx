import React from 'react';
import { useCardEditor } from '../model/use-card-editor';
import { useGetConnectedThemesQuery } from '../../../../../shared/connected-themes/api';
import { ThemeLoadError } from '../../../../../shared/connected-themes/ThemeLoadError';
import { ThemeSelect } from '../../../../../shared/connected-themes/ThemeSelect';

export const UiConnectedThemeSelector = () => {
  const editor = useCardEditor();
  const themes = useGetConnectedThemesQuery();
  return (
    <div className="sw-cedit-theme">
      <ThemeSelect
        id="cedit-card-themes"
        themes={themes.data ?? []}
        selectedIds={(editor.draft.connectedTheme || []).map(String)}
        onChange={ids => editor.changeFieldByValue('connectedTheme', ids)}
        multiple
        disabled={!themes.data}
        loading={themes.isFetching}
        label="Темы карточки"
        placeholder="Выберите одну или несколько тем"
      />
      <ThemeLoadError isError={themes.isError} refetch={themes.refetch} />
    </div>
  );
};
