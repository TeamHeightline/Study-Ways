import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNavigate } from 'react-router-dom';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import {
  changeExamNameForCreate,
  closeDialogAndClearCreateData,
} from '../redux-store/actions';
import { createExamAsync } from '../redux-store/async-actions';
import UIQuestionSequenceSelector from './ui-question-sequence-selector';

export default function UICreateExamDialog() {
  const draft = useAppSelector(
    (state: RootState) => state.examEditorPageReducer,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pending = draft.create_exam_pending;
  const ready =
    !!draft.exam_name_for_create?.trim() &&
    !!draft.exam_qs_id_for_create &&
    Number(draft.selected_qs_data?.id) === draft.exam_qs_id_for_create &&
    !draft.selected_qs_data_loading &&
    !draft.selected_qs_data_error;
  const close = () => {
    if (!pending) dispatch(closeDialogAndClearCreateData());
  };
  function create(event) {
    event.preventDefault();
    if (!ready || pending) return;
    dispatch(
      createExamAsync(
        draft.exam_name_for_create || '',
        Number(draft.exam_qs_id_for_create),
        id => navigate(`/editor/exam/select/${id}`),
      ),
    );
  }
  return (
    <Dialog
      open={draft.is_open_create_exam_dialog}
      onClose={close}
      fullWidth
      maxWidth="sm"
      className="sw-examlist-dialog"
      aria-labelledby="sw-create-exam-title"
      aria-describedby="sw-create-exam-description"
    >
      <form onSubmit={create}>
        <DialogTitle id="sw-create-exam-title">
          <span>Новый экзамен</span>
          <IconButton
            aria-label="Закрыть создание экзамена"
            onClick={close}
            disabled={pending}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p id="sw-create-exam-description">
            Начните с названия и серии вопросов. Правила прохождения можно
            настроить в редакторе.
          </p>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Название экзамена"
            placeholder="Например, итоговый экзамен по механике"
            variant="outlined"
            value={draft.exam_name_for_create || ''}
            disabled={pending}
            onChange={event =>
              dispatch(changeExamNameForCreate(event.target.value))
            }
          />
          <UIQuestionSequenceSelector disabled={pending} />
          {draft.create_exam_error && (
            <Alert severity="error" className="sw-examlist-alert">
              Не удалось создать экзамен. Данные сохранены, попробуйте ещё раз.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <span>После создания откроется редактор экзамена</span>
          <div>
            <Button onClick={close} disabled={pending}>
              Отмена
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={pending}
              disabled={!ready}
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Создать
            </LoadingButton>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}
