import { Box } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { EditQuestionByID } from "./EditQuestionByID";

type IEditQuestionByURLProps = BoxProps;

const EditQuestionByURL = observer(({ ...props }: IEditQuestionByURLProps) => {
  const { id } = useParams();
  return (
    <Box {...props}>
      <EditQuestionByID questionID={id} />
    </Box>
  );
});

export default EditQuestionByURL;
