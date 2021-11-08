import { createTheme, adaptV4Theme } from "@mui/material/styles";

export const theme = createTheme(adaptV4Theme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*": {
          margin: 0,
          padding: 0,
        },
        "html, body, #root": {
          height: "100%",
        },
        "ul": {
          listStyle: "none",
        }
      },
    },
    MuiSvgIcon: {
      root: { verticalAlign: "middle" },
    },
  },
}));