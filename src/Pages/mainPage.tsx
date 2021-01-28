import * as React from 'react'
import {Row} from "react-bootstrap";
import CardShow from  './cardShow';


export const mainPage = () =>  (
    <div>
    <div className="text-center display-4 mt-2 ">Последние просмоторенные карточки</div>
    <Row className="justify-content-center">
    <CardShow/>
    </Row>
    </div>
)

export default mainPage
