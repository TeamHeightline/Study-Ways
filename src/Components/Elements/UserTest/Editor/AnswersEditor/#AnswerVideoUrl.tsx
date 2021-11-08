import {observer} from "mobx-react";
import {TextField} from "@mui/material";
import React from "react";

export const AnswerVideoUrl = observer(({answer, ...props}) =>{
    return (
        <div {...props}>
            <TextField
                key={answer.id + "videoUrl"}
                id="standard-multiline-flexible"
                label="Ссылка на видео-ответ"
                fullWidth
                maxRows={7}
                // style={{width: "50vw"}}
                value={answer.videoUrl}
                onChange={(e: any) => {
                    answer.videoUrl = e.target.value
                }}
            />
        </div>
    );
})