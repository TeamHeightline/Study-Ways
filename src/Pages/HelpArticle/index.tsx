import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";

type IProps = BoxProps;

export default function InfoButton({ ...props }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Box {...props}>
      <IconButton onClick={handleOpen}>
        <InfoIcon />
      </IconButton>

      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>213123</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
