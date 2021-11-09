import {observer} from "mobx-react";
import React, {useState, Fragment} from 'react';
import Editor from 'react-simple-code-editor';

import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import {Grid} from "@mui/material";
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import {oldCode2} from "../Elements/CodeEditor/Struct"

export const CodeEditor = observer(() =>{
    const [code, setCode] = useState(oldCode2)
    const highlight = code => (
        <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
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
                    </Grid>
                    <Grid item xs={12} md={6} style={{backgroundColor: "white"}}>
                        <iframe  srcDoc={code} style={{width: "100%", height: "100%"}}/>
                    </Grid>
                </Grid>
            </div>
        </ScopedCssBaseline>
    )
})