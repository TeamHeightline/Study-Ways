import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {CARD} from "../Elements/Cards/Card";
import CardMicroView from "../Elements/Cards/CardView/#CardMicroView";
import CourseMicroView from "../Elements/Course/Editor/CourseMicroView";
import {DirectionStore} from "../../Store/InDevComponentsStorage/ComunityDirectionsStore/DirectionStore";
import {toJS} from "mobx";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import {ImageQuestion} from "../Elements/UserTest/ImageQuestion/ImageQuestion";
import {Card, CardActionArea, Typography} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {QSPlayerByID} from "../Elements/QuestionSequence/Public/QSPlayerByID";
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import {directionData} from "../../Store/InDevComponentsStorage/ComunityDirectionsStore/Struct";

const maxWidthOfElement = 530
const directionStoreObject = new DirectionStore()

export const MainDirection = observer((directionDataProps) =>{
    useEffect(() =>{
        directionStoreObject.setDirectionData(directionDataProps)
    }, [directionDataProps])

    return(
        <div className="col-12" >
            <div style={{overflowX: "auto", overflowY: "hidden", minHeight: 235}}>
                <Stepper nonLinear activeStep={-10} alternativeLabel style={{width: maxWidthOfElement * directionStoreObject.DirectionProcessedObjectsForRender.length}}>
                {directionStoreObject.DirectionProcessedObjectsForRender.map((processed_object, index) => (
                    <Step key={index}>
                        { processed_object.type === "CardElement" &&
                                <StepLabel
                                    StepIconComponent={ArtTrackIcon}
                                    style={{width: maxWidthOfElement, height: 180}}
                                    onClick={() => {
                                    directionStoreObject.openCardID = Number(processed_object?.cardID)
                                    directionStoreObject.openCard()
                                }}>
                                    <div  style={{textAlign: "left", marginLeft: (maxWidthOfElement - 400) / 2}}>
                                        <CardMicroView cardID={processed_object.cardID}
                                                       onChange={() => {
                                                           directionStoreObject.openCardID = Number(processed_object?.cardID)
                                                           directionStoreObject.openCard()
                                                        }}/>
                                    </div>
                                </StepLabel>

                        }
                        {processed_object.type === "CourseElement" &&
                                <StepLabel StepIconComponent={BlurLinearIcon} style={{width: maxWidthOfElement, textAlign: "center"}}>
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
                        <StepLabel StepIconComponent={DoneAllIcon} style={{width: maxWidthOfElement}}>
                            <Card style={{width: 400, height: 160, marginLeft: (maxWidthOfElement - 400) / 2}} variant="outlined">
                                <CardActionArea style={{height: "100%"}} onClick={() => processed_object.handleClickOnQuestionCard()}>
                                    <Typography>
                                        {processed_object?.questionText}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </StepLabel>
                        }
                        {processed_object.type === "QuestionSequenceElement" &&
                        <StepLabel StepIconComponent={LinearScaleIcon} style={{width: maxWidthOfElement}}>
                            <Card style={{width: 400, height: 160, marginLeft: (maxWidthOfElement - 400) / 2}} variant="outlined">
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
            <div style={{minHeight: 570, overflowX: "hidden"}}>
                {directionStoreObject.isOpenCard  && <CARD disableAllButtons={true} id={directionStoreObject.openCardID}/>}
                {directionStoreObject.isOpenQuestion && <ImageQuestion id={directionStoreObject.openQuestionID}/>}
                {directionStoreObject.isOpenQuestionSequence && <QSPlayerByID notShowStepLabet={true} id={directionStoreObject.openQuestionSequenceID}/>}
            </div>
        </div>
    )
})