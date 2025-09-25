import { Box } from "@mui/material";

export function RouterWrapper(props) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={(theme) => ({
          flex: 1,
          width: "100%",
          overflowX: "none",
          maxWidth: theme.breakpoints.values.xl,
        })}
      >
        {props.children}
      </Box>
    </Box>
  );
}
