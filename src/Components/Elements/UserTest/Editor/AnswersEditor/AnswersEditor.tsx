import {observer} from "mobx-react";
import React from 'react'
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Collapse, Grid, Stack, Switch} from "@mui/material";
import {AnswerText} from "./#AnswerText";
import {AnswerHelpTextV1} from "./#AnswerHelpTextV1";
import {AnswerHelpTextV2} from "./#AnswerHelpTextV2";
import {AnswerHelpTextV3} from "./#AnswerHelpTextV3";
import {AnswerVideoUrl} from "./#AnswerVideoUrl";
import {AnswerHardLevel} from "./#AnswerHardLevel";
import {AnswerIsTrue} from "./#AnswerIsTrue";
import {AnswerCheckQueue} from "./#AnswerCheckQueue";
import {AnswerImage} from "./#AnswerImage";
import {AnswerPreview} from "./#AnswerPreview";
import {AnswerSavingNotification} from "./#AnswerSavingNotification";
import {AnswerDeleteOrDisableAnswerMenu} from "./#AnswerDeleteOrDisableAnswerMenu";
import {AnswerDeleteDialog} from "./#AnswerDeleteDialog";
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import {AnswerIsRequired} from "./#AnswerIsRequired";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

const useStyles = makeStyles(() =>
    createStyles({
        answerContent:{
            paddingLeft: "50px",
            paddingRight: "50px",
        },
        savingNotification:{
            marginTop: "10px",
        }
    }),
);

export const AnswersEditor = observer(() => {
    const classes = useStyles();
    const isMobile = isMobileHook()
    if(!QuestionEditorStorage.questionHasBeenSelected){
        return (
            <></>
        )
    }
    return <>
        <Typography className="display-4 text-center mt-3 col-12" style={{fontSize: '33px'}}>Редактировать ответы</Typography>
        {QuestionEditorStorage.answers.filter(answer => answer.isDeleted === false)?.map((answer) =>{
            console.log(answer.isRequired)
            return (
                <div className={isMobile ? "mt-3": "pr-md-5 mt-3"} key={answer.id + "AnswerKey"}>
                    <Paper  variant="outlined">
                        <br/>
                        <Stack direction={"row"} >
                            <Typography className={isMobile ? "pl-2": "pl-5"} variant={isMobile ? "body1":"h6"}
                                        color="inherit">
                                {"ID: " + answer.id + " " + answer.text}
                            </Typography>
                            <AnswerDeleteOrDisableAnswerMenu answer={answer}/>
                        </Stack>
                        <AnswerDeleteDialog answer={answer}/>

                        <FormControlLabel
                            control={<Switch checked={QuestionEditorStorage.activeEditAnswerIDSet.has(answer.id)}
                                             onChange={() => {QuestionEditorStorage.changeActiveEditAnswerIDSet(answer.id)}} />}
                            label="Редактировать"
                            className="pl-5"
                        />
                        <Collapse in={QuestionEditorStorage.activeEditAnswerIDSet.has(answer.id)}>
                            <div >
                                <Grid container spacing={isMobile? 0: 8} justifyContent="space-around"
                                      className={!isMobile ? classes.answerContent: ""}>
                                    <Grid item md={6} xs={12} >
                                        <AnswerText answer={answer} />
                                        <AnswerHelpTextV1 answer={answer} style={{marginTop: 12}}/>
                                        <AnswerVideoUrl answer={answer} style={{marginTop: 12}}/>
                                        <Grid item container xs={12} spacing={3} style={{marginTop: 6}}>
                                            <Grid item md={5} xs={12}>
                                                <AnswerCheckQueue answer={answer} />
                                            </Grid>
                                            <Grid item md={7} xs={12}>
                                                <AnswerImage answer={answer}/>
                                            </Grid>
                                        </Grid>
                                        <AnswerPreview answer={answer}/>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <AnswerHelpTextV2 answer={answer}/>
                                        <AnswerHelpTextV3 answer={answer} style={{marginTop: 12}}/>
                                        <Grid item container spacing={3} xs={12} justifyContent="space-between" style={{marginTop: 12}}>
                                            <Grid item md={6} xs={12}>
                                                <AnswerHardLevel answer={answer}/>
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <AnswerIsTrue answer={answer}/>
                                            </Grid>
                                        </Grid>
                                        <Grid item container spacing={0} xs={12}>
                                            <Grid item md={6} xs={12}>
                                                <AnswerIsRequired answer={answer}/>
                                            </Grid>
                                            <Grid item md={6} xs={12} className={classes.savingNotification}>
                                                <AnswerSavingNotification answer={answer}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Collapse>
                        <br/>
                        <br/>
                    </Paper>
                </div>
            );
        })}
    </>;
})