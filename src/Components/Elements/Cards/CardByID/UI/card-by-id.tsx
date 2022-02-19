import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import {CardByIDStore} from "../Store/CardByIDStore";
import GoBackButton from "./go-back-button";
import TitleAndNavigation from "./title-and-navigation";
import Paper from "@mui/material/Paper";
import {PaperProps} from "@mui/material/Paper/Paper";
import CardContentAndDescription from "./card-content-and-description";
import CardNavigationRatingFind from "./card-navigation-rating-find-in-course";
import CourseMicroView from "../../../Course/CourseMicroView/V2/UI/CourseMicroView";
import SimilarCards from "./similar-cards";
import TestAfterCard from "./test-after-card";


interface ICardByIDProps extends PaperProps {
    card_id?: number,
    course_navigation?: ReturnType<typeof CourseMicroView>
}

const CardByID = observer(({card_id, course_navigation, ...props}: ICardByIDProps) => {
    const [cardStore] = useState(new CardByIDStore(card_id))
    useEffect(() => {
        cardStore?.changeID(card_id)
    }, [card_id])
    return (
        <Paper elevation={0} sx={{pt: 2, pl: 2, pr: 2}} {...props}>
            <GoBackButton sx={{pb: 1}}/>
            <TitleAndNavigation
                sx={{pt: 1}}
                card_store={cardStore}
                course_navigation={course_navigation}
            />
            <CardContentAndDescription card_store={cardStore} sx={{pt: 1}}/>
            <CardNavigationRatingFind card_store={cardStore} sx={{pt: 1}}/>
            <TestAfterCard card_store={cardStore} sx={{pt: 1}}/>
            <SimilarCards card_store={cardStore} sx={{pt: 1}}/>

        </Paper>
    )
})

export default CardByID