import {createTheme} from "@mui/material/styles";
import {makeAutoObservable} from "mobx";
import {Property} from "csstype";


class ThemeStore {
    constructor() {
        makeAutoObservable(this)
        // autorun(() => this.setModeToLocalStorage())
    }

    mode: "dark" | "light" = this.getMode

    get getMode(): "dark" | "light" {
        const mode = localStorage.getItem("themeMode")
        if (mode == "dark" || mode == "light") {
            return mode
        } else {
            return "dark"
        }
    }

    setModeToLocalStorage(mode: "dark" | "light") {
        localStorage.setItem("themeMode", mode)
        this.mode = mode
        // window.location.reload();
    }

    changeMode = () => {
        if (this.isLightTheme) {
            this.setModeToLocalStorage("dark")
        } else {
            this.setModeToLocalStorage("light")
        }
    }

    get isLightTheme() {
        return this.mode === "light"
    }

    get lightBackgroundColor() {
        if (this.isLightTheme) {
            return "#fff"
        } else {
            return "#0A1929"
        }
    }

    get backgroundColor(): Property.BackgroundColor | undefined {
        if (this.isLightTheme) {
            return "#fff"
        } else {
            return "#0A1929"
        }
    }

    get textColor() {
        if (this.isLightTheme) {
            return "rgba(0, 0, 0, 0.87)"
        } else {
            return "#ffffff"
        }
    }

    get secondaryColor() {
        if (this.isLightTheme) {
            return "rgba(0, 0, 0, 0.6)"
        } else {
            return this.textColor
        }
    }

    get theme() {
        const theme = createTheme({
            palette: {
                mode: this.mode,
                background: {
                    default: this.backgroundColor,
                    paper: this.backgroundColor
                },
                primary: {
                    main: "#2196f3",
                    contrastText: this.textColor,
                },
                secondary: {
                    main: '#f50057',
                },
                text: {
                    primary: this.textColor,
                    secondary: this.secondaryColor,

                    disabled: this.textColor
                },

            },
            typography: {
                allVariants: {
                    color: this.textColor
                },
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            backgroundColor: this.backgroundColor,
                            "--ck-color-base-border": this.backgroundColor,
                            ".ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)": {
                                "border-color": this.backgroundColor
                            },
                            scrollbarColor: this.backgroundColor,
                            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                                backgroundColor: this.backgroundColor,
                                width: "8px"
                            },
                            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                                borderRadius: "10px",
                                backgroundColor: this.backgroundColor,
                                border: "1px solid #2296F3"
                            },
                            ".ck-editor": {
                                "--ck-color-toolbar-background": this.backgroundColor,
                                "--ck-color-toolbar-border": this.backgroundColor,
                                "--ck-color-input-disabled-text": this.textColor,
                                "--ck-color-text": this.textColor,
                            },
                            ".ck-content": {
                                color: this.textColor,
                                backgroundColor: this.backgroundColor
                            },
                            "ck-editor__editable_inline": {
                                "--ck-color-toolbar-background": this.backgroundColor,
                                "--ck-color-base-background": this.backgroundColor,
                                "--ck-color-base-border": this.backgroundColor,
                                "--ck-color-text": this.textColor,
                                "--ck-color-input-text": this.textColor,
                                "--ck-color-input-disabled-text": this.textColor,
                                borderColor: this.backgroundColor
                            },
                            "ck-editor": {
                                "--ck-color-toolbar-background": this.backgroundColor,
                                "--ck-color-base-background": this.backgroundColor,
                                "--ck-color-base-border": this.backgroundColor
                            },
                            ".ck-widget": {
                                filter: "invert(1)"
                            },
                            //делает все подписи в статистике белыми
                            ".Component-root-4": {
                                filter: "invert(1)"
                            }
                        }
                    },
                },
            },
        })
        return (theme)
    }
}

const ThemeStoreObject = new ThemeStore()
export default ThemeStoreObject