import React, {useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
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
    const {data: card_data} = useQuery(GET_CARD_FOR_MICRO_VIEW_BY_ID, {
        variables:{
            id: cardID
        },
        onCompleted: data => {
            console.log(data)
            setContentType(Number(data.cardById.cardContentType[2]))
        }
    })
    if (!card_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }

    return(
        <div className="col-4" {...props}>
            <Card className={classes.root} onClick={() =>{
                // console.log(cardID)
                props.onChange(cardID)
            }}>
                    <CardMedia
                        className={classes.cover}
                        image="https://sun9-29.userapi.com/impg/ZCsBXEMbu4-OvmiuBiSRICBFmN2MStsrCpobYQ/gL5vhvz1puo.jpg?size=2560x1707&quality=96&sign=e8dec54ce8579fe0b2c1fbecd4e691c7&type=album"
                        title="Live from space album cover"
                    />
                <CardActionArea >
                    <CardContent className={classes.content}>
                        <Typography  variant="h6" gutterBottom className="pr-5">
                            ID: {card_data?.cardById.id}
                            {contentType === 0 && <Chip size="small" variant="outlined" color="secondary" icon={<YouTubeIcon />} label="YouTube"/>}
                            {contentType === 1 && <Chip size="small" variant="outlined" color="primary" icon={<HttpIcon />} label="Ресурс"/>}
                            {contentType === 2 && <Chip size="small" variant="outlined" color="default" icon={<ImageIcon />} label="Изображение"/>}
                        </Typography>
                        <Tooltip title={[0].map((e) =>{
                            return(
                                <Typography key={e + "TitleToolTip"}>
                                    {card_data?.cardById?.title}
                                </Typography>
                            )
                        })}>
                            <Typography variant="button" display="block" gutterBottom style={{maxHeight: 20}}>
                                {card_data?.cardById?.title.slice(0, 33)}
                            </Typography>
                        </Tooltip>
                        {card_data?.cardById?.text.length !== 0 ?
                            <Tooltip title= {[0].map((e) => {
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
                            </Tooltip>
                            : <br/>}
                        {card_data?.cardById?.subTheme.length !== 0 ?
                            <Tooltip title={card_data?.cardById?.subTheme.map((e, eIndex) =>{
                                return(
                                    <div key={eIndex+ "Tooltip"}>
                                        <Typography>
                                            {e.theme?.globalTheme?.name.toString() + " / "
                                            + e?.theme?.name.toString() + " / "
                                            + e?.name.toString() }
                                            <br/>
                                        </Typography>
                                    </div>
                                )
                            })} >
                            <Breadcrumbs  aria-label="breadcrumb">
                                <Typography color="inherit" >
                                    {card_data?.cardById?.subTheme[0]?.theme?.globalTheme?.name.slice(0, 15)}
                                </Typography>
                                <Typography color="inherit">
                                    {card_data?.cardById?.subTheme[0]?.theme?.name.slice(0, 15)}
                                </Typography>
                                <Typography color="textPrimary">
                                    {card_data?.cardById?.subTheme[0]?.name.slice(0, 15)}
                                </Typography>
                            </Breadcrumbs>
                        </Tooltip> : <br/>}
                        {card_data?.cardById?.author.length !== 0 ?
                            <Tooltip title={card_data?.cardById?.author.map((e, eIndex) =>{
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

                            </Tooltip>
                            : <br/>}
                        {/*<br/>*/}
                        {/*<br/>*/}
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}
