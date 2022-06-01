import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Paper} from "@mui/material";
import {getExcelDownloadUrl} from "../../../../../../ServerLayer/QueryLayer/statistic.query";
import editQSStore from "../store/edit-question-sequence-sore";

interface IUIDownloadExcelButtonProps extends PaperProps {

}

const UIDownloadExcelButton = observer(({...props}: IUIDownloadExcelButtonProps) => {
    const [excelDownloadUrl, setExcelDownloadUrl] = React.useState<string>('');

    async function createUrl() {
        if (editQSStore.qsData?.id) {
            setExcelDownloadUrl(await getExcelDownloadUrl(editQSStore.qsData.id))
        }
    }

    if (excelDownloadUrl) {
        return (
            <Paper elevation={0} {...props}>
                <Button variant="contained" color="primary" href={excelDownloadUrl} download>
                    Скачать отчет
                </Button>
            </Paper>
        )
    }
    return (
        <Paper elevation={0} {...props}>
            <Button variant="outlined" color="primary" onClick={createUrl}>
                Создать отчет о экзамене (Excel)
            </Button>
        </Paper>
    )
})

export default UIDownloadExcelButton
