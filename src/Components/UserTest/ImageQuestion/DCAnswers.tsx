import Row from "react-bootstrap/Row";
import React from "react";
import './Style.css'

export default function DCAnswers(props: { height: number, width: number, answers: any, element: (answer, answerIndex) => JSX.Element }) {
    return <div style={{overflowY: "scroll", msOverflowStyle: "scrollbar",}} className="enableScrollbar">
        <div
            style={{width: props.height / props.width >= 1 ? props.answers.length * (props.width + 60) : props.answers.length * 400}}>
            <Row className="justify-content-around">
                {props.answers.map(props.element)}
            </Row>
        </div>
    </div>;
}