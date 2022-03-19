import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Pagination, Paper, Stack} from "@mui/material";
import QSSObject from "../Store/question-selector-store";


interface IQuestionPaginationProps extends PaperProps {

}

const QuestionPagination = observer(({...props}: IQuestionPaginationProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Stack alignItems={"center"}>
                <Pagination
                    onChange={QSSObject.changeActivePage}
                    page={QSSObject.activePageForPagination}
                    count={QSSObject.numPagesForPagination}/>
            </Stack>
        </Paper>
    )
})

export default QuestionPagination