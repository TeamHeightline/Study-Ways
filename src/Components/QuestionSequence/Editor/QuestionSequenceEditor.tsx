import React, {useState} from 'react'
import {GET_QUESTION_SEQUENCE_BY_ID, GET_THEMES} from "./Struct";
import {useQuery} from "@apollo/client";
import {Query} from "../../../../SchemaTypes";
import {Col, Row, Spinner} from "react-bootstrap";
import {
    Button, Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel, MenuItem,
    Switch,
    TextField, Typography
} from "@material-ui/core";
import ThemeTree from "../../Cards/Editor/CardEditByID/#ThemeTree";
import AnswerCard from "./#AnswerCard";

export default function QuestionSequenceEditor({...props}: any) {
    // const {data: sequence_data} = useQuery<Query, {id: string}>(GET_QUESTION_SEQUENCE_BY_ID, {
    //     variables:{
    //         id: props?.activeEditSeSequenceID,
    //     },
    //     onCompleted: data =>{
    //         console.log(props?.activeEditSeSequenceID)
    //         console.log(data)}
    // })
    const [use_random_position_for_questions, set_use_random_position_for_questions] = useState<boolean | undefined>() //Включить перемешивание вопросов
    const [can_switch_pages, set_can_switch_pages] = useState<boolean | undefined>() // Резрешить переключение между вопросами
    const [show_help_text, set_show_help_text] = useState<boolean | undefined>() //Показывать подсказки или нет
    const [need_await_full_true_answers, set_need_await_full_true_answers] = useState<boolean | undefined>() //Нужно ли ждать пока пользователь выбирет все правильные ответы
    const [max_sum_of_attempts, set_max_sum_of_attempts] = useState<string | undefined>("10") //Максимальное количество попыток для каждого вопроса
    const [hard_level, set_hard_level] = useState<string>("EASY") //"EASY" "HARD", "MEDIUM" Уровень сложности подсказок
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState([]) //Темы карточек, на которые этот тест
    const [dataForThemeTreeView, setDataForThemeTreeView] = useState([])//Нужно для дерева тем
    const [use_random_position_for_answers, set_use_random_position_for_answers] = useState<boolean | undefined>() //Перемешивать ли ответы в вопросах

    const autoSave = () =>{
        console.log("--save--")
    }
    const cardSelectedThemeIDHandle = (e) =>{
        autoSave()
        // console.log(e)
        const cleanSubThemes: any = []
        e.map((id: any) =>{
            if (id > 1000000){
                cleanSubThemes.push(id)
            }
        })
        setCardSelectedThemeID(cleanSubThemes)
    }
    const {data: themesData} = useQuery(GET_THEMES, {
        onCompleted: themesData => {
            // console.log(themesData.cardGlobalTheme)
            const data: any = []
            themesData.cardGlobalTheme.map((GlobalTheme) =>{
                const ThisGlobalTheme: any = {}
                ThisGlobalTheme.title = GlobalTheme.name
                ThisGlobalTheme.id = GlobalTheme.id
                ThisGlobalTheme.value = GlobalTheme.id
                ThisGlobalTheme.isLead = false
                ThisGlobalTheme.pid = 0
                data.push(ThisGlobalTheme)
                GlobalTheme.cardthemeSet.map((Theme) =>{
                    const ThisTheme: any = {}
                    ThisTheme.title = Theme.name
                    ThisTheme.id = Theme.id * 1000
                    ThisTheme.value = Theme.id * 1000
                    ThisTheme.pId = ThisGlobalTheme.id
                    ThisGlobalTheme.isLead = false
                    data.push(ThisTheme)
                    Theme.cardsubthemeSet.map((SubTheme) =>{
                        const ThisSubTheme: any = {}
                        ThisSubTheme.title = SubTheme.name
                        ThisSubTheme.id = SubTheme.id * 1000000
                        ThisSubTheme.value = SubTheme.id * 1000000
                        ThisSubTheme.pId = Theme.id * 1000
                        ThisGlobalTheme.isLead = true
                        data.push(ThisSubTheme)
                    })

                })

            })
            // console.log(data)
            setDataForThemeTreeView(data)
        }
    })


    if(!props.sequence){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    console.log(props.sequence)
    return(
        <div>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать серию вопросов</div>
            <div className="ml-4">
                <Button
                    className="ml-5"
                    variant="outlined" color="primary" onClick={() => {
                    props.onChange("goBack")}}>
                    Назад
                </Button>
            </div>
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
                            <FormLabel component="legend">Настройки для конкретно каждого вопроса: </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch checked={use_random_position_for_answers}
                                                     onChange={(e) =>{set_use_random_position_for_answers(e.target.checked)}} name="jason" />}
                                    label="Перемешивать ли ответы в вопросах"
                                />
                                <FormControlLabel
                                    className="mr-5"
                                    label="Максимальное количество попыток для каждого вопроса"
                                    control={
                                        <TextField value={max_sum_of_attempts} onChange={(e) =>{
                                            set_max_sum_of_attempts(e.target.value)
                                        }} size="small" id="outlined-basic" label="Количество"
                                                   variant="outlined" className="col-3 mr-3 ml-2" type="number"
                                        />
                                    }
                                />
                                <FormControlLabel
                                    className="mr-5"
                                    label="Уровень сложности подсказок"
                                    control={
                                        <TextField value={hard_level} onChange={(e) =>{
                                            set_hard_level(e.target.value)
                                        }} size="small" id="outlined-basic" label="Уровень" select
                                                   variant="outlined" className="col-3 mr-3 ml-2" type="number"
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
                                <Typography style={{fontSize: 12}} color="textSecondary">
                                    Темы карточек, с которыми связан этот тест. В случае плохого прохождения,
                                    пользователю предложат перейти на карточки по этим темам:
                                </Typography>
                                <ThemeTree {...{dataForThemeTreeView, cardSelectedThemeID, cardSelectedThemeIDHandle}}
                                           className="col-3" style={{width: 300}}/>
                            </FormGroup>
                        </FormControl>
                    </Row>
                </div>
            </Row>
            <Row className="justify-content-around" >
            {props.sequence?.sequenceData?.sequence?.map((question, qIndex) =>{
                console.log(props.sequence?.sequenceData)
                return(
                    <AnswerCard className="col-3 ml-5 mt-3" key={qIndex}/>
                )
            })}
            </Row>
        </div>
    )
}