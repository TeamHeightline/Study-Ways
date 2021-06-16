import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Popover } from 'antd';

import {Breadcrumbs, CardActionArea, Chip, Grid, Paper, Tooltip} from "@material-ui/core";
import {gql} from "@apollo/client/core";
import 'fontsource-roboto';
import {useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import YouTubeIcon from "@material-ui/icons/YouTube";
import HttpIcon from '@material-ui/icons/Http';
import ImageIcon from '@material-ui/icons/Image';
import MathJax from 'react-mathjax-preview'



const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: "400px",
        height: "170px"
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 200,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

const GET_CARD_FOR_MICRO_VIEW_BY_ID = gql`
    query GET_CARD_FOR_MICRO_VIEW_BY_ID($id: ID!){
        cardById(id: $id){
            id
            text
            title
            cardContentType
            videoUrl
            subTheme{
                id
                name
                theme{
                    id
                    name
                    globalTheme{
                        id
                        name
                    }
                }
            }
            author{
                id
                name
            }

        }
    }`
export default function CardMicroView({cardID = 1, ...props}: any,){
    const classes = useStyles();
    const theme = useTheme();
    const [contentType, setContentType] = useState(0)
    const [cardImage, setCardImage] = useState()
    const get_card_image = () =>{
        // https://iot-experemental.herokuapp.com/cardfiles/card?
        fetch("https://iot-experemental.herokuapp.com/cardfiles/card?id=" + cardID)
            .then((response) => response.json())
            .then((data) =>{
                // console.log(data)
                try{
                    setCardImage(data[0].image)
                }
                catch(e){
                    console.log(e)
                }
            })
    }

    const {data: card_data} = useQuery(GET_CARD_FOR_MICRO_VIEW_BY_ID, {
        variables:{
            id: cardID
        },
        pollInterval: 3000,
        onCompleted: data => {
            // console.log(data)
            setContentType(Number(data.cardById.cardContentType[2]))
            get_card_image()
        },

    })
    useEffect(() =>{
        get_card_image()
    }, [card_data?.cardById?.cardContentType])

    if (!card_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    // console.log(card_data?.cardById.videoUrl.split('?v=')[1])
    // 380 * 110
    return(
        <div
            // className="col-4"
            {...props}>
            <Card className={classes.root} onClick={() =>{
                // console.log(cardID)
                props.onChange(cardID)
            }}>
                {Number(card_data.cardById.cardContentType[2]) === 0 &&  card_data?.cardById?.videoUrl && <CardMedia
                    className={classes.cover}
                    image={"https://img.youtube.com/vi/"+ card_data?.cardById.videoUrl.split('?v=')[1] + "/hqdefault.jpg"}
                    title="Live from space album cover"
                />}
                {(Number(card_data.cardById.cardContentType[2]) === 1 || Number(card_data.cardById.cardContentType[2]) === 2) && cardImage ?
                    <CardMedia
                        className={classes.cover}
                        image={cardImage}
                        title="Live from space album cover"
                    />: null
                }
                <CardActionArea >
                    <CardContent className={classes.content}>
                        <Typography  variant="h6" gutterBottom className="pr-5">
                            ID: {card_data?.cardById.id}
                            {Number(card_data.cardById.cardContentType[2]) === 0 && <Chip size="small" variant="outlined" color="secondary" icon={<YouTubeIcon />} label="YouTube"/>}
                            {Number(card_data.cardById.cardContentType[2]) === 1 && <Chip size="small" variant="outlined" color="primary" icon={<HttpIcon />} label="Ресурс"/>}
                            {Number(card_data.cardById.cardContentType[2]) === 2 && <Chip size="small" variant="outlined" color="default" icon={<ImageIcon />} label="Изображение"/>}
                        </Typography>
                        <Popover trigger="hover" title="Название карточки" content={[0].map((e) =>{
                            return(
                                <Typography key={e + "TitleToolTip"}>
                                    {card_data?.cardById?.title}
                                </Typography>
                            )
                        })}>
                            <Typography variant="button" display="block" gutterBottom style={{maxHeight: 20}}>
                                {card_data?.cardById?.title.slice(0, 25)}
                            </Typography>
                        </Popover>
                        {card_data?.cardById?.text.length !== 0 ?
                            <Popover trigger="hover" title="Контент карточки" content={[0].map((e) => {
                                    return(
                                        <div key={e + "MainTextToolTip"}>
                                            <MathJax math={card_data?.cardById?.text}/>
                                        </div>
                                    )
                                })
                            }>
                                <Typography>
                                    Основной текст
                                </Typography>
                            </Popover>
                            : <br/>}
                        {card_data?.cardById?.subTheme.length !== 0 ?
                            <Popover trigger="hover" title="Темы карточки" content={card_data?.cardById?.subTheme.map((e, eIndex) =>{
                                return(
                                    <div key={eIndex+ "Tooltip"}>
                                        {/*<Typography>*/}
                                            {e.theme?.globalTheme?.name.toString() + " / "
                                            + e?.theme?.name.toString() + " / "
                                            + e?.name.toString() }
                                            {/*<br/>*/}
                                        {/*</Typography>*/}
                                    </div>
                                )
                            })} >
                            <Breadcrumbs  aria-label="breadcrumb">
                                <Typography color="inherit" >
                                    {card_data?.cardById?.subTheme[0]?.theme?.globalTheme?.name.slice(0, 8)}
                                </Typography>
                                <Typography color="inherit">
                                    {card_data?.cardById?.subTheme[0]?.theme?.name.slice(0, 8)}
                                </Typography>
                                <Typography color="textPrimary">
                                    {card_data?.cardById?.subTheme[0]?.name.slice(0, 10)}
                                </Typography>
                            </Breadcrumbs>
                        </Popover> : <br/>}
                        {card_data?.cardById?.author.length !== 0 ?
                            <Popover trigger="hover" title="Авторы карточки" content={card_data?.cardById?.author.map((e, eIndex) =>{
                                return(
                                    <div key={eIndex + "AuthorTooltip"}>
                                        <Typography>
                                            {e.name}
                                        </Typography>
                                    </div>
                                )
                            })}>
                                <Typography>
                                    {card_data?.cardById?.author[0]?.name.slice(0, 25)}
                                </Typography>

                            </Popover>
                            : <br/>}
                        {/*<br/>*/}
                        {/*<br/>*/}
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}
