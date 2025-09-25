import { Paper } from "@mui/material";
import ExamByID from "../ExamByID/UI/exam-by-id-page";
import { useParams } from "react-router-dom";

interface IExamEditorByURLProps {}

export default function ExamEditorByURL({ ...props }: IExamEditorByURLProps) {
  const { examID } = useParams();
  if (!examID) {
    return <div />;
  }
  return (
    <Paper elevation={0} {...props}>
      <ExamByID exam_id={Number(examID)} />
    </Paper>
  );
}
