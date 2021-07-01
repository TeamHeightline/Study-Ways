import React, {useState} from 'react'
import {GET_QUESTION_SEQUENCE_BY_ID} from "./Struct";
import {useQuery} from "@apollo/client";
import {Query} from "../../../../SchemaTypes";
import {Row, Spinner} from "react-bootstrap";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel, MenuItem,
    Switch,
    TextField, Typography
} from "@material-ui/core";

export default function QuestionSequenceEditor({...props}: any) {
    const {data: sequence_data} = useQuery<Query, {id: string}>(GET_QUESTION_SEQUENCE_BY_ID, {
        variables:{
            id: props?.activeEditSeSequenceID,
        }
    })
    const [use_random_position_for_questions, set_use_random_position_for_questions] = useState<boolean | undefined>()
    const [can_switch_pages, set_can_switch_pages] = useState<boolean | undefined>()
    const [show_help_text, set_show_help_text] = useState<boolean | undefined>()
    const [need_await_full_true_answers, set_need_await_full_true_answers] = useState<boolean | undefined>()
    const [max_sum_of_attempts, set_max_sum_of_attempts] = useState<string | undefined>("10")
    const [hard_level, set_hard_level] = useState<string>("EASY") //"EASY" "HARD", "MEDIUM"

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
            <Row className="justify-content-around">
                <FormControl component="fieldset" className="mt-2 ml-5 col-5">
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
                        <FormControlLabel
                            control={<Switch checked={need_await_full_true_answers}
                                             onChange={(e) =>{set_need_await_full_true_answers(e.target.checked)}} name="jason" />}
                            label="Нужно ли ждать пока пользователь выбирет все правильные ответы"
                        />
                    </FormGroup>
                    <FormHelperText>Проверьте еще раз, на всякий случай, это очень важно!</FormHelperText>
                </FormControl>
                <div className="col-5">
                    <Row>
                        <FormControl component="fieldset" className="mt-2">
                            <FormGroup>
                                <FormControlLabel
                                    className="mr-5"
                                    label="Максимальное количество попыток для каждого вопроса"
                                    control={
                                        <TextField value={max_sum_of_attempts} onChange={(e) =>{
                                            set_max_sum_of_attempts(e.target.value)
                                        }} size="small" id="outlined-basic" label="Количество"
                                                   variant="outlined" className="col-3 mr-3" type="number"
                                        />
                                    }
                                />
                                <FormControlLabel
                                    className="mr-5"
                                    label="Уровень сложности подсказок"
                                    control={
                                        <TextField value={hard_level} onChange={(e) =>{
                                            set_hard_level(e.target.value)
                                        }} size="small" id="outlined-basic" label="Количество" select
                                                   variant="outlined" className="col-3 mr-3" type="number"
                                        >
                                            <MenuItem  value={"EASY"}>
                                                Легкий
                                            </MenuItem>
                                            <MenuItem  value={"MEDIUM"}>
                                                Средний
                                            </MenuItem>
                                            <MenuItem  value={"HARD"}>
                                                Сложный
                                            </MenuItem>
                                        </TextField>
                                    }
                                />
                            </FormGroup>
                        </FormControl>
                    </Row>
                </div>
            </Row>
        </div>
    )
}