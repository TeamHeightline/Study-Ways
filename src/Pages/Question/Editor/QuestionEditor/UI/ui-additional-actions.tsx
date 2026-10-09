import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {
  Backdrop,
  Button,
  CircularProgress,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import { Link } from 'react-router-dom';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

const UiAdditionalActions = observer(() => {
  const store = QuestionEditorStorage;
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <Backdrop
        open={store.createDeepCopyInProgress}
        sx={{ zIndex: theme => theme.zIndex.modal + 1 }}
      >
        <CircularProgress />
      </Backdrop>
      <Button
        variant="outlined"
        startIcon={<MoreHorizRoundedIcon />}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        disabled={store.unsavedFlag}
        onClick={event => setAnchor(event.currentTarget)}
      >
        Действия
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuItem
          component={Link}
          to={`/editor/checkquestion/question/${store.selectedQuestionID}`}
          onClick={() => setAnchor(null)}
        >
          <ListItemIcon>
            <RuleRoundedIcon fontSize="small" />
          </ListItemIcon>
          Открыть проверку вопроса
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            store.deepQuestionCopyWithAnswers();
          }}
        >
          <ListItemIcon>
            <ContentCopyOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Создать копию вопроса с ответами
        </MenuItem>
      </Menu>
    </>
  );
});
export default UiAdditionalActions;
