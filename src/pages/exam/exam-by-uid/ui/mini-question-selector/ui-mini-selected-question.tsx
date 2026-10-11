import { Chip, Grid } from '@mui/material';
import { PaperProps } from '@mui/material/Paper';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

interface IUIMiniSelectedQuestionProps extends PaperProps {
  questionIndex: number;
  questionID: number;
}

export default function UIMiniSelectedQuestion({
  questionIndex,
  questionID,
  ...props
}: IUIMiniSelectedQuestionProps) {
  return (
    <Grid size={4}>
      <Chip
        label={`Вопрос ${questionIndex}`}
        color={'primary'}
        icon={<RadioButtonCheckedIcon />}
      />
    </Grid>
  );
}
