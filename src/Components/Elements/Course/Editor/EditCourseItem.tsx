import React, {useState} from 'react'
import {Card, CardActionArea, Popover, Stack, TextField} from "@mui/material";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {SERVER_BASE_URL} from "../../../../settings";
import urlParser from "js-video-url-parser";
import CardMicroView from "../../Cards/CardView/CardMicroView";
import InfoIcon from '@mui/icons-material/Info';

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


export default function EditCourseItem({item_id, item_position, ...props}: any) {
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

    const card_content_type = Number(card_data?.cardById.cardContentType[2])

    const card_image = card_content_type === 0 && card_data?.cardById?.videoUrl ? "https://img.youtube.com/vi/" + urlParser.parse(card_data?.cardById?.videoUrl)?.id + "/hqdefault.jpg" :
        (card_content_type === 1 || card_content_type === 2) && cardImage ? cardImage : ""
    return (
        <Card
            style={{
                height: 113, width: 200,
                marginLeft: 12,
                backgroundImage: `url(${card_image})`,
                backgroundSize: "cover"
            }}
            // onMouseEnter={handlePopoverOpen}
            // onMouseLeave={handlePopoverClose}
            // onClick={() => {
            //     if (itemID) {
            //         props.editCard(itemID)
            //     }
            // }}
            variant="outlined">
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
            <CardActionArea
                onClick={() => {
                    if (itemID) {
                        props.editCard(itemID)
                    }
                }}>
                <Stack alignItems={"end"} onMouseEnter={handlePopoverOpen}
                       onMouseLeave={handlePopoverClose}>
                    <InfoIcon/>
                </Stack>


                <TextField
                    sx={{
                        mt: 5,
                        backdropFilter: "blur(6px)"
                    }}
                    label="ID карточки"
                    fullWidth
                    value={itemID}
                    size={"small"}
                    variant="filled"
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
            </CardActionArea>

        </Card>
    );
}
