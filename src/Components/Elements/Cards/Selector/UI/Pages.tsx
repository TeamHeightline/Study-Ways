import {observer} from "mobx-react";
import React from 'react';
import {Pagination, Stack} from "@mui/material";
import {CSSObject} from "../Store/CardSelectorStore";

interface IPagesProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const Pages = observer(({...props}: IPagesProps) =>{
    return(
        <div {...props}>
            <Stack alignItems={"center"}>
                <Pagination
                    page={CSSObject.activePage}
                    count={CSSObject.maxPages}
                    onChange={CSSObject.changeActivePage}/>
            </Stack>
        </div>
    )
})