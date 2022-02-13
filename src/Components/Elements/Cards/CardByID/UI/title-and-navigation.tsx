import {observer} from "mobx-react";
import React from 'react';
import CourseByURL from "../../../Course/CourseByURL/UI/CourseByURL";
import {CardByIDStoreObject} from "../Store/CardByIDStore";
import DefaultCardNavigation from "./default-card-navigation";
import {Stack} from "@mui/material";
import CardTitleWithId from "./card-title-with-id";
import CardCopyright from "./card-copyright";
import CardTheme from "./card-theme";

interface ITitleAndNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
    course_navigation?: typeof CourseByURL
    card_store: typeof CardByIDStoreObject
}

const TitleAndNavigation = observer(({
                                         course_navigation,
                                         card_store,
                                         ...props
                                     }: ITitleAndNavigationProps) => {
    const openFromCourse = !!course_navigation
    return (
        <div {...props}>
            <Stack
                direction={openFromCourse ? "row" : "column"}>
                {openFromCourse ?
                    course_navigation :
                    <DefaultCardNavigation card_store={card_store}/>}
                <CardTitleWithId card_store={card_store}/>
                <CardCopyright card_store={card_store}/>
                <CardTheme card_store={card_store}/>

            </Stack>
        </div>
    )
})

export default TitleAndNavigation