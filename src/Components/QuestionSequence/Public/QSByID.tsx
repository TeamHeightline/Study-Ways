import React, {useState} from 'react';
import {QSBYID} from "./Struct";
import {useQuery} from "@apollo/client";
import {Query} from "../../../../SchemaTypes";
import {Spinner} from "react-bootstrap";
import {Step, StepLabel, Stepper} from "@material-ui/core";
import ImageQuestion from "../../UserTest/ImageQuestion";
export default function QSByID({props}: any) {
    const [activeQuestionIndex, setQuestionIndex] = useState(0)
    const {data: q_s_data} = useQuery<Query, any>(QSBYID, {
        variables:{
            id: 19 //вместо передаваемого ID
        }
    })

    if(!q_s_data){
        return (<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }
    console.log(q_s_data?.questionSequenceById?.sequenceData?.settings?.hard_level)
    console.log()
    return(
        <div>
            <Stepper alternativeLabel activeStep={activeQuestionIndex}>
                {q_s_data?.questionSequenceById?.sequenceData?.sequence?.map((label, lIndex) => (
                    <Step key={lIndex}>
                        <StepLabel>{lIndex}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <ImageQuestion id={q_s_data?.questionSequenceById?.sequenceData?.sequence[activeQuestionIndex]}
                           hard_level={q_s_data?.questionSequenceById?.sequenceData?.settings?.hard_level === "HARD" ? "2" :
                               q_s_data?.questionSequenceById?.sequenceData?.settings?.hard_level === "MEDIUM" ? "1": "0"}
                           show_help_text={q_s_data?.questionSequenceById?.sequenceData?.settings?.show_help_text}
                           open_from_sequence={true}
                           can_switch_to_previous_question={q_s_data?.questionSequenceById?.sequenceData?.settings?.can_switch_pages &&
                           activeQuestionIndex !==0}
                           can_switch_to_next_question={q_s_data?.questionSequenceById?.sequenceData?.settings?.can_switch_pages &&
                           activeQuestionIndex !== q_s_data?.questionSequenceById?.sequenceData?.sequence.length}
                           ButtonClick={(data) =>{
                               if(data === "goToPreviousQuestion"){
                                   setQuestionIndex(activeQuestionIndex - 1)
                               }
                               if(data === "goToNextQuestion"){
                                   setQuestionIndex(activeQuestionIndex + 1)
                               }
                           }}
            />
        </div>
    )
}