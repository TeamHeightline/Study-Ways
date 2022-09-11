import {createTheme} from "@mui/material/styles";
import {makeAutoObservable} from "mobx";
import {Property} from "csstype";


class ThemeStore {
    constructor() {
        makeAutoObservable(this)
        // autorun(() => this.setModeToLocalStorage())
    }

    mode: "dark" | "light" | "dark2" = this.getMode

    get getMode(): "dark" | "light" | "dark2" {
        const mode = localStorage.getItem("themeMode")
        if (mode == "dark" || mode == "light" || mode == "dark2") {
            return mode
        } else {
            return "dark"
        }
    }

    get isOffButtonShiny() {
        return !(this.mode === "dark")
    }

    setModeToLocalStorage(mode: "dark" | "light" | "dark2") {
        localStorage.setItem("themeMode", mode)
        this.mode = mode
        // window.location.reload();
    }

    changeMode = () => {
        if (this.mode == "light") {
            this.setModeToLocalStorage("dark")
        } else if (this.mode == "dark") {
            this.setModeToLocalStorage("dark2")
        } else if (this.mode == "dark2") {
            this.setModeToLocalStorage("light")
        }
    }

    get isLightTheme() {
        return this.mode === "light"
    }


    get backgroundColor(): Property.BackgroundColor | undefined {
        if (this.mode === "light") {
            return "#fff"
        } else if (this.mode === "dark2") {
            return "#222226"
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

    get primaryColor() {
        return ("#2196f3")
    }


    get theme() {
        const theme = createTheme({
            palette: {
                mode: this.isLightTheme ? "light" : "dark",
                background: {
                    default: this.backgroundColor,
                    paper: this.backgroundColor
                },
                primary: {
                    main: this.primaryColor,
                },
                secondary: {
                    main: '#f50057',
                },

            },
            components: {
                MuiCard: {
                    styleOverrides: {
                        root: {
                            borderRadius: 12
                        }
                    }
                },
                MuiTypography: {
                    styleOverrides: {
                        root: {
                            fontFamily: "Nunito, sans-serif"
                        },
                        h6: {
                            fontWeight: "bold"
                        },
                        h5: {
                            fontWeight: "bold"
                        },
                        h4: {
                            fontWeight: "bold"
                        },
                        h3: {
                            fontWeight: "bold"
                        },
                        h2: {
                            fontWeight: "bold"
                        },
                        h1: {
                            fontWeight: "bold"
                        }
                    }
                },
                MuiButton: this.isOffButtonShiny ? {} : {
                    styleOverrides: {
                        root: {
                            boxShadow: `0 0 22px 0 rgb(75 135 184 / 22%)`
                        },
                        text: {
                            boxShadow: `none`
                        },
                        outlinedSecondary: {
                            boxShadow: `0 0 22px 0 rgb(245 0 87 / 22%)`
                        },
                        containedSecondary: {
                            boxShadow: `0 0 22px 0 rgb(245 0 87 / 22%)`
                        },
                        outlinedError: {
                            boxShadow: `0 0 22px 0 rgb(245 0 87 / 22%)`
                        },
                        containedError: {
                            boxShadow: `0 0 22px 0 rgb(245 0 87 / 22%)`
                        }

                    }
                },
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            fontFamily: "Nunito, sans-serif",
                            backgroundColor: this.backgroundColor,
                            "--ck-color-base-border": this.backgroundColor,
                            ".ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)": {
                                borderColor: this.backgroundColor
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
                            // ".Component-root-4": {
                            //     filter: "invert(1)"
                            // }
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
