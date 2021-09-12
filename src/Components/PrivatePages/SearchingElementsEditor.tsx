import React from 'react'
import LCUserTestThemeEditor from "../Elements/SearchingElements/UserTestThemeEditor/#[LC]UserTestThemeEditor";
import LCUserTestAuthorEditor from "../Elements/SearchingElements/UserTestAuthorEditor/#[LC]UserTestAuthorEditor";
import LCCardThemeEditor from "../Elements/SearchingElements/CardThemeEditor/#[LC]CardThemeEditor";
import LCCardAuthorEditor from "../Elements/SearchingElements/CardAuthorEditor/#[LC]CardAuthorEditor";
import {Row} from "react-bootstrap";
import {Typography} from "@material-ui/core";

export default function SearchingElementsEditor({...props}: any){
    return(
        <div {...props} className="pl-5">
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Темы и виртуальные авторы для карточек</Typography>
            <Row className="justify-content-around mt-3">
                <LCCardThemeEditor/>
                <LCCardAuthorEditor/>
            </Row>
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Темы и виртуальные авторы для вопросов и тестов</Typography>
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