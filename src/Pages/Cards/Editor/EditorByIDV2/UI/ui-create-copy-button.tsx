import React from 'react';
import { observer } from 'mobx-react';
import { Button } from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { CESObject } from '../Store/CardEditorStorage';
const UICreateButton = observer(() => (
  <Button
    variant="outlined"
    startIcon={<ContentCopyRoundedIcon />}
    disabled={!CESObject.stateOfSave}
    onClick={CESObject.openCopyCardDialog}
  >
    Создать копию
  </Button>
));
export default UICreateButton;
