import React, {useState} from 'react'
import {Card, Popover, Stack, TextField} from "@mui/material";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {SERVER_BASE_URL} from "../../../../settings";
import urlParser from "js-video-url-parser";
import CardMicroView from "../../Cards/CardView/CardMicroView";
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import {alpha} from "@mui/material/styles";
import ThemeStoreObject from "../../../../global-theme";

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

//function that get string and return only numbers and comma
function getNumbers(str) {
    return str.replace(/[^0-9,]/g, '');
}

export default function EditCourseItem({item_id, item_position, ...props}: any) {
    // const [itemID, setItemID] = useState(item_id)
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
        fetch(SERVER_BASE_URL + "/cardfiles/card?id=" + item_id)
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
            id: item_id
        },
        onCompleted: () => {
            if (item_id) {
                get_card_image()
            }
        }
    })

    // console.log(itemID)

    function getFilterIconByNumber(num: number) {
        if (num > 9) {
            return "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/filter_9_plus/default/48px.svg"
        }
        return `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/filter_${num}/default/48px.svg`
    }

    const card_content_type = Number(card_data?.cardById.cardContentType[2])

    const number_of_card_in_series = item_id?.split(",")?.length

    const is_card_series_in_slot = number_of_card_in_series >= 2

    const series_icon = is_card_series_in_slot ? getFilterIconByNumber(number_of_card_in_series) : "none"


    const card_image = is_card_series_in_slot ? series_icon :
        card_content_type === 0 && card_data?.cardById?.videoUrl ? "https://img.youtube.com/vi/" + urlParser.parse(card_data?.cardById?.videoUrl)?.id + "/hqdefault.jpg" :
            (card_content_type === 1 || card_content_type === 2) && cardImage ? cardImage : ""
    return (
        <Card
            style={{
                height: 113, width: 200,
                // marginLeft: 12,
                backgroundImage: `url(${card_image})`,
                backgroundSize: is_card_series_in_slot ? "contain" : "cover",
                backgroundPosition: "center",
                backgroundColor: is_card_series_in_slot ? "white" : undefined,
                backgroundRepeat: "no-repeat"
            }}
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
                <div>
                    {item_id && String(item_id)?.split(",")?.map((cardID) =>
                        <CardMicroView cardID={Number(cardID)}/>)}
                </div>
            </Popover>
            {/*<CardActionArea*/}
            {/*>*/}
            <Stack alignItems={"end"} onMouseEnter={handlePopoverOpen}
                   onMouseLeave={handlePopoverClose}>
                <Stack direction={"row"}>
                    <InfoIcon/>
                    <EditIcon
                        onClick={() => {
                            if (item_id) {
                                props.editCard(item_id)
                            }
                        }}/>
                </Stack>
            </Stack>


            <TextField
                sx={{
                    mt: 5,
                    backdropFilter: "blur(6px)",
                    bgcolor: alpha(ThemeStoreObject.backgroundColor || "#0A1929", 0.4),
                }}
                label="ID карточки"
                fullWidth
                value={item_id}
                size={"small"}
                variant="filled"
                onChange={(e) => {
                    const valueWithOnlyNumber = getNumbers(e.target.value)
                    props.updateItem({
                        CourseElement: {
                            id: valueWithOnlyNumber
                        }
                    })
                    // setItemID(valueWithOnlyNumber)
                }}
            />
            {/*</CardActionArea>*/}

        </Card>
    );
}
