import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Popover } from 'antd';

import {CardActionArea, Chip} from "@material-ui/core";
import 'fontsource-roboto';
import {useQuery} from "@apollo/client";
import { Row} from "react-bootstrap";
import YouTubeIcon from "@material-ui/icons/YouTube";
import HttpIcon from '@material-ui/icons/Http';
import ImageIcon from '@material-ui/icons/Image';
import {GET_CARD_FOR_MICRO_VIEW_BY_ID, useStyles} from "./Struct"
import {Skeleton} from "@material-ui/lab";

export default function CardMicroView({cardID = 1, ...props}: any,){
    const classes = useStyles();
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
                    void(0)
                }
            })
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
                        <Skeleton variant="rect" width={130} height={170} />
                    </Row>
                </Card>
            </div>
        )
    }
    return(
        <div
            // className="col-4"
            {...props}>
            <Card variant="outlined" className={classes.root}
                  onClick={() =>{
                props.onChange(cardID)
            }} >
                {Number(card_data.cardById.cardContentType[2]) === 0 &&  card_data?.cardById?.videoUrl && <CardMedia
                    className={classes.cover}
                    image={"https://img.youtube.com/vi/"+ card_data?.cardById.videoUrl.split('?v=')[1] + "/hqdefault.jpg"}
                />}
                {(Number(card_data.cardById.cardContentType[2]) === 1 || Number(card_data.cardById.cardContentType[2]) === 2) && cardImage &&
                    <CardMedia
                        className={classes.cover}
                        image={cardImage}
                    />
                }
                <CardActionArea >
                    <CardContent  style={{padding: 4, flex: '1 0 auto', paddingLeft: 10, paddingRight: 10}} className="justify-content-start" >
                        <Typography  variant="h6" gutterBottom >
                            ID: {card_data?.cardById.id}

                            {Number(card_data.cardById.cardContentType[2]) === 0 && <Chip style={{marginLeft: 12}} size="small" variant="outlined" color="secondary" icon={<YouTubeIcon />} label="YouTube"/>}
                            {Number(card_data.cardById.cardContentType[2]) === 1 && <Chip style={{marginLeft: 12}} size="small" variant="outlined" color="primary" icon={<HttpIcon />} label="Ресурс"/>}
                            {Number(card_data.cardById.cardContentType[2]) === 2 && <Chip style={{marginLeft: 12}} size="small" variant="outlined" color="default" icon={<ImageIcon />} label="Изображение"/>}

                        </Typography>

                        <Typography style={{maxHeight: 48, overflow: "hidden"}}>
                            {card_data?.cardById?.title.slice(0, 56)}
                        </Typography>

                        <Typography>
                            {card_data?.cardById?.subTheme.length !== 0 ?
                                <Popover trigger="hover" title="Темы карточки" content={card_data?.cardById?.subTheme.map((e, eIndex) =>{
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
            </Card>
        </div>
    )

}
