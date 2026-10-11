import React from 'react';
import { useCardEditor } from '../model/use-card-editor';
import { useGetConnectedThemesQuery } from '../../../../../Shared/ConnectedThemes/api';
import { ThemeLoadError } from '../../../../../Shared/ConnectedThemes/ThemeLoadError';
import { ThemeSelect } from '../../../../../Shared/ConnectedThemes/ThemeSelect';

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
      <p className="sw-cedit-field-note">
        Карточка появится в выбранных темах.
      </p>
    </div>
  );
};
