import {observer} from "mobx-react";
import React from "react";
import {Button} from "@material-ui/core";

export const AnswerImage = observer(({answer}) =>{
    return(
        <>
            <Button
                className="col-12 mt-2"
                color="primary"
                variant="outlined"
                component="label"
            >
                <input type="file"  hidden name="file" onChange={(e: any) => answer.updateImage(e)} />
                Изображение для ответа
            </Button>

            <div className="col-7 ">
                {answer.imageName.length > 30 ? answer.imageName.slice(0, 27) + "..." : answer.imageName}
            </div>
        </>
    )
})