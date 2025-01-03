import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Box, CardActionArea, Chip, Skeleton, Stack, Tooltip} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HttpIcon from '@mui/icons-material/Http';
import ImageIcon from '@mui/icons-material/Image';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import BiotechIcon from '@mui/icons-material/Biotech';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import FunctionsIcon from '@mui/icons-material/Functions';
import urlParser from "js-video-url-parser";
import "js-video-url-parser/lib/provider/youtube";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ReactPlayer from "react-player";
import {useAppSelector} from "../../../App/ReduxStore/RootStore";
import {CardType} from "./store/type";
import {FILE_URL} from "../../../settings";

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
    const card_hash_map = useAppSelector(state => state.cardMicroView.card_hash_map)
    
    const card_data = card_hash_map[String(cardID)] || null as CardType | null

    const themesText = card_data?.cards_card_connected_theme?.[0]?.cards_unstructuredtheme.text

    const authorName = card_data?.users_customuser?.users_userprofile?.firstname + " " + card_data?.users_customuser?.users_userprofile?.lastname

    const showTheme = !!themesText
    const showAuthor = !!authorName.split(" ").join("")

    if (!card_data) {
        return (
            <div {...props} id={"CMV-loading-skeleton"}>
                <Card variant="outlined"
                      sx={{
                          width: {sm: 340, xs: "100%"},
                          height: 340,
                          borderRadius: "24px"
                      }}
                      onClick={() => {
                          onChange && onChange(cardID)
                      }}>
                    <Stack sx={{p: 2, flexGrow: 1, height: 340}} justifyContent={"space-between"}>
                        <Box>
                            <Skeleton variant="rectangular"
                                      width={"100%"}
                                      height={170}
                                      sx={{borderRadius: "24px"}}
                            />
                            <Skeleton variant="rectangular"
                                      width={"100%"}
                                      height={30}
                                      sx={{borderRadius: "8px", mt: 2}}
                            />
                        </Box>

                        <Stack spacing={1}>
                            <Skeleton variant="rectangular"
                                      width={"100%"}
                                      height={20}
                                      sx={{borderRadius: "8px"}}
                            />
                            <Skeleton variant="rectangular"
                                      width={"100%"}
                                      height={20}
                                      sx={{borderRadius: "8px"}}
                            />
                        </Stack>

                    </Stack>
                </Card>
            </div>
        );
    }
    return (
        <div
            {...props}>
            <Card variant={"elevation"}
                  sx={{
                      display: 'flex',
                      width: {sm: 340, xs: "100%"},
                      height: 360,
                      borderRadius: "24px",
                      // bg: "palette.gray"
                  }}
                  onClick={() => {
                      onChange && onChange(cardID)
                  }}>
                <CardActionArea sx={{height: "100%", p: 2}}>
                    <Stack direction={"column"}>
                        <Box sx={{height: 170}}>
                            {Number(card_data.card_content_type) === 0 && card_data?.video_url &&
                                <div>
                                    <CardMedia
                                        sx={{
                                            width: {sm: 300, xs: "100%"},
                                            height: 167,
                                            cacheControl: "public,max-age=31536000,immutable",
                                            loading: "lazy",
                                            decoding: "async",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            borderRadius: "24px"

                                        }}
                                        onError={() => void (0)}
                                        image={
                                            "https://img.youtube.com/vi/" + urlParser.parse(card_data?.video_url || "")?.id + "/hqdefault.jpg"
                                        }
                                    />
                                </div>
                            }
                            {(Number(card_data.card_content_type) === 1 ||
                                    Number(card_data.card_content_type) === 2) &&
                                <CardMedia
                                    sx={{
                                        width: {sm: 300, xs: "100%"},
                                        height: 170,
                                        borderRadius: "24px"
                                    }}
                                    onError={() => void (0)}
                                    image={FILE_URL + "/" + card_data?.cards_cardimage?.image}
                                />
                            }
                        </Box>
                        <Box sx={{height: "100%"}}>
                            <Stack direction={"column"} justifyContent="space-between"
                                   sx={{p: 1, height: "170px"}}>
                                <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                                    <Typography variant="body2" component={"div"}
                                                sx={{display: "flex", alignItems: "center"}}>
                                        ID: {card_data?.id}
                                        {Number(card_data.card_content_type) === 0 &&
                                            <Chip id={"YouTube-icon"}
                                                  style={{marginLeft: 12}} size="small" variant="outlined"
                                                  color="secondary"
                                                  icon={<YouTubeIcon/>} label="YouTube"/>}
                                        {Number(card_data.card_content_type) === 1 &&
                                            <Chip style={{marginLeft: 12}} size="small" variant="outlined"
                                                  color="primary"
                                                  icon={<HttpIcon/>} label="Ресурс"/>}
                                        {Number(card_data.card_content_type) === 2 &&
                                            <Chip style={{marginLeft: 12}} size="small" variant="outlined"
                                                  color="default"
                                                  icon={<ImageIcon/>} label="Изобра..."/>}

                                        {Number(card_data.hard_level) == 0 &&
                                            <ArchitectureIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.hard_level) == 1 &&
                                            <FunctionsIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.hard_level) == 2 &&
                                            <SchoolIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.hard_level) == 3 &&
                                            <ScienceIcon style={{marginLeft: 12}} fontSize="small"/>}
                                        {Number(card_data.hard_level) == 4 &&
                                            <BiotechIcon style={{marginLeft: 12}} fontSize="small"/>}
                                    </Typography>

                                    <Typography
                                        variant={"subtitle2"}
                                        sx={{
                                            flexGrow: 1,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxHeight: 90,
                                            textAlign: 'start'
                                        }}>
                                        {card_data?.title}
                                    </Typography>
                                </Box>

                                <Box>
                                    {showTheme &&
                                        <Typography variant="caption"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 1,
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                            <Tooltip title={"Эту карточку можно найти в теме: " + themesText}>
                                                <AccountTreeIcon fontSize={"small"} sx={{mr: 1}}/>
                                            </Tooltip>
                                            {themesText}
                                        </Typography>}

                                    {showAuthor &&
                                        <Typography variant="caption"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        overflow: 'hidden',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 1,
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                    }}>
                                            <AccountBoxIcon fontSize={"small"} sx={{mr: 1}}/>
                                            {authorName}
                                        </Typography>}
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </CardActionArea>
            </Card>
        </div>
    )

}
