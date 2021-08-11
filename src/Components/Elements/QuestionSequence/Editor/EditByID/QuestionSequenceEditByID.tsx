import React, {useState} from 'react'
import {GET_THEMES, UPDATE_QUESTION_SEQUENCE, useStyles} from "./Struct";
import {useMutation, useQuery} from "@apollo/client";
import { Row, Spinner} from "react-bootstrap";
import {
    Button, Card, CardActionArea,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel, MenuItem, Snackbar,
    Switch,
    TextField, Typography
} from "@material-ui/core";
import ThemeTree from "../../../Cards/Editor/CardEditByID/#ThemeTree";
import QuestionCard from "./#QuestionCard";

import {Mutation} from "../../../../../../SchemaTypes";
import {Alert} from "@material-ui/lab";
import CardMedia from "@material-ui/core/CardMedia";

export default function QuestionSequenceEditByID({...props}: any) {

    const [use_random_position_for_questions, set_use_random_position_for_questions] = useState<boolean | undefined>(props?.sequence?.sequenceData?.settings?.use_random_position_for_questions) //Включить перемешивание вопросов
    const [can_switch_pages, set_can_switch_pages] = useState<boolean | undefined>(props?.sequence?.sequenceData?.settings?.can_switch_pages) // Резрешить переключение между вопросами
    const [show_help_text, set_show_help_text] = useState<boolean | undefined>(props?.sequence?.sequenceData?.settings?.show_help_text) //Показывать подсказки или нет
    const [need_await_full_true_answers, set_need_await_full_true_answers] = useState<boolean | undefined>(props?.sequence?.sequenceData?.settings?.need_await_full_true_answers) //Нужно ли ждать пока пользователь выбирет все правильные ответы
    const [max_sum_of_attempts, set_max_sum_of_attempts] = useState<string | undefined>(props?.sequence?.sequenceData?.settings?.max_sum_of_attempts) //Максимальное количество попыток для каждого вопроса
    const [hard_level, set_hard_level] = useState<string>(props?.sequence?.sequenceData?.settings?.hard_level) //"EASY" "HARD", "MEDIUM" Уровень сложности подсказок
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState(props?.sequence?.sequenceData?.settings?.card_themes) //Темы карточек, на которые этот тест
    const [dataForThemeTreeView, setDataForThemeTreeView] = useState([])//Нужно для дерева тем
    const [use_random_position_for_answers, set_use_random_position_for_answers] = useState<boolean | undefined>(props?.sequence?.sequenceData?.settings?.use_random_position_for_answers) //Перемешивать ли ответы в вопросах
    const [questionsIDArray, setQuestionsIDArray] = useState<(number| null)[] >(props?.sequence?.sequenceData?.sequence)//Нужно для хранения массива айдишников вопросов
    const [sequenceName, setSequenceName] = useState<string>(props?.sequence?.name)//Название последовательности вопросов


    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()

    const [updateQuestionSequence] = useMutation<Mutation, {sequenceData: any, sequenceId: number, name: string}>(UPDATE_QUESTION_SEQUENCE, {
            variables:{
                sequenceId: props?.sequence?.id,
                name: sequenceName,
                sequenceData: {
                    settings: {
                        can_switch_pages: can_switch_pages,//может ли пользователь сам переключаться между вопросами
                        use_random_position_for_questions: use_random_position_for_questions, //Перемешивать ли все вопросы в серии вопросов
                        show_help_text: show_help_text,//Показывать подсказки или нет
                        need_await_full_true_answers: need_await_full_true_answers, //Нужно ли ждать пока пользователь ответит все правильно, или можно переключаться дальше
                        use_random_position_for_answers: use_random_position_for_answers, //Перемешивать ли ответы
                        max_sum_of_attempts: max_sum_of_attempts, //Максимальное количество попыток
                        hard_level: hard_level,// "HARD", "MEDIUM", "EASY"
                        card_themes: cardSelectedThemeID//массив айдишников тех тем, на которые этот вопрос
                    },
                    sequence: questionsIDArray //массив ID вопросов
                }

            },
        onCompleted: () =>{
                setStateOfSave(2)}
        })

    const autoSave = () =>{
        clearTimeout(autoSaveTimer)
        setStateOfSave(0)
        changeAutoSaveTimer(setTimeout(() => {
            setStateOfSave(1)
            console.log("-----autosave-------")
            updateQuestionSequence()
        }, 4000))
    }
    const cardSelectedThemeIDHandle = (e) =>{
        autoSave()
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
            setDataForThemeTreeView(data)
        }
    })
    const classes = useStyles();
    const addQuestion = () =>{
        autoSave()
        const __questionsIDArray =[...questionsIDArray]
        __questionsIDArray.push(null)
        setQuestionsIDArray(__questionsIDArray)
    }

    if(!props.sequence){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
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
                {/*Обманный ход, чтобы текстовое поле было на такой же позиции, что и меню, которое под ним*/}
                <TextField value={sequenceName}
                           onChange={(e) =>{
                                autoSave()
                                setSequenceName(e.target.value)
                           }}
                           size="small"
                           label="Название серии вопросов"
                           variant="outlined" className="ml-5 col-5"
                />
                {/*Этот див нужен только для того, чтобы правильно поставить текстовое поле кодом выше*/}
                <div className="col-5">
                </div>
            </Row>
            <Row className="justify-content-around">
                <FormControl component="fieldset" className="mt-2 ml-5 col-5">
                    <FormLabel component="legend">Настройки серии вопросов:</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={use_random_position_for_questions}
                                             onChange={(e) => {
                                                 autoSave()
                                                 set_use_random_position_for_questions(e.target.checked)
                                             }} name="gilad"/>}
                            label="Включить перемешивание вопросов"
                        />
                        <FormControlLabel
                            control={<Switch checked={can_switch_pages}
                                             onChange={(e) =>{
                                                 autoSave()
                                                 set_can_switch_pages(e.target.checked)
                                             }} name="jason" />}
                            label="Резрешить переключение между вопросами"
                        />
                        <FormControlLabel
                            control={<Switch checked={show_help_text}
                                             onChange={(e) =>{
                                                 autoSave()
                                                 set_show_help_text(e.target.checked)
                                             }} name="jason" />}
                            label="Показывать подсказки или нет"
                        />
                        <FormControlLabel
                            control={<Switch checked={need_await_full_true_answers}
                                             onChange={(e) =>{
                                                 autoSave()
                                                 set_need_await_full_true_answers(e.target.checked)
                                             }} name="jason" />}
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
                                                     onChange={(e) =>{
                                                         autoSave()
                                                         set_use_random_position_for_answers(e.target.checked)
                                                     }} name="jason" />}
                                    label="Перемешивать ли ответы в вопросах"
                                />
                                <FormControlLabel
                                    className="mr-5"
                                    label="Максимальное количество попыток для каждого вопроса"
                                    control={
                                        <TextField value={max_sum_of_attempts} onChange={(e) =>{
                                            autoSave()
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
                                            autoSave()
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
                <div className="col-3 ml-5 mt-3">
                    <Card className={classes.root} style={{padding: 0}} >
                        <CardMedia
                            className={classes.cover}
                            image="https://www.shareicon.net/data/256x256/2017/03/06/880378_blue_512x512.png"
                            title="add question"
                        />
                        <CardActionArea onClick={() =>{addQuestion()}}>
                            <div className="display-4 text-center" style={{fontSize: '33px'}}>Добавить вопрос</div>
                        </CardActionArea>
                    </Card>
                </div>
            {questionsIDArray && questionsIDArray?.map((question, qIndex) =>{
                return(
                    <QuestionCard className="col-3 ml-5 mt-3" key={qIndex}
                                  questionID={question}
                                  onChange={(data) =>{
                        autoSave()
                        const newQuestionsIDArray =[...questionsIDArray]
                        newQuestionsIDArray[qIndex] = data
                        setQuestionsIDArray(newQuestionsIDArray)
                    }}/>
                )
            })}
            </Row>
            <Snackbar open={true}>
                <Alert severity="info">
                    {stateOfSave === 0 &&
                    "Изменения не сохранены"}
                    {stateOfSave === 1 &&
                    "Автосохранение"}
                    {stateOfSave === 2 &&
                    "Сохранено"}
                </Alert>
            </Snackbar>
        </div>
    )
}