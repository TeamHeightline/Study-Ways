import {observer} from "mobx-react";
import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {CARD} from "../Elements/Cards/Card";
import CardMicroView from "../Elements/Cards/CardView/#CardMicroView";
import CourseMicroView from "../Elements/Course/Editor/CourseMicroView";
import {ReUsefulQuestionStore} from "../../Store/ReUsfulComponentsStorage/ComunityDirectionsStore/DirectionStore";
import {toJS} from "mobx";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import BlurLinearIcon from "@material-ui/icons/BlurLinear";
import ImageQuestion from "../Elements/UserTest/ImageQuestion/ImageQuestion";
import {Card, CardActionArea, Typography} from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import {QSPlayerByID} from "../Elements/QuestionSequence/Public/QSPlayerByID";
import LinearScaleIcon from '@material-ui/icons/LinearScale';

const directionStoreObject = new ReUsefulQuestionStore()
export const MainDirectionWay = observer(() =>{
    return(
        <div className="col-12" >
            <div style={{overflowY: "scroll"}}>
                <Stepper nonLinear activeStep={-10} alternativeLabel style={{width: 4000}}>
                {directionStoreObject.directionProcessedObject.map((processed_object, index) => (
                    <Step key={index}>
                        { processed_object.type === "CardElement" &&

                                <StepLabel
                                    StepIconComponent={ArtTrackIcon}

                                    onClick={() => {
                                    directionStoreObject.openCardID = Number(processed_object?.cardID)
                                    directionStoreObject.openCard()
                                }}>
                                    <div style={{width: 530, height: "170px", textAlign: "left"}} >
                                        <CardMicroView cardID={processed_object.cardID}
                                                       style={{marginLeft: 65}}
                                                       onChange={() => {
                                                           directionStoreObject.openCardID = Number(processed_object?.cardID)
                                                           directionStoreObject.openCard()
                                                        }}/>
                                    </div>
                                </StepLabel>

                        }

                        {processed_object.type === "CourseElement" &&
                                <StepLabel StepIconComponent={BlurLinearIcon} style={{width: 530, textAlign: "center"}}>
                                    {directionStoreObject?.cardCourse &&
                                        <CourseMicroView
                                            onEdit={() => {
                                                directionStoreObject.openCardID = Number(directionStoreObject.get_card_id_in_course_by_position(processed_object?.cardPositionData))
                                                directionStoreObject.openCard()
                                            }}
                                            cardPositionData={toJS(processed_object?.cardPositionData)}
                                            buttonClick={(e) => processed_object?.updateCardPositionData(e)}
                                            course={directionStoreObject?.cardCourse.find( course => Number(course.id) === Number(processed_object?.cardPositionData?.courseID))}/>}
                                </StepLabel>
                            }
                        {processed_object.type === "QuestionElement" &&
                        <StepLabel StepIconComponent={DoneAllIcon} style={{width: 530}}>
                            <Card style={{width: 400, height: 160, marginLeft: 65}} variant="outlined">
                                <CardActionArea style={{height: "100%"}} onClick={() => processed_object.handleClickOnQuestionCard()}>
                                    <Typography>
                                        {processed_object?.questionText}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </StepLabel>
                        }
                        {processed_object.type === "QuestionSequenceElement" &&
                        <StepLabel StepIconComponent={LinearScaleIcon} style={{width: 530}}>
                            <Card style={{width: 400, height: 160, marginLeft: 65}} variant="outlined">
                                <CardActionArea style={{height: "100%"}} onClick={() => processed_object.handleClickOnQuestionSequnceCard()}>
                                    <Typography>
                                        {processed_object?.qsName}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </StepLabel>
                        }
                    </Step>
                ))}
                </Stepper>
            </div>
            <div>
                {directionStoreObject.isOpenCard  && <CARD disableAllButtons={true} id={directionStoreObject.openCardID}/>}
                {directionStoreObject.isOpenQuestion && <ImageQuestion id={directionStoreObject.openQuestionID}/>}
                {directionStoreObject.isOpenQuestionSequence && <QSPlayerByID notShowStepLabet={true} id={directionStoreObject.openQuestionSequenceID}/>}

            </div>
        </div>
    )
})