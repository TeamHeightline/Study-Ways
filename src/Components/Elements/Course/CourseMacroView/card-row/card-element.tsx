import {Box, Card, Skeleton, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React, {useEffect, useState} from "react";
import axiosClient from "../../../../../ServerLayer/QueryLayer/config";
import urlParser from "js-video-url-parser";
import CardMedia from "@mui/material/CardMedia";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";
import Looks6Icon from "@mui/icons-material/Looks6";
import {positionDataI} from "../../CourseMicroView/V2/Store/CourseMicroStoreByID";
import {useNavigate} from "react-router-dom";

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

    const border = isSelected ? "2px solid rgb(245 0 87)" : isViewed ? "2px solid rgba(33, 150, 243, 1)" : "2px solid rgba(1,1,1,0)"

    const numberOfElements = card_id?.split(",").length


    if (numberOfElements > 1) {
        return (
            <Box {...props}>
                <Card variant={"outlined"}
                      onClick={handleNavigateToItem}
                      sx={{border: border, backgroundColor: "transparent"}}>
                    <Stack justifyContent={"center"} alignItems={"center"} sx={size}>
                        {numberOfElements > 1 &&
                            <Box>
                                {numberOfElements === 2 ?
                                    <LooksTwoIcon sx={{fontSize: 60}}/> :
                                    numberOfElements === 3 ?
                                        <Looks3Icon sx={{fontSize: 60}}/> :
                                        numberOfElements === 4 ?
                                            <Looks4Icon sx={{fontSize: 60}}/> :
                                            numberOfElements === 5 ?
                                                <Looks5Icon sx={{fontSize: 60}}/> :
                                                <Looks6Icon sx={{fontSize: 60}}/>}
                            </Box>}
                    </Stack>
                </Card>
            </Box>
        )
    }


    if (!cardData) {
        return (
            <Box {...props}>
                <Card variant="outlined">
                    <Box sx={size}>
                        <Skeleton variant="rectangular" width={size.width} height={size.height}/>
                    </Box>
                </Card>
            </Box>
        )
    }

    const imageSrc = cardData.card_content_type === 0 ?
        "https://img.youtube.com/vi/" + urlParser.parse(cardData.video_url)?.id + "/hqdefault.jpg" :
        "https://storage.googleapis.com/study-ways-files/" + cardData.cards_cardimage?.image


    return (
        <Box {...props} >
            <Card variant={"outlined"}
                  onClick={handleNavigateToItem}
                  sx={{border: border}}>
                <CardMedia image={imageSrc}
                           sx={{
                               ...size,
                               cacheControl: "public,max-age=31536000,immutable",
                               loading: "lazy",
                               decoding: "async",
                               backgroundSize: "cover",
                               backgroundPosition: "center"
                           }}/>
            </Card>
        </Box>
    )
}
