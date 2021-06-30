import React from 'react'
import LCUserTestThemeEditor from "./UserTestThemeEditor/#[LC]UserTestThemeEditor";
import LCUserTestAuthorEditor from "./UserTestAuthorEditor/#[LC]UserTestAuthorEditor";
import LCCardThemeEditor from "./CardThemeEditor/#[LC]CardThemeEditor";
import LCCardAuthorEditor from "./CardAuthorEditor/#[LC]CardAuthorEditor";
import {Row} from "react-bootstrap";

export default function SearchingElementsPage({...props}: any){
    return(
        <div {...props}>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Темы и виртуальные авторы для карточек</div>
            <Row className="justify-content-around mt-3">
                <LCCardThemeEditor/>
                <LCCardAuthorEditor/>
            </Row>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Темы и виртуальные авторы для вопросов и тестов</div>
            <Row className="justify-content-around mt-4">
                <LCUserTestThemeEditor/>
                <LCUserTestAuthorEditor/>
            </Row>
            <br/>
            {/*Для того, чтобы можно было скроллить страницу вниз, ну и для того, чтобы поместилось
            текстовое поле для редактирования*/}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    )
}