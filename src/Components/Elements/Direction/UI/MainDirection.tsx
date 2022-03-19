import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {DirectionStore} from "../Store/DirectionStore";
import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import {QuestionByID} from "../../Question/QuestionByID/QuestionByID";
import {Card, CardActionArea, Typography} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {QSPlayerByID} from "../../QuestionSequence/Public/QSPlayerByID";
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import CourseMicroView from "../../Course/CourseMicroView/V2/UI/CourseMicroView";
import CardElement from "./card-element";
import {directionDataType} from "../Store/Struct";
import CardByID from "../../Cards/CardByID/UI/card-by-id";

const maxWidthOfElement = 530
type MainDirectionProps = {
    directionDataProps?: directionDataType[]
}
export const MainDirection = observer(({directionDataProps}: MainDirectionProps) => {
    const [DSObject] = useState(new DirectionStore())
    useEffect(() => {
        DSObject.setDirectionData(directionDataProps)
    }, [directionDataProps])

    return (
        <div>
            <div style={{overflowX: "auto", overflowY: "hidden", minHeight: 235}}>
                <Stepper
                    nonLinear
                    activeStep={-10}
                    alternativeLabel
                    style={{width: maxWidthOfElement * DSObject.ObjectsForRender.length}}>
                    {DSObject.ObjectsForRender?.map((element, index) => (
                        <Step key={index + "Step"}>
                            {element.type === "CardElement" &&
                                <CardElement
                                    key={"CardElement" + element.id}
                                    maxWidthOfElement={maxWidthOfElement}
                                    element={element}
                                    DSObject={DSObject}/>
                            }
                            {element.type === "CourseElement" &&
                                <StepLabel StepIconComponent={BlurLinearIcon}
                                           key={"CourseElement" + element.id}
                                           style={{width: maxWidthOfElement, textAlign: "center"}}>
                                    {DSObject?.cardCourse &&
                                        <CourseMicroView course_id={Number(element?.cardPositionData?.courseID)}/>}
                                </StepLabel>
                            }
                            {element.type === "QuestionElement" &&
                                <StepLabel
                                    key={"QuestionElement" + element.id}
                                    StepIconComponent={DoneAllIcon}
                                    style={{width: maxWidthOfElement}}>
                                    <Card
                                        style={{
                                            width: 400,
                                            height: 160,
                                            marginLeft: (maxWidthOfElement - 400) / 2
                                        }}
                                        variant="outlined">
                                        <CardActionArea style={{height: "100%"}}
                                                        onClick={() => element.handleClickOnQuestionCard()}>
                                            <Typography>
                                                {element?.questionText}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </StepLabel>
                            }
                            {element.type === "QuestionSequenceElement" &&
                                <StepLabel
                                    key={"QuestionSequenceElement" + index}
                                    StepIconComponent={LinearScaleIcon}
                                    style={{width: maxWidthOfElement}}>
                                    <Card
                                        style={{
                                            width: 400,
                                            height: 160,
                                            marginLeft: (maxWidthOfElement - 400) / 2
                                        }}
                                        variant="outlined">
                                        <CardActionArea style={{height: "100%"}}
                                                        onClick={() => element.handleClickOnQuestionSequnceCard()}>
                                            <Typography>
                                                {element?.qsName}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </StepLabel>
                            }
                        </Step>
                    ))}
                </Stepper>
            </div>
            <div style={{overflowX: "hidden"}}>
                {DSObject.isOpenCard && <CardByID card_id={DSObject.openCardID}/>}
                {DSObject.isOpenQuestion && <QuestionByID id={DSObject.openQuestionID}/>}
                {DSObject.isOpenQuestionSequence &&
                    <QSPlayerByID notShowStepLabet={true} id={DSObject.openQuestionSequenceID}/>}
            </div>
        </div>
    )
})