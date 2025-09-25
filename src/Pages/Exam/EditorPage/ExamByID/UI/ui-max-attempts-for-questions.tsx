import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import {
  RootState,
  useAppDispatch,
} from "../../../../../App/ReduxStore/RootStore";
import { useSelector } from "react-redux";
import { changeMaxQuestionAttempts } from "../redux-store/examEditorSlice";

type IUIMaxAttemptsForQuestionsProps = BoxProps;

export default function UIMaxAttemptsForQuestions({
  ...props
}: IUIMaxAttemptsForQuestionsProps) {
  const dispatch = useAppDispatch();
  const max_question_attempts =
    useSelector(
      (state: RootState) => state?.examEditor?.exam_data?.max_question_attempts,
    ) || 10;
  const is_enable_max_question_attempts =
    useSelector(
      (state: RootState) =>
        state?.examEditor?.exam_data?.is_enable_max_question_attempts,
    ) || false;
  return (
    <Box {...props}>
      <FormControl fullWidth>
        <InputLabel>Максимальное количество попыток</InputLabel>
        <Select
          label="Максимальное количество попыток"
          value={max_question_attempts}
          onChange={(e) => {
            if (e.target.value >= 0 && e.target.value <= 30) {
              dispatch(changeMaxQuestionAttempts(Number(e.target.value)));
            }
          }}
          disabled={!is_enable_max_question_attempts}
        >
          {Array.from(Array(30).keys()).map((item, index) => (
            <MenuItem value={index + 1} key={index + 1}>
              {index + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
