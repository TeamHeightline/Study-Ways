import {Alert} from "@material-ui/lab";
import {Accordion} from "react-bootstrap";
import BootstrapCard from "react-bootstrap/Card";
import {Button} from "@material-ui/core";
import ReactPlayer from "react-player";
import React from "react";
import useWindowDimensions from "../../../../CustomHooks/useWindowDimensions";

export default function HelpText(props: { errorArray: any[], helpLevel: unknown, answers: any, activeWrongAnswerIndex: number, b: boolean }) {
    const {width, height} = useWindowDimensions()
    return <div className=" mt-2" style={{padding: 0, overflowY: "scroll",}}>
        {props.errorArray.length !== 0 ? <div className="col-lg-10 col-12 offset-lg-1">
            {props.helpLevel === "0" ? <Alert severity="error" variant="outlined">
                {props.answers[props.activeWrongAnswerIndex]?.helpTextv1}</Alert> : null}
            {props.helpLevel === "1" ? <Alert severity="error" variant="outlined">
                {props.answers[props.activeWrongAnswerIndex]?.helpTextv2}</Alert> : null}
            {props.helpLevel === "2" ? <Alert severity="error" variant="outlined">
                {props.answers[props.activeWrongAnswerIndex]?.helpTextv3}</Alert> : null}
            {props.answers[props.activeWrongAnswerIndex]?.videoUrl ?
                <div>
                    {props.b ?
                        <Accordion>
                            <BootstrapCard>
                                <BootstrapCard.Header>
                                    <Accordion.Toggle as={Button} eventKey="1">
                                        Отобразить видео подсказку
                                    </Accordion.Toggle>
                                </BootstrapCard.Header>
                                <Accordion.Collapse eventKey="1">
                                    <ReactPlayer url={props.answers[props.activeWrongAnswerIndex]?.videoUrl}
                                                 controls autoPlay={true}/>
                                </Accordion.Collapse>
                            </BootstrapCard>
                        </Accordion> : null}
                </div> : null}
        </div> : null}
    </div>;
}
