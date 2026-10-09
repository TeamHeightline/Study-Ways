import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import TreeSelect from 'antd/es/tree-select';
import { CESObject } from '../Store/CardEditorStorage';
export const UiConnectedThemeSelector = observer(() => (
  <div className="sw-cedit-theme">
    <label htmlFor="cedit-card-themes">Темы карточки</label>
    <TreeSelect
      id="cedit-card-themes"
      treeDataSimpleMode
      treeData={toJS(CESObject.connectedThemesForSelector)}
      value={toJS(CESObject.card_object?.connectedTheme || []).map(String)}
      onChange={(themes: string[]) =>
        CESObject.changeFieldByValue('connectedTheme', [...new Set(themes)])
      }
      multiple
      showSearch
      treeNodeFilterProp="title"
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      disabled={!CESObject.isAllConnectedThemesLoaded}
      placeholder="Выберите одну или несколько тем"
      dropdownClassName="sw-cedit-theme-dropdown"
      listHeight={320}
      style={{ width: '100%' }}
    />
    <p className="sw-cedit-field-note">Карточка появится в выбранных темах.</p>
  </div>
));
