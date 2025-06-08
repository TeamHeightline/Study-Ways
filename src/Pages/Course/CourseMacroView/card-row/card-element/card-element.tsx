import {Box, Card, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React, {useEffect, useState} from "react";
import axiosClient from "../../../../../Shared/ServerLayer/QueryLayer/config";
import urlParser from "js-video-url-parser";
import CardMedia from "@mui/material/CardMedia";
import {positionDataI} from "../../../CourseMicroView/V2/Store/CourseMicroStoreByID";
import {useNavigate} from "react-router-dom";
import MultipleCards from "./multiple-cards";
import NotLoaded from "./not-loaded";

interface ISingleCardProps extends BoxProps {
    card_id: string,
    size: {
        width: number,
        height: number
    },
    itemIndex: number,
    rowIndex: number,
    positionData: positionDataI,
    activePage: number,
    courseID: number,
    viewedCardIDs: any
}

interface ICardData {
    id: string,
    card_content_type: number,
    video_url: string,
    cards_cardimage?: {
        id: string,
        image: string
    },
    title: string
}

export default function CardItem({
                                     card_id,
                                     size,
                                     itemIndex,
                                     rowIndex,
                                     positionData,
                                     activePage,
                                     courseID,
                                     viewedCardIDs,
                                     ...props
                                 }: ISingleCardProps) {
    const [cardData, setCardData] = useState<ICardData | null>(null)
    const navigate = useNavigate();

    useEffect(() => {
        if (!isNaN(Number(card_id))) {
            axiosClient.get<ICardData>("/page/course-by-id/card-data/" + card_id)
                .then(res => setCardData(res.data))
        }
    }, [card_id])

    function handleNavigateToItem() {
        navigate("/course?" + "id=" + courseID +
            "&activePage=" + activePage +
            "&selectedPage=" + activePage +
            "&selectedRow=" + rowIndex +
            "&selectedIndex=" + itemIndex)
    }


    const isSelected = positionData.selectedRow === rowIndex
        && positionData.selectedIndex === itemIndex
        && positionData.selectedPage === activePage

    const isViewed = viewedCardIDs.has(card_id)

    const border = isSelected ? "1px solid rgb(245 0 87)" : isViewed ? "1px solid rgba(33, 150, 243, 1)" : "1px solid rgba(255, 255, 255, 0.23)"

    const numberOfElements = card_id?.split(",").length


    const imageSrc = cardData?.card_content_type === 0 ?
        "https://img.youtube.com/vi/" + urlParser.parse(cardData?.video_url || "")?.id + "/hqdefault.jpg" :
        "https://storage.googleapis.com/study-ways-files/" + cardData?.cards_cardimage?.image


    return (
        <Box sx={{width: size.width}} onClick={handleNavigateToItem}>
            <Card variant={"outlined"}
                  sx={{border: border}}>
                {numberOfElements > 1 ? <MultipleCards numberOfElements={numberOfElements} size={size}/> :
                    !cardData ? <NotLoaded size={size}/> :
                        <CardMedia image={imageSrc}
                                   sx={{
                                       ...size,
                                       cacheControl: "public,max-age=31536000,immutable",
                                       loading: "lazy",
                                       decoding: "async",
                                       backgroundSize: "cover",
                                       backgroundPosition: "center"
                                   }}/>}
            </Card>
            <Typography variant={'caption'} sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                lineHeight: 1.2
            }}>
                {cardData?.title}
            </Typography>
        </Box>
    )
}
