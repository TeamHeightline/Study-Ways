import React, {useState} from 'react'
import {UPDATE_QUESTION_SEQUENCE, useStyles} from "./Struct";
import {useMutation} from "@apollo/client";
import {
    Button, Card, CardActionArea, CircularProgress, Grid, Paper,
    Snackbar, Stack,
    TextField, Typography
} from "@mui/material";
import QuestionCard from "./QuestionCard";

import {Mutation} from "../../../../../SchemaTypes";
import {Alert} from '@mui/material';
import CardMedia from "@mui/material/CardMedia";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

export default function QuestionSequenceEditByID({...props}: any) {
    const isMobile = isMobileHook()
    const [questionsIDArray, setQuestionsIDArray] = useState<any[]>(props?.sequence?.sequenceData?.sequence ? props?.sequence?.sequenceData?.sequence : [])//Нужно для хранения массива айдишников вопросов
    const [sequenceName, setSequenceName] = useState<string>(props?.sequence?.name)//Название последовательности вопросов
    const [sequenceDescription, setSequenceDescription] = useState<string>(props?.sequence?.description)
    const [manualReload, setManualReload] = useState(true)


    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()

    const getSequenceQuestionArrayWithoutNull = () => {
        return (questionsIDArray.filter((question) => question !== null && typeof question !== 'object'))
    }

    const [updateQuestionSequence] = useMutation<Mutation, { sequenceData: any, sequenceId: number, name: string, description: string }>
    (UPDATE_QUESTION_SEQUENCE, {
        variables: {
            sequenceId: props?.sequence?.id,
            name: sequenceName ? sequenceName : "Название по умолчанию",
            description: sequenceDescription ? sequenceDescription : "Описание по умолчанию",
            sequenceData: {
                sequence: getSequenceQuestionArrayWithoutNull() //массив ID вопросов
            }

        },
        onError: () => {
            void (0)
        },
        onCompleted: () => {
            setStateOfSave(2)
        }
    })


    const autoSave = () => {
        clearTimeout(autoSaveTimer)
        setStateOfSave(0)
        changeAutoSaveTimer(setTimeout(() => {
            setStateOfSave(1)
            console.log("-----autosave-------")
            updateQuestionSequence()
        }, 4000))
    }

    const classes = useStyles();
    const addQuestion = () => {
        autoSave()
        setQuestionsIDArray(questionsIDArray.concat({SyntheticBaseEvent: true}))
    }

    if (!props.sequence) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <Paper elevation={0} sx={{pl: 8}}>
            <Stack alignItems={"center"}>
                <Typography variant="h4">Редактировать серию вопросов</Typography>
            </Stack>
            <Button
                sx={{p: 1, minWidth: isMobile ? undefined : 300}}
                variant="outlined" color="primary" onClick={() => {
                props.onChange("goBack")
            }}>
                Назад
            </Button>

            <Stack direction={isMobile ? "column" : "row"} spacing={4} sx={{pt: 2, width: "100%"}}>
                <Stack direction={"column"} spacing={2} sx={{minWidth: isMobile ? undefined : 400}}>
                    <TextField value={sequenceName}
                               onChange={(e) => {
                                   autoSave()
                                   setSequenceName(e.target.value)
                               }}
                               size="small"
                               label="Название серии вопросов"
                               variant="outlined"
                               multiline
                               fullWidth
                    />
                    <TextField value={sequenceDescription}
                               onChange={(e) => {
                                   autoSave()
                                   setSequenceDescription(e.target.value)
                               }}
                               size="small"
                               label="Описание серии вопросов"
                               variant="outlined"
                               fullWidth
                    />
                </Stack>
                <Stack direction={"column"} spacing={2}>
                    <Typography variant={"body2"} sx={{color: "white"}}>
                        {"Режим обучения - https://sw-university.com/qs/" + props?.sequence?.id}
                    </Typography>
                    <Typography variant="body2" sx={{color: "white"}}>
                        {"Режим экзамена - https://sw-university.com/qs/" + props?.sequence?.id + "?exam=true"}
                    </Typography>
                </Stack>
            </Stack>

            <Grid container spacing={4} sx={{pt: 4}}>
                <Grid item xs={12} md={3}>
                    <Card variant="outlined" className={classes.root} style={{padding: 0}}>
                        <CardMedia
                            className={classes.cover}
                            image="https://www.shareicon.net/data/256x256/2017/03/06/880378_blue_512x512.png"
                            title="add question"
                        />
                        <CardActionArea onClick={() => {
                            addQuestion()
                        }}>
                            <Stack alignItems={"center"} justifyContent={"center"} sx={{p: 4}}>
                                <Typography variant={"h4"}>
                                    Добавить вопрос
                                </Typography>
                            </Stack>
                        </CardActionArea>
                    </Card>
                </Grid>
                {questionsIDArray && questionsIDArray?.map((question, qIndex) => {
                    return (
                        <Grid item xs={12} md={3}>
                            <QuestionCard key={question + "Key" + qIndex}
                                          questionID={question}
                                          onDeleteClick={() => {
                                              const __questionIDArray = questionsIDArray
                                              __questionIDArray.splice(qIndex, 1)
                                              setQuestionsIDArray(__questionIDArray)
                                              setManualReload(!manualReload)
                                          }}
                                          onChange={(data) => {
                                              autoSave()
                                              const newQuestionsIDArray = [...questionsIDArray]
                                              newQuestionsIDArray[qIndex] = data
                                              setQuestionsIDArray(newQuestionsIDArray)
                                          }}/>
                        </Grid>
                    )
                })}
            </Grid>
            <Snackbar open={true} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                <Alert severity="info">
                    {stateOfSave === 0 &&
                        "Изменения не сохранены"}
                    {stateOfSave === 1 &&
                        "Автосохранение"}
                    {stateOfSave === 2 &&
                        "Сохранено"}
                </Alert>
            </Snackbar>
        </Paper>
    )
}