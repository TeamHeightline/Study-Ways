import React from 'react';
import { observer } from 'mobx-react';
import { Button, PaperProps } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { EditAnswerByIdStore } from '../Store/edit-answer-by-id-store';

interface IsEditAnswerProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}
const IsEditAnswer = observer(({ answer_object: store }: IsEditAnswerProps) => (
  <Button
    startIcon={<TuneRoundedIcon />}
    endIcon={
      store.isOpenForEdit ? (
        <ExpandLessRoundedIcon />
      ) : (
        <ExpandMoreRoundedIcon />
      )
    }
    onClick={store.changeIsOpenForEdit}
    aria-expanded={store.isOpenForEdit}
    aria-controls={`qedit-answer-settings-${store.answer_id}`}
    className="sw-qedit-expand-answer"
  >
    {store.isOpenForEdit ? 'Свернуть редактор' : 'Настройки и подсказки'}
  </Button>
));
export default IsEditAnswer;
