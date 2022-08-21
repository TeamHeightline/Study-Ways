import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Box, CardActionArea, Chip, Grid, Skeleton, Stack, Tooltip} from "@mui/material";
import {useQuery} from "@apollo/client";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HttpIcon from '@mui/icons-material/Http';
import ImageIcon from '@mui/icons-material/Image';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import BiotechIcon from '@mui/icons-material/Biotech';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import FunctionsIcon from '@mui/icons-material/Functions';
import {GET_CARD_FOR_MICRO_VIEW_BY_ID} from "./Struct"
import urlParser from "js-video-url-parser";
import "js-video-url-parser/lib/provider/youtube";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ThemeStoreObject from "../../../../global-theme";
import ReactPlayer from "react-player";

interface ICardMicroViewProps extends React.HTMLAttributes<HTMLDivElement> {
    cardID: number,
    isEditNow?: boolean,
    isNowEditableCard?: boolean,
    onChange?: any,
}

export default function CardMicroView({
                                          cardID = 1,
                                          isEditNow,
                                          isNowEditableCard,
                                          onChange,
                                          ...props
                                      }: ICardMicroViewProps) {
    const [onVideoHover, setOnVideoHover] = useState(false)
    const {data: card_data, refetch} = useQuery(GET_CARD_FOR_MICRO_VIEW_BY_ID, {
        variables: {
            id: cardID
        }
    })
    useEffect(() => {
        if (isNowEditableCard) {
            if (refetch) {
                refetch()

            }
        }
    }, [isEditNow, isNowEditableCard])

    const themesText = card_data?.cardById?.cCardTheme[0]?.text
    const authorName = card_data?.cardById?.authorProfile?.firstname + " " + card_data?.cardById?.authorProfile.lastname

    const showTheme = !!themesText
    const showAuthor = !!authorName.split(" ").join("")
    const isDarkTheme = ThemeStoreObject.mode === "dark";


    if (!card_data) {
        return (
            // <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
            <div {...props} id={"CMV-loading-skeleton"}>
                <Card variant="outlined"
                      sx={{
                          display: 'flex',
                          width: "400px",
                          height: "170px"
                      }}
                      onClick={() => {
                          onChange(cardID)
                      }}>
                    <Skeleton variant="rectangular" width={130} height={170}/>
                </Card>
            </div>
        );
    }
    return (
        <div
            {...props}>
            <Card variant={isDarkTheme ? "outlined" : "elevation"}
                  sx={{
                      display: 'flex',
                      width: "400px",
                      height: "170px",
                      border: "none"
                  }}
                  onClick={() => {
                      onChange(cardID)
                  }}>
                <CardActionArea sx={{height: "100%"}}>
                    <Grid container alignItems={"start"}>
                        <Grid item xs={4}>
                            {Number(card_data.cardById.cardContentType[2]) === 0 && card_data?.cardById?.videoUrl &&
                                <div
                                    onMouseEnter={() => {
                                        setOnVideoHover(true)
                                    }}
                                    onMouseLeave={() => {
                                        setOnVideoHover(false)
                                    }}>
                                    {onVideoHover ?
                                        <ReactPlayer controls
                                                     autoplay
                                                     url={card_data?.cardById.videoUrl}
                                                     height={169}
                                                     width={132}
                                        />
                                        :
                                        <CardMedia
                                            sx={{
                                                width: 132, height: 169,

                                                cacheControl: "public,max-age=31536000,immutable",
                                                loading: "lazy",
                                                decoding: "async"
                                            }}
                                            onError={() => void (0)}
                                            image={
                                                "https://img.youtube.com/vi/" + urlParser.parse(card_data?.cardById.videoUrl)?.id + "/hqdefault.jpg"
                                            }
                                        />}
                                </div>
                            }
                            {(Number(card_data.cardById.cardContentType[2]) === 1 ||
                                    Number(card_data.cardById.cardContentType[2]) === 2) &&
                                <CardMedia
                                    style={{width: 132, height: 169}}
                                    onError={() => void (0)}
                                    image={card_data?.cardById?.imageUrl}
                                />
                            }
                        </Grid>
                        <Grid item xs={8} sx={{height: "100%"}}>
                            <Stack direction={"column"}
                                // justifyContent={"space-between"}
                                   sx={{pl: 1, pr: 1, pb: 1, height: "170px"}}
                            >
                                <div>
                                    <Typography variant="h6">
                                        ID: {card_data?.cardById.id}
                                        {Number(card_data.cardById.cardContentType[2]) === 0 &&
                                            <Chip id={"YouTube-icon"}
                                                  style={{marginLeft: 12}} size="small" variant="outlined"
                                                  color="secondary"
                                                  icon={<YouTubeIcon/>} label="YouTube"/>}
                                        {Number(card_data.cardById.cardContentType[2]) === 1 &&
                                            <Chip style={{marginLeft: 12}} size="small" variant="outlined"
                                                  color="primary"
                                                  icon={<HttpIcon/>} label="Ресурс"/>}
                                        {Number(card_data.cardById.cardContentType[2]) === 2 &&
                                            <Chip style={{marginLeft: 12}} size="small" variant="outlined"
                                                  color="default"
                                                  icon={<ImageIcon/>} label="Изобра..."/>}

                                        {Number(card_data.cardById.hardLevel.slice(2.3)) == 0 &&
                                            <ArchitectureIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.cardById.hardLevel.slice(2.3)) == 1 &&
                                            <FunctionsIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.cardById.hardLevel.slice(2.3)) == 2 &&
                                            <SchoolIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.cardById.hardLevel.slice(2.3)) == 3 &&
                                            <ScienceIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.cardById.hardLevel.slice(2.3)) == 4 &&
                                            <BiotechIcon style={{marginLeft: 12}} fontSize="small"/>}
                                    </Typography>

                                    <Typography
                                        variant={"body2"}
                                        sx={{
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 4,
                                            maxHeight: 70
                                        }}
                                        style={{overflow: "hidden"}}>
                                        {card_data?.cardById?.title}
                                    </Typography>
                                </div>
                                <Box sx={{mt: 2}}>
                                    {showTheme &&
                                        <Typography variant="caption"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 1
                                                    }}>
                                            <Tooltip title={
                                                <Typography>
                                                    {"Эту карточку можно найти в теме: " + themesText}
                                                </Typography>}>
                                                <AccountTreeIcon fontSize={"small"}/>
                                            </Tooltip>
                                            {themesText}
                                        </Typography>}

                                    {showAuthor &&
                                        <Typography variant="caption"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 1
                                                    }}>
                                            <AccountBoxIcon fontSize={"small"}/>
                                            {authorName}
                                        </Typography>}
                                </Box>

                            </Stack>

                        </Grid>
                    </Grid>
                </CardActionArea>
            </Card>
        </div>
    )

}
