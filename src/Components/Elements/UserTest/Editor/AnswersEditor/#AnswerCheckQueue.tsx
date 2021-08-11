import {observer} from "mobx-react";
import {InputLabel} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import React from "react";

export const AnswerCheckQueue = observer(({answer}) =>{
    return(
        <>
            <FormControl className="ml-5 col-8">
                <InputLabel htmlFor="formatted-text-mask-input">Очередь проверки</InputLabel>
                <Input
                    value={answer.checkQueue}
                    onChange={(e) => {
                        answer.checkQueue = e.target.value.replace(/[^\d]/g, '')
                    }}
                    name="textmask"
                    id="formatted-text-mask-input"

                />
            </FormControl>
        </>
    )
})