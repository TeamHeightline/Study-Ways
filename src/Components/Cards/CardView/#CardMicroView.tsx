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
import {Breadcrumbs, Chip, Grid, Paper, Tooltip} from "@material-ui/core";
import {gql} from "@apollo/client/core";
import 'fontsource-roboto';
import {useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import YouTubeIcon from "@material-ui/icons/YouTube";
import HttpIcon from '@material-ui/icons/Http';
import ImageIcon from '@material-ui/icons/Image';

// const useStyles = makeStyles({
//     root: {
//         maxWidth: 395,
//         // display: 'flex',
//     },
//     media: {
//         height: 170,
//         display: 'flex'
//     },
// });
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
        width: 151,
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
export default function CardMicroView({cardID = 1}: any){
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
        <div className="col-4">
            <Card className={classes.root}>
                <CardMedia
                    className={classes.cover}
                    image="https://sun9-56.userapi.com/impg/vJvbcuOM8oN8wSJgdGRZJmo5n-RTCQgATDv0WQ/bRbvWuKnwGw.jpg?size=1152x927&quality=96&sign=2809a1e5f67111ccce274dd416768b01&type=album"
                    title="Live from space album cover"
                />
                <CardContent className={classes.content}>
                    <Typography  variant="h6" gutterBottom className="pr-5">
                        ID: {card_data?.cardById.id}
                        {contentType === 0 && <Chip size="small" variant="outlined" color="primary" icon={<YouTubeIcon />} label="YouTube"/>}
                        {contentType === 1 && <Chip size="small" variant="outlined" color="primary" icon={<HttpIcon />} label="Ресурс"/>}
                        {contentType === 2 && <Chip size="small" variant="outlined" color="primary" icon={<ImageIcon />} label="Изображение"/>}
                    </Typography>
                    <Typography variant="button" display="block" gutterBottom style={{maxHeight: 20}}>
                        {card_data?.cardById?.title.slice(0, 30)}
                    </Typography>
                    <Tooltip title={card_data?.cardById?.subTheme.map((e, eIndex) =>{
                        return(
                            <div key={eIndex+ "Tooltip"}>
                                {e.theme?.globalTheme?.name.slice(0, 20).toString() + " / "
                                + e?.theme?.name.slice(0, 20).toString() + " / "
                                + e?.name.slice(0, 20).toString() }
                                <br/>
                            </div>
                        )
                    })} >
                        <Breadcrumbs  aria-label="breadcrumb">
                            <Typography color="inherit" >
                                {card_data?.cardById?.subTheme[0]?.theme?.globalTheme?.name.slice(0, 20)}
                            </Typography>
                            <Typography color="inherit">
                                {card_data?.cardById?.subTheme[0]?.theme?.name.slice(0, 20)}
                            </Typography>
                            <Typography color="textPrimary">
                                {card_data?.cardById?.subTheme[0]?.name.slice(0, 20)}
                            </Typography>
                        </Breadcrumbs>
                    </Tooltip>
                </CardContent>
            </Card>
        </div>
    )
}
