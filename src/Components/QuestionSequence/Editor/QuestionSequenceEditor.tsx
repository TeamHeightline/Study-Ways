import React, {useState} from 'react'
import {GET_QUESTION_SEQUENCE_BY_ID} from "./Struct";
import {useQuery} from "@apollo/client";
import {Query} from "../../../../SchemaTypes";
import {Spinner} from "react-bootstrap";
import {Button, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Switch} from "@material-ui/core";

export default function QuestionSequenceEditor({...props}: any) {
    const {data: sequence_data} = useQuery<Query, {id: string}>(GET_QUESTION_SEQUENCE_BY_ID, {
        variables:{
            id: props?.activeEditSeSequenceID,
        }
    })
    const [use_random_position_for_questions, set_use_random_position_for_questions] = useState<boolean | undefined>()
    const [can_switch_pages, set_can_switch_pages] = useState<boolean | undefined>()
    const [show_help_text, set_show_help_text] = useState<boolean | undefined>()

    if(!sequence_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать серию вопросов</div>
            {props?.activeEditSeSequenceID &&
                <Button
                    className="ml-5"
                    variant="outlined" color="primary" onClick={() => {
                    props.onChange("goBack")}}>
                    Назад
                </Button>}
            <br/>
            <FormControl component="fieldset" className="mt-2 ml-5">
                <FormLabel component="legend">Настройки серии вопросов:</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch checked={use_random_position_for_questions}
                                         onChange={(e) => {set_use_random_position_for_questions(e.target.checked)}} name="gilad"/>}
                        label="Включить перемешивание вопросов"
                    />
                    <FormControlLabel
                        control={<Switch checked={can_switch_pages}
                                         onChange={(e) =>{set_can_switch_pages(e.target.checked)}} name="jason" />}
                        label="Резрешить переключение между вопросами"
                    />
                    <FormControlLabel
                        control={<Switch checked={show_help_text}
                                         onChange={(e) =>{set_show_help_text(e.target.checked)}} name="jason" />}
                        label="Показывать подсказки или нет"
                    />
                    {/*<FormControlLabel*/}
                    {/*    control={<Switch checked={state.antoine} onChange={handleChange} name="antoine" />}*/}
                    {/*    label="Antoine Llorca"*/}
                    {/*/>*/}
                </FormGroup>
                <FormHelperText>Проверьте еще раз, на всякий случай, это очень важно!</FormHelperText>
            </FormControl>
        </div>
    )
}