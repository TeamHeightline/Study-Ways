import {observer} from "mobx-react";
import React from 'react';
import {Collapse, InputAdornment, TextField} from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";

interface ICopyRightProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const CopyRight = observer(({...props}: ICopyRightProps) =>{
    return(
        <div {...props}>
            <Collapse in={CESObject.getField("isCardUseCopyright",false)}>
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