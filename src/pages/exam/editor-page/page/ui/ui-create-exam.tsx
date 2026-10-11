import { Button } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useAppDispatch } from '../../../../../app/redux-store/RootStore';
import { changeIsOpenCreateExamDialog } from '../redux-store/actions';

export default function UICreateExam() {
  const dispatch = useAppDispatch();
  return (
    <Button
      variant="contained"
      startIcon={<AddRoundedIcon />}
      onClick={() => dispatch(changeIsOpenCreateExamDialog(true))}
    >
      Создать экзамен
    </Button>
  );
}
