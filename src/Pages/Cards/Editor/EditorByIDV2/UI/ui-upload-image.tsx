import {observer} from "mobx-react";
import React from 'react';
import Upload from 'antd/es/upload';

import {CESObject} from "../Store/CardEditorStorage";
import {Collapse, Stack, TextField, Typography} from "@mui/material";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Paper from "@mui/material/Paper";

interface IUploadImageProps extends React.HTMLAttributes<HTMLDivElement> {

}

const upload_props: any = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: "image/png, image/jpeg",
};
const {Dragger} = Upload;

export const UiUploadImage = observer(({...props}: IUploadImageProps) => {
    return (
        <div {...props}>
            <Dragger {...upload_props}
                     beforeUpload={() => false}
                     onChange={e => {
                         CESObject.handleUploadImage(e, CESObject.getField("id", ""))
                     }}
                     style={{
                         backgroundImage: "Url(" + CESObject.fakeImageUrl + ")",
                         backgroundSize: "cover",
                         backgroundRepeat: "no-repeat",
                         height: 384,
                     }}
            >
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                    style={{height: 384}}
                >
                    <CloudUploadIcon fontSize="large"/>
                    <Typography variant={"h6"}>
                        Нажмите или перетащите изображение для загрузки
                    </Typography>
                    <Typography variant={"subtitle2"}>
                        Поддерживает загрузку одного изображения
                    </Typography>
                </Stack>
            </Dragger>
            <Collapse in={CESObject.getField("cardContentType", "A_0") === "A_1"}>
                <Paper elevation={0} sx={{pt: 2}}>
                    <TextField
                        onChange={CESObject.changeField("siteUrl")}
                        error={!CESObject.UrlValidation}
                        value={CESObject.getField("siteUrl", "")}
                        fullWidth label={"Ссылка на внешний ресурс"}
                    />
                </Paper>
            </Collapse>
        </div>
    )
})
