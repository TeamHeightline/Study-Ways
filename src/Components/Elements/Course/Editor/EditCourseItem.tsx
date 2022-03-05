import React, {useState} from 'react'
import {Card, Popover, TextField} from "@mui/material";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import makeStyles from '@mui/styles/makeStyles';
import {SERVER_BASE_URL} from "../../../../settings";
import urlParser from "js-video-url-parser";
import CardMicroView from "../../Cards/CardView/CardMicroView";

const GET_CARD_DATA_BY_ID = gql`
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
const useStyles = makeStyles(() => ({
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
        width: 135,
        height: 50,
        objectFit: 'cover'
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function EditCourseItem({item_id, item_position, ...props}: any) {
    const classes = useStyles();
    const [itemID, setItemID] = useState(item_id)
    const [cardImage, setCardImage] = useState()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);


    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const get_card_image = () => {
        // SERVER_BASE_URL/cardfiles/card?
        fetch(SERVER_BASE_URL + "/cardfiles/card?id=" + itemID)
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

    const {data: card_data} = useQuery(GET_CARD_DATA_BY_ID, {
        variables: {
            id: itemID
        },
        onCompleted: () => {
            if (itemID) {
                get_card_image()
            }
        }
    })
    // console.log(itemID)
    return (
        <Card style={{height: 80, width: 135, marginLeft: 12}} variant="outlined">
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                style={{marginTop: 100}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <CardMicroView cardID={itemID}/>
            </Popover>
            <div>
                {itemID ?
                    <div className={classes.cover}
                         onMouseEnter={handlePopoverOpen}
                         onMouseLeave={handlePopoverClose}
                         onClick={() => props.editCard(itemID)}>
                        {Number(card_data?.cardById.cardContentType[2]) === 0 && card_data?.cardById?.videoUrl &&
                            <>
                                <img className={classes.cover}
                                     src={"https://img.youtube.com/vi/" + urlParser.parse(card_data?.cardById?.videoUrl)?.id + "/hqdefault.jpg"}/>
                            </>}
                        {(Number(card_data?.cardById.cardContentType[2]) === 1 || Number(card_data?.cardById?.cardContentType[2]) === 2) && cardImage ?
                            <img className={classes.cover} src={cardImage}/> : null
                        }
                    </div> : <div className={classes.cover}/>}


                <TextField
                    className="col-12 pl-2"
                    // id={"courseItemID" + itemID}
                    label=""
                    fullWidth
                    value={itemID}
                    variant="standard"
                    onChange={(e) => {
                        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
                        props.updateItem({
                            CourseElement: {
                                id: valueWithOnlyNumber
                            }
                        })
                        setItemID(valueWithOnlyNumber)
                    }}
                />
            </div>

        </Card>
    );
}