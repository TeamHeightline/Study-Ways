import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface ITitleSimpleActionsProps extends PaperProps {
  answer_object: AnswerEditorController;
}

const TitleSimpleActions = ({ answer_object }: ITitleSimpleActionsProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div>
        <IconButton
          aria-label={`Действия с ответом №${answer_object.answer_id}`}
          aria-controls={
            open ? `qedit-answer-menu-${answer_object.answer_id}` : undefined
          }
          aria-expanded={open}
          aria-haspopup="true"
          onClick={handleClick}
          size="large"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`qedit-answer-menu-${answer_object.answer_id}`}
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            key={0}
            value="Delete"
            onClick={() => {
              answer_object.setOpenDeleteDialog(true);
              handleClose();
            }}
          >
            Удалить
          </MenuItem>
          <MenuItem
            key={2}
            value="Create new answer based on this answer"
            disabled={answer_object.copying}
            onClick={() => {
              answer_object.createNewAnswerBasedOnExist();
              handleClose();
            }}
          >
            Создать копию
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default TitleSimpleActions;
