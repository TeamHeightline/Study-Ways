import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import {CardByIDStore} from "../Store/CardByIDStore";
import GoBackButton from "./go-back-button";
import TitleAndNavigation from "./title-and-navigation";
import {PaperProps} from "@mui/material/Paper/Paper";
import CardContentAndDescription from "./card-content-and-description";
import AuthorNavigation from "./card-navigation";
import CourseMicroView from "../../../Course/CourseMicroView/V2/UI/CourseMicroView";
import SimilarCards from "./similar-cards";
import CardBrowserIndexing from "./card-browser-indexing";
import useWindowDimensions from "../../../../Shared/CustomHooks/useWindowDimensions";
import {Box} from "@mui/material";
import TestAfterCard from "./test-after-card";


interface ICardByIDProps extends PaperProps {
    card_id?: number,
    course_navigation?: ReturnType<typeof CourseMicroView>,
    is_hidden_go_back_button?: boolean,
    is_hidden_navigation?: boolean,
    is_hidden_similar_cards?: boolean
}

const defaultCardStorage = new CardByIDStore()
const CardByID = observer(({
                               card_id,
                               course_navigation,
                               is_hidden_go_back_button = false,
                               is_hidden_navigation = false,
                               is_hidden_similar_cards = false,
                               ...props
                           }: ICardByIDProps) => {
    const {width} = useWindowDimensions()


    const [cardStorage] = useState<CardByIDStore>(() => new CardByIDStore())

    useEffect(() => {
        cardStorage?.changeID(card_id)
    }, []);

    useEffect(() => {
        cardStorage?.changeID(card_id)
    }, [card_id])

    return (

        <Box sx={{pt: 2, pl: 2, pr: 2, maxWidth: width}} {...props}>
            <CardBrowserIndexing card_store={cardStorage}/>
            {!is_hidden_go_back_button &&
                <GoBackButton sx={{pb: 1}}/>}
            <TitleAndNavigation
                is_hidden_navigation={is_hidden_navigation}
                sx={{pt: 1}}
                card_store={cardStorage}
                course_navigation={course_navigation}
            />
            <CardContentAndDescription card_store={cardStorage} sx={{pt: 1}}/>

            <AuthorNavigation card_store={cardStorage} sx={{pt: 1}}/>
            <TestAfterCard card_store={cardStorage}/>

            {!is_hidden_similar_cards &&
                <SimilarCards card_store={cardStorage} sx={{pt: 1}}/>}

        </Box>

    )
})

export default CardByID
