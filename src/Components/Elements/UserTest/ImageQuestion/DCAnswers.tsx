import Row from "react-bootstrap/Row";
import React from "react";
import './Style.css'

export default function DCAnswers(props: any) {
    //Если выста/ширину > 1, значит это открыто со смартфора, тогда включаем скролл props.answers.length * (props.width + 60), если
    //это открыто с пк и сколлбар включен, тогда ширина  = props.width, если мы открыли с пк
    //и не включили скроллбар, то ширина = props.answers.length * 400
    return <div style={{overflowX: (props?.isUseScrollbar || (props.height / props.width >= 1)) ? "auto" : undefined, msOverflowStyle: "scrollbar",}} className="enableScrollbar">
        <div
            style={{width: props.height / props.width >= 1 ?
                    props.answers.length * (props.width + 60):
                    props?.isUseScrollbar ? props.answers.length * 400:
                        props.width}}>
            <Row className="justify-content-around col-12">
                {props.answers.map(props.element)}
            </Row>
        </div>
    </div>;
}