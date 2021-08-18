import {observer} from "mobx-react";
import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {CARD} from "../Elements/Cards/Card";
import CardMicroView from "../Elements/Cards/CardView/#CardMicroView";
import CourseMicroView from "../Elements/Course/Editor/CourseMicroView";
import {ReUsefulQuestionStore} from "../../Store/ReUsfulComponentsStorage/ComunityDirectionsStore/ReUsfulDirectionStore";
import {toJS} from "mobx";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import BlurLinearIcon from "@material-ui/icons/BlurLinear";
import ImageQuestion from "../Elements/UserTest/ImageQuestion/ImageQuestion";
import {Card, CardActionArea, Typography} from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";

const directionStoreObject = new ReUsefulQuestionStore()
export const MainDirectionWay = observer(() =>{
    return(
        <div className="col-12" >
            <div style={{overflowY: "scroll"}}>
                <Stepper nonLinear activeStep={-10} alternativeLabel>
                {directionStoreObject.directionProcessedObject.map((processed_object, index) => (
                    <Step key={index}>
                        { processed_object.type === "CardElement" &&

                                <StepLabel
                                    StepIconComponent={ArtTrackIcon}

                                    onClick={() => {
                                    directionStoreObject.openCardID = Number(processed_object?.cardID)
                                    directionStoreObject.openCard()
                                }}>
                                    <div style={{width: "400px", height: "170px", textAlign: "left"}}>
                                        <CardMicroView cardID={processed_object.cardID}
                                                       onChange={() => {
                                                           directionStoreObject.openCardID = Number(processed_object?.cardID)
                                                           directionStoreObject.openCard()
                                                        }}/>
                                    </div>
                                </StepLabel>

                        }

                        {processed_object.type === "CourseElement" &&
                                <StepLabel StepIconComponent={BlurLinearIcon} className="pl-5">
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
                        <StepLabel StepIconComponent={DoneAllIcon}>
                            <Card style={{width: 400, height: 160}} variant="outlined">
                                <CardActionArea style={{height: "100%"}} onClick={() => processed_object.handleClickOnQuestionCard()}>
                                    <Typography>
                                        {processed_object?.questionText}
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
            </div>
        </div>
    )
})