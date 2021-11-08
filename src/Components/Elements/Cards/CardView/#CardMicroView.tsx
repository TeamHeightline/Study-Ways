import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Popover } from 'antd';

import {CardActionArea, Chip, Grid} from "@mui/material";
import 'fontsource-roboto';
import {useQuery} from "@apollo/client";
import { Row} from "react-bootstrap";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HttpIcon from '@mui/icons-material/Http';
import ImageIcon from '@mui/icons-material/Image';
import {GET_CARD_FOR_MICRO_VIEW_BY_ID, useStyles} from "./Struct"
import { Skeleton } from '@mui/material';

export default function CardMicroView({cardID = 1, ...props}: any){
    const classes = useStyles();
    const [cardImage, setCardImage] = useState()
    const get_card_image = () =>{
        // https://iot-experemental.herokuapp.com/cardfiles/card?
        if(card_data?.cardById?.cardContentType != "A_0" && cardID != 1) {
            fetch("https://iot-experemental.herokuapp.com/cardfiles/card?id=" + cardID)
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data)
                    try {
                        setCardImage(data[0].image)
                    } catch (e) {
                        void (0)
                    }
                })
        }
    }

    const {data: card_data, refetch} = useQuery(GET_CARD_FOR_MICRO_VIEW_BY_ID, {
        variables:{
            id: cardID
        },
        fetchPolicy: "cache-first",
        onCompleted: () => {
            get_card_image()

        },

    })
    useEffect(() =>{
        get_card_image()
    }, [card_data?.cardById?.cardContentType])
    useEffect(() =>{
        if(props?.isNowEditableCard){
            refetch()
        }
    } , [props?.isEditNow, props?.isNowEditableCard])

    if (!card_data){
        return (
            // <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
            <div {...props}>
                <Card variant="outlined" className={classes.root} onClick={() =>{props.onChange(cardID)}}>
                    <Row>
                        <Skeleton variant="rectangular" width={130} height={170} />
                    </Row>
                </Card>
            </div>
        );
    }
    return(
        <div
            // className="col-4"
            {...props}>
            <Card variant="outlined" className={classes.root}
                  onClick={() =>{
                props.onChange(cardID)
            }} >
                <Grid container>
                    <Grid item xs={4}>
                        {Number(card_data.cardById.cardContentType[2]) === 0 &&  card_data?.cardById?.videoUrl &&
                        <CardMedia
                            style={{width: 132, height: 169}}
                            image={"https://img.youtube.com/vi/"+
                            card_data?.cardById.videoUrl.split('?v=')[1] + "/hqdefault.jpg"}
                        />}
                        {(Number(card_data.cardById.cardContentType[2]) === 1 ||
                            Number(card_data.cardById.cardContentType[2]) === 2) && cardImage &&
                        <CardMedia
                            style={{width: 132, height: 169}}
                            image={cardImage}
                        />
                        }
                    </Grid>
                    <Grid item xs={8}>
                        <CardActionArea >
                            <CardContent style={{padding: 4, paddingLeft: 10, paddingRight: 10}}
                                         className="justify-content-start" >
                                <Typography  variant="h6" gutterBottom >
                                    ID: {card_data?.cardById.id}

                                    {Number(card_data.cardById.cardContentType[2]) === 0 &&
                                    <Chip style={{marginLeft: 12}} size="small" variant="outlined" color="secondary"
                                          icon={<YouTubeIcon />} label="YouTube"/>}
                                    {Number(card_data.cardById.cardContentType[2]) === 1 &&
                                    <Chip style={{marginLeft: 12}} size="small" variant="outlined" color="primary"
                                          icon={<HttpIcon />} label="Ресурс"/>}
                                    {Number(card_data.cardById.cardContentType[2]) === 2 &&
                                    <Chip style={{marginLeft: 12}} size="small" variant="outlined" color="default"
                                          icon={<ImageIcon />} label="Изображение"/>}

                                </Typography>

                                <Typography style={{maxHeight: 48, overflow: "hidden"}}>
                                    {card_data?.cardById?.title.slice(0, 56)}
                                </Typography>

                                <Typography>
                                    {card_data?.cardById?.subTheme.length !== 0 ?
                                        <Popover trigger="hover" title="Темы карточки"
                                                 content={card_data?.cardById?.subTheme
                                                     .map((e, eIndex) =>{
                                            return(
                                                <div key={eIndex+ "Tooltip"}>
                                                    {e.theme?.globalTheme?.name.toString() + " / "
                                                    + e?.theme?.name.toString() + " / "
                                                    + e?.name.toString() }
                                                </div>
                                            )
                                        })} >
                                            <Chip size="small" variant="outlined"
                                                  label={card_data?.cardById?.subTheme[0]?.name.slice(0, 25)}/>

                                        </Popover> : <div/>}
                                    <br/>
                                    {card_data?.cardById?.author.length !== 0 ?
                                        <Chip className="mt-1" label={card_data?.cardById?.author[0]?.name.slice(0, 25)}
                                              variant="outlined" />
                                        : <br/>}
                                </Typography>
                                <br/>
                                <br/>

                            </CardContent>
                        </CardActionArea>
                    </Grid>
                </Grid>
            </Card>
        </div>
    )

}
