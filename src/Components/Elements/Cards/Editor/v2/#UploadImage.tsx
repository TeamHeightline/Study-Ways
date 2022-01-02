import {observer} from "mobx-react";
import React from 'react';
import Dragger from "antd/es/upload/Dragger";
import {CESObject} from "../../../../../Store/PrivateStorage/EditorsPage/CardEditorPage/CardEditorStorage";
import {Stack, Typography} from "@mui/material";
import "@fontsource/raleway";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface IUploadImageProps extends React.HTMLAttributes<HTMLDivElement>{

}
const upload_props = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: "image/png, image/jpeg",
};
export const UploadImage = observer(({...props}: IUploadImageProps) =>{
    return(
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
        </div>
    )
})