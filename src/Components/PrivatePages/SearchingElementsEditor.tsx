import React from 'react'
import LCUserTestThemeEditor from "../Elements/SearchingElements/UserTestThemeEditor/#[LC]UserTestThemeEditor";
import LCUserTestAuthorEditor from "../Elements/SearchingElements/UserTestAuthorEditor/#[LC]UserTestAuthorEditor";
import LCCardThemeEditor from "../Elements/SearchingElements/CardThemeEditor/#[LC]CardThemeEditor";
import LCCardAuthorEditor from "../Elements/SearchingElements/CardAuthorEditor/#[LC]CardAuthorEditor";
import {Grid, Typography} from "@mui/material";
import ThemeEditor from "../Elements/ThemeTree/ThemeEditor";

export default function SearchingElementsEditor({...props}: any){
    return(
        <div {...props}>
            <Typography className="display-4 text-center mt-4"
                        style={{fontSize: window.innerHeight/window.innerWidth > 1? "25px": '33px'}}>
                Темы и виртуальные авторы для карточек
            </Typography>
            <Grid container style={{paddingLeft: window.innerHeight/window.innerWidth > 1? 12 : 48}}>
                <Grid item xs={12} md={6}>
                    <LCCardThemeEditor/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <LCCardAuthorEditor/>
                </Grid>
            </Grid>
            <Typography className="display-4 text-center mt-4"
                        style={{fontSize: window.innerHeight/window.innerWidth > 1? "25px": '33px'}}>
                Редактор связанных тем
            </Typography>
            <Grid container justifyContent={"center"}>
                <ThemeEditor/>
            </Grid>
            <Typography className="display-4 text-center mt-4"
                        style={{fontSize: window.innerHeight/window.innerWidth > 1? "25px": '33px'}}>
                Темы и виртуальные авторы для вопросов и тестов
            </Typography>
            <Grid container style={{paddingLeft: window.innerHeight/window.innerWidth > 1? 12 : 48}}>
                <Grid item xs={12} md={6}>
                    <LCUserTestThemeEditor/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <LCUserTestAuthorEditor/>
                </Grid>
            </Grid>
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