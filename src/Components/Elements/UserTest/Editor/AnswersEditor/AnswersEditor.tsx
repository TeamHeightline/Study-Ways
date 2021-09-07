import {observer} from "mobx-react";
import React from 'react'
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Collapse, Grid, Switch} from "@material-ui/core";
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
import { makeStyles, createStyles } from '@material-ui/core/styles';

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
    if(!QuestionEditorStorage.questionHasBeenSelected){
        return (
            <></>
        )
    }
    return(
        <>
            <Typography className="display-4 text-center mt-3 col-12" style={{fontSize: '33px'}}>Редактировать ответы</Typography>
            {QuestionEditorStorage.answers.filter(answer => answer.isDeleted === false)?.map((answer) =>{
                return(
                    <div className="mr-2 ml-2 mt-3 " key={answer.id + "AnswerKey"}>
                        <Paper elevation={3} variant="outlined" className="ml-5 mr-5">
                            <br/>
                            <Grid container spacing={1} xs={12} >
                                <Grid item xs={11}>
                                    <Typography className="ml-5" variant="h6"  color="inherit">{"ID: " + answer.id + " " + answer.text}</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <AnswerDeleteOrDisableAnswerMenu answer={answer}/>
                                </Grid>
                            </Grid>
                            <AnswerDeleteDialog answer={answer}/>

                            <FormControlLabel
                                control={<Switch checked={QuestionEditorStorage.activeEditAnswerIDSet.has(answer.id)}
                                                 onChange={() => {QuestionEditorStorage.changeActiveEditAnswerIDSet(answer.id)}} />}
                                label="Редактировать"
                                className="ml-5"
                            />
                            <Collapse in={QuestionEditorStorage.activeEditAnswerIDSet.has(answer.id)}>
                                <div >
                                    <Grid container spacing={8} justify="space-around" className={classes.answerContent}>
                                        <Grid item md={6} xs={12}>
                                            <AnswerText answer={answer} />
                                            <AnswerHelpTextV1 answer={answer} />
                                            <AnswerVideoUrl answer={answer} />
                                            <Grid item container xs={12} spacing={3} >
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
                                            <AnswerHelpTextV3 answer={answer}/>
                                            <Grid item container spacing={3} xs={12} justify="space-between">
                                                <Grid item md={6} xs={12}>
                                                    <AnswerHardLevel answer={answer}/>
                                                </Grid>
                                                <Grid item md={6} xs={12}>
                                                    <AnswerIsTrue answer={answer}/>
                                                </Grid>
                                            </Grid>
                                            <Grid item container spacing={0} xs={12}>
                                                <Grid item md={6} xs={12}>
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
                )
            })}
        </>
    )
})