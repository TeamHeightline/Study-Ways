import {observer} from "mobx-react";
import {TextField} from "@material-ui/core";
import React from "react";

export const AnswerVideoUrl = observer(({answer}) =>{
    return(
        <>
            <TextField
                key={answer.id + "videoUrl"}
                id="standard-multiline-flexible"
                label="Ссылка на видео-ответ"
                fullWidth
                rowsMax={7}
                // style={{width: "50vw"}}
                value={answer.videoUrl}
                onChange={(e: any) => {
                    answer.videoUrl = e.target.value
                }}
            />
        </>
    )
})