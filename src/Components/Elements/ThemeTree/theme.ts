import {createMuiTheme} from "@material-ui/core/styles";

export const theme = createMuiTheme({
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
});