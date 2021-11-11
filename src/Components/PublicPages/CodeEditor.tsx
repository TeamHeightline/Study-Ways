import {observer} from "mobx-react";
import React, {useState, Fragment} from 'react';
import Editor from 'react-simple-code-editor';

import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import {
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { oldCode} from "../Elements/CodeEditor/Struct"
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import {isMobileHook} from "../../CustomHooks/isMobileHook";

const breakPoints={
    mobile: 375,
    tablet: 1024,
    pc: 1920,
    cinema: 2560,
}

export const CodeEditor = observer(() =>{
    const [code, setCode] = useState(oldCode)
    const [isCheckForDifferentDevice, setIsCheckForDifferentDevice] = useState(true)
    const [activeDeviceWidth, setActiveDeviceWidth] = useState<string>(String(breakPoints.mobile))
    const isMobile = isMobileHook()
    const highlight = code => (
        <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
            {({tokens, getLineProps, getTokenProps }) => (
                <Fragment>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => <span key={i} {...getTokenProps({ token, key })} />)}
                        </div>
                    ))}
                </Fragment>
            )}
        </Highlight>
    )
    return(
        <ScopedCssBaseline>
            <div>
                <Grid container>
                    <Grid item md={6} xs={12}>
                        <Stack
                            direction={isMobile? "column-reverse": "column"}
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <FormControlLabel
                                control={<Switch
                                    onClick={()=> setIsCheckForDifferentDevice(!isCheckForDifferentDevice)}
                                    value={isCheckForDifferentDevice}/>}
                                label="Проверить на адаптивность" />
                            <Editor
                                value={code}
                                onValueChange={code => setCode(code)}
                                highlight={highlight}
                                padding={10}
                                style={{
                                    boxSizing: 'border-box',
                                    fontFamily: '"Dank Mono", "Fira Code", monospace',
                                    overflowY: "auto"
                                }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ToggleButtonGroup exclusive
                                           value={activeDeviceWidth}
                                           onChange={(e, value) => setActiveDeviceWidth(value)}>
                            <ToggleButton value={String(breakPoints.mobile)}>
                                <PhoneAndroidIcon/>
                            </ToggleButton>
                            <ToggleButton value={String(breakPoints.tablet)}>
                                <TabletMacIcon/>
                            </ToggleButton>
                            <ToggleButton value={String(breakPoints.pc)}>
                                <DesktopWindowsIcon/>
                            </ToggleButton>
                            <ToggleButton value={String(breakPoints.cinema)}>
                                <AspectRatioIcon/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <div style={{width: "100%", overflowX: "auto", height: window.innerHeight-100}}>
                            <iframe  srcDoc={code}
                                     style={{width: isCheckForDifferentDevice? "100%": Number(activeDeviceWidth),
                                         height: "95%", backgroundColor: "white"}}/>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </ScopedCssBaseline>
    )
})