import React from 'react';
import { observer } from 'mobx-react';
import { Collapse, TextField } from '@mui/material';
import { CESObject } from '../Store/CardEditorStorage';
export const UiCopyRight = observer(() => (
  <Collapse
    in={!!CESObject.getField('is_card_use_copyright', false)}
    unmountOnExit
  >
    <TextField
      fullWidth
      multiline
      minRows={2}
      maxRows={5}
      label="Автор или правообладатель"
      value={CESObject.getField('copyright', '')}
      onChange={CESObject.changeField('copyright')}
    />
  </Collapse>
));
