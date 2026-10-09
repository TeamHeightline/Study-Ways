import React from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
export const UiTestBeforeCard = observer(() => (
  <div className="sw-cedit-question-fields">
    <TextField
      fullWidth
      size="small"
      type="number"
      label="ID вопроса перед карточкой"
      inputProps={{ min: 1 }}
      value={CESObject.getField('test_before_card_id', '') || ''}
      onChange={CESObject.changeField('test_before_card_id')}
    />
    {CESObject.testBeforeCardData && (
      <div className="sw-cedit-question-preview">
        <span>Вопрос №{CESObject.testBeforeCardData.id}</span>
        <p>{CESObject.testBeforeCardData.text}</p>
      </div>
    )}
  </div>
));
