import {createTheme} from "@mui/material/styles";

export const backgroundColor = "#0A1929"
export const lightBackgroundColor = "#1A202C"
export const textColor = "#ffffff"

export const theme = createTheme( {
    palette: {
        mode: 'dark',
        background: {
            default: backgroundColor,
            paper: backgroundColor
        },
        primary: {
            main: "#2196f3",
            contrastText: textColor,
        },
        secondary: {
            main: '#f50057',
        },
        text: {
            primary: textColor,
            secondary: textColor,
            disabled: textColor
        },

    },
    typography: {
        allVariants: {
            color: textColor
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // body:  darkScrollbar(),
                body: {
                    scrollbarColor: backgroundColor,
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: backgroundColor,
                        width: "8px"
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: "10px",
                        backgroundColor: backgroundColor,
                        border: "1px solid #2296F3"
                    },
                    ".ck-editor": {
                        "--ck-color-toolbar-background": backgroundColor,
                        "--ck-color-toolbar-border": backgroundColor,
                        "--ck-color-input-disabled-text": textColor,
                        "--ck-color-text": textColor,
                    },
                    ".ck-content" : {
                        color: textColor,
                        backgroundColor: backgroundColor
                    },
                    ".ck-widget":{
                        filter: "invert(1)"
                    },
                    //делает все подписи в статистике белыми
                    ".Component-root-4":{
                        filter: "invert(1)"
                    }
                }
            },
        },
    },
})
