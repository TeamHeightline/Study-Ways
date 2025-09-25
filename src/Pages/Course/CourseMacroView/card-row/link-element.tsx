import { Box, Stack } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import React from "react";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import { useNavigate } from "react-router-dom";

interface ILinkElementProps extends BoxProps {
  courseLink: string;
  size: any;
}

export default function LinkElement({
  courseLink,
  size,
  ...props
}: ILinkElementProps) {
  const navigate = useNavigate();

  function handleClickOnLink() {
    const formattedLink = courseLink.replace(/^.*\/\/[^\/]+/, "");
    navigate(formattedLink);
  }

  return (
    <Box {...props}>
      <Box sx={{ border: "2px solid rgba(1,1,1,0)" }}>
        <Box sx={size} onClick={handleClickOnLink}>
          <Stack justifyContent={"center"} alignItems={"center"} sx={size}>
            <ForkRightIcon sx={{ fontSize: 60 }} />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
