import * as React from 'react'
import {Row} from "react-bootstrap";
import {CardShow} from  './cardShow';


class MainPage extends React.Component{
    render(){
        return(
            <div>
                <div className="text-center display-4 mt-2 ">Последние просмоторенные карточки</div>
                <Row className="justify-content-center">
                    <CardShow/>
                </Row>
            </div>
        )}}


export {MainPage}
