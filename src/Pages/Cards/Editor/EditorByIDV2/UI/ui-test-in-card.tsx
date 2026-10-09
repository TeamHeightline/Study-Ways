import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
export const UiTestInCard = observer(() => (
  <div className="sw-cedit-question-fields">
    <TextField
      fullWidth
      size="small"
      type="number"
      label="ID вопроса внутри карточки"
      inputProps={{ min: 1 }}
      value={CESObject.getField('test_in_card_id', '') || ''}
      onChange={CESObject.changeField('test_in_card_id')}
    />
    {CESObject.testInCardData && (
      <div className="sw-cedit-question-preview">
        <span>Вопрос №{CESObject.testInCardData.id}</span>
        <p>{CESObject.testInCardData.text}</p>
      </div>
    )}
  </div>
));
