import {observer} from "mobx-react";
import React from 'react';
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import DefaultCardNavigation from "./default-card-navigation";
import {Stack} from "@mui/material";
import CardTitleWithId from "./card-title-with-id";
import CardCopyright from "./card-copyright";
import CardTheme from "./card-theme";
import CourseMicroView from "../../../Course/CourseMicroView/V2/UI/CourseMicroView";
import {PaperProps} from "@mui/material/Paper/Paper";
import Paper from "@mui/material/Paper";

interface ITitleAndNavigationProps extends PaperProps {
    course_navigation?: ReturnType<typeof CourseMicroView>
    card_store: typeof CardByIDStoreObject
}

const TitleAndNavigation = observer(({
                                         course_navigation,
                                         card_store,
                                         ...props
                                     }: ITitleAndNavigationProps) => {
    const openFromCourse = !!course_navigation
    return (
        <Paper elevation={0} {...props}>
            <Stack
                direction={openFromCourse ? "row" : "column"} spacing={2}>
                {openFromCourse ?
                    course_navigation :
                    <DefaultCardNavigation card_store={card_store}/>}
                <Stack direction={"column"}>
                    <CardTitleWithId card_store={card_store}/>
                    <CardCopyright card_store={card_store}/>
                    <CardTheme card_store={card_store}/>
                </Stack>
            </Stack>
        </Paper>
    )
})

export default TitleAndNavigation