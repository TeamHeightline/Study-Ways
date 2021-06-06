import React, {useState} from 'react'
import {Card, Chip, Paper, TextField, Tooltip} from "@material-ui/core";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import YouTubeIcon from "@material-ui/icons/YouTube";
import HttpIcon from "@material-ui/icons/Http";
import ImageIcon from "@material-ui/icons/Image";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const GET_CARD_DATA_BY_ID=gql`
    query GET_CARD_DATA_BY_ID($id: ID!){
        cardById(id: $id){
            id
            author{
                id
            }
            subTheme{
                id
            }
            isCardUseAdditionalText
            isCardUseMainContent
            isCardUseMainText
            isCardUseTestBeforeCard
            isCardUseTestInCard
            cardContentType
            text
            title
            additionalText
            siteUrl
            videoUrl
            testBeforeCard{
                id
            }
            testInCard{
                id
            }

        }
    }`
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: "550px",
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
        width: 150,
        height: 50,
        objectFit: 'cover'
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

export default function EditCourseItem({item_id, item_position, ...props}: any){
    const classes = useStyles();
    const [itemID, setItemID] = useState(item_id)
    const [cardImage, setCardImage] = useState()
    const get_card_image = () =>{
        // https://iot-experemental.herokuapp.com/cardfiles/card?
        fetch("https://iot-experemental.herokuapp.com/cardfiles/card?id=" + itemID)
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

    const {data: card_data} = useQuery(GET_CARD_DATA_BY_ID, {
        variables:{
            id: itemID
        },
        onCompleted: () =>{
            get_card_image()
        }
    })
    // console.log(itemID)
    return(
        <Card style={{height:80}}>
            <Tooltip title={card_data &&
                <div>
                    <Typography  variant="h6" gutterBottom className="pr-5">
                        {Number(card_data?.cardById?.cardContentType[2]) === 0 && <Chip size="small" variant="outlined" color="secondary" icon={<YouTubeIcon />} label="YouTube"/>}
                        {Number(card_data?.cardById?.cardContentType[2]) === 1 && <Chip size="small" variant="outlined" color="primary" icon={<HttpIcon />} label="Ресурс"/>}
                        {Number(card_data?.cardById?.cardContentType[2]) === 2 && <Chip size="small" variant="outlined" color="default" icon={<ImageIcon />} label="Изображение"/>}
                        {card_data?.cardById?.title}
                    </Typography>
                </div>
            }>
                <div>
                    <div className={classes.cover}>
                        {Number(card_data?.cardById.cardContentType[2]) === 0 &&  card_data?.cardById?.videoUrl &&
                        <>
                            <img className={classes.cover} src={"https://img.youtube.com/vi/"+ card_data?.cardById?.videoUrl.split('?v=')[1] + "/hqdefault.jpg"}/>
                        </>}
                        {(Number(card_data?.cardById.cardContentType[2]) === 1 || Number(card_data?.cardById?.cardContentType[2]) === 2) && cardImage ?
                            <img className={classes.cover} src={cardImage}/>: null
                        }
                    </div>
                    <TextField
                        className="col-10 ml-2"
                        // id={"courseItemID" + itemID}
                        label=""
                        fullWidth
                        value={itemID}
                        onChange={(e) =>{
                            const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
                            props.updateItem({
                                itemID: valueWithOnlyNumber,
                                itemPosition: item_position
                            })
                            setItemID(valueWithOnlyNumber)
                        }}
                    />
                </div>
            </Tooltip>
        </Card>
    )
}