import { Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";

type IUIStudentsAccessTypeProps = PaperProps;

export default function UIStudentsAccessType({
  ...props
}: IUIStudentsAccessTypeProps) {
  return (
    <Paper elevation={0} {...props}>
      <ToggleButtonGroup color="primary" exclusive value={"all"}>
        <ToggleButton value="all">Все</ToggleButton>
        <ToggleButton value="selectedGroup" disabled>
          Группа
        </ToggleButton>
        <ToggleButton value="selectedUsers" disabled>
          Выбранные пользователи
        </ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
}
