import React, {useState} from 'react'
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    Stack,
    TextField
} from "@mui/material";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import {SERVER_BASE_URL} from "../../../settings";
import urlParser from "js-video-url-parser";
import CardMicroView from "../../Cards/CardView/CardMicroView";
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import {alpha} from "@mui/material/styles";
import ThemeStoreObject from "../../../global-theme";
import SettingsIcon from '@mui/icons-material/Settings';

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

export default function EditCourseItem({item_data, item_position, updateItem, ...props}: any) {
    const [cardImage, setCardImage] = useState()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [isOpenDialog, setIsOpenDialog] = useState(false)


    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const openDialog = () => {
        setIsOpenDialog(true)
    }

    const closeDialog = () => {
        setIsOpenDialog(false)
    }

    const open = Boolean(anchorEl);

    const get_card_image = () => {
        // SERVER_BASE_URL/cardfiles/card?
        fetch(SERVER_BASE_URL + "/cardfiles/card?id=" + item_data.id)
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
            id: item_data.id
        },
        onCompleted: () => {
            if (item_data.id) {
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

    function onCardIDFieldChange(e) {
        updateItem({
            CourseElement: {
                ...item_data,
                id: getNumbers(e.target.value)
            }
        })
    }

    function handleChangeCellType(e) {
        updateItem({
            CourseElement: {
                ...item_data,
                type: e.target.value
            }
        })
    }

    function handleCourseLinkChange(e) {
        updateItem({
            CourseElement: {
                ...item_data,
                course_link: e.target.value
            }
        })
    }

    function openCardEditor() {
        if (item_data.id) {
            props.editCard(item_data.id)
        }
    }


    const card_content_type = Number(card_data?.cardById.cardContentType[2])

    const number_of_card_in_series = item_data.id?.split(",")?.length

    const is_card_series_in_slot = number_of_card_in_series >= 2

    const series_icon = is_card_series_in_slot ? getFilterIconByNumber(number_of_card_in_series) : "none"

    const is_course_link_cell = item_data?.type === "course-link"

    const course_icon_link = "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/link/default/48px.svg"


    const cell_image = is_course_link_cell ? course_icon_link :
        is_card_series_in_slot ? series_icon :
            card_content_type === 0 && card_data?.cardById?.videoUrl ? "https://img.youtube.com/vi/" + urlParser.parse(card_data?.cardById?.videoUrl)?.id + "/hqdefault.jpg" :
                (card_content_type === 1 || card_content_type === 2) && cardImage ? cardImage : ""


    return (
        <Card
            sx={{
                height: 170, width: 300,
                // marginLeft: 12,
                backgroundImage: `url(${cell_image})`,
                backgroundSize: is_card_series_in_slot || is_course_link_cell ? "contain" : "cover",
                backgroundPosition: "center",
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
                    {item_data.id && String(item_data.id)?.split(",")?.map((cardID) =>
                        <CardMicroView cardID={Number(cardID)}/>)}
                </div>
            </Popover>
            <Stack alignItems={"end"}>
                <Stack direction={"row"}>
                    <IconButton onClick={openDialog}>
                        <SettingsIcon/>
                    </IconButton>
                    <IconButton size={"small"} disabled={is_card_series_in_slot}>
                        <EditIcon onClick={openCardEditor}/>
                    </IconButton>
                    <IconButton size={"small"} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
                        <InfoIcon/>
                    </IconButton>
                </Stack>
            </Stack>

            {is_course_link_cell ?
                <TextField
                    size={"small"}
                    sx={{mt: 10}}
                    autoFocus
                    id="course-position-field"
                    label="Ссылка на элемент в курсе"
                    fullWidth
                    value={item_data?.course_link || ""}
                    onChange={handleCourseLinkChange}
                    variant="filled"
                />
                :
                <TextField
                    sx={{
                        mt: 10,
                        backdropFilter: "blur(6px)",
                        bgcolor: alpha(ThemeStoreObject.backgroundColor || "#0A1929", 0.4),
                    }}
                    label="ID карточки"
                    fullWidth
                    value={item_data.id}
                    size={"small"}
                    variant="filled"
                    onChange={onCardIDFieldChange}
                />}


            <Dialog open={isOpenDialog} onClose={closeDialog} maxWidth={"xs"} fullWidth>
                <DialogTitle>Редактирование ячейки курса</DialogTitle>

                <DialogContent>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel id="cell-type-select">Тип ячейки</InputLabel>
                        <Select
                            labelId="cell-type-select-label"
                            id="cell-type-select-id"
                            value={is_course_link_cell ? "course-link" : "card"}
                            onChange={handleChangeCellType}
                        >
                            <MenuItem value={"card"}>Карточка / несколько карточек</MenuItem>
                            <MenuItem value={"course-link"}>Переход на курс</MenuItem>
                        </Select>
                    </FormControl>

                    {is_course_link_cell ?
                        <>
                            <DialogContentText>
                                Вставьте ссылку на тот элемент курса, переход на который хотите создать
                            </DialogContentText>
                            <TextField
                                autoFocus
                                id="course-position-field"
                                label="Ссылка на элемент в курсе"
                                fullWidth
                                value={item_data?.course_link || ""}
                                onChange={handleCourseLinkChange}
                                variant="standard"
                            />

                        </>
                        :
                        <>
                            <DialogContentText>
                                Если Вы хотите вставить в одну ячейку сразу несколько карточек, то введите их номера
                                через
                                запятую
                                без пробелов.
                                Пример: 123,46,67
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="cards-field"
                                label={is_card_series_in_slot ? "ID карточек" : "ID карточки"}
                                fullWidth
                                value={item_data.id}
                                variant="standard"
                                onChange={onCardIDFieldChange}
                            />
                        </>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
