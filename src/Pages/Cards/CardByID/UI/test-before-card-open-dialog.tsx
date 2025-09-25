import { Box } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { CardByIDStore } from "../Store/CardByIDStore";

interface ITestBeforeCardOpenDialogProps extends BoxProps {
  card_store: CardByIDStore;
}

export default function TestBeforeCardOpenDialog({
  card_store,
  ...props
}: ITestBeforeCardOpenDialogProps) {
  return <Box {...props}></Box>;
}
