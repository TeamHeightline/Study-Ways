import {observer} from "mobx-react";
import React from 'react';
import {Collapse, InputAdornment, TextField} from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import {CESObject} from "../Store/CardEditorStorage";

interface ICopyRightProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const UiCopyRight = observer(({...props}: ICopyRightProps) => {
    return (
        <div {...props}>
            <Collapse in={CESObject.getField("is_card_use_copyright", false)}>
                <TextField
                    variant="outlined"
                    label="Авторские права принадлежат: "
                    fullWidth
                    maxRows={7}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CopyrightIcon/>
                            </InputAdornment>
                        ),
                    }}
                    value={CESObject.getField("copyright", '')}
                    onChange={CESObject.changeField('copyright')}
                />
            </Collapse>
        </div>
    )
})
