import React, {useState} from 'react'
import Typography from "@material-ui/core/Typography";
import {
    Button,
    createStyles,
    ListItemIcon,
    makeStyles,
    Menu,
    MenuItem,
    MenuProps,
    TextField,
    Theme,
    withStyles
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import {Alert, Col, Row} from "react-bootstrap";
import ReactPlayer from "react-player";

import TextFieldsIcon from '@material-ui/icons/TextFields';
import YouTubeIcon from '@material-ui/icons/YouTube';
import HttpIcon from '@material-ui/icons/Http';
import SettingsIcon from '@material-ui/icons/Settings';


const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d0d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function CardEditByID(props:any){


    const [cardID, setCardID] = useState(0)
    const [cardHeader, setCardHeader] = useState("Заголовок по умолчанию")

    const [cardText, setCardText] = useState('')
    const [cardYoutubeVideoUrl, setCardYoutubeVideoUrl] = useState("https://www.youtube.com/watch?v=vpMJ_rNN9vY")


    const [isUseText, setIsUseText] = useState(true)
    const [isUseYoutubeVideo, setIsUseYoutubeVideo] = useState(true)
    const [isUseSrcToOtherSite, setIsUseSrcToOtherSite] = useState(false)




    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const cardHeaderHandle = (e) =>{
        setCardHeader(e.target.value)
    }
    const isUseTextHandle = (e) =>{
        setIsUseText(e.target.checked)
    }
    const isUseYoutubeVideoHandler = (e) =>{
        setIsUseYoutubeVideo(e.target.checked)
    }
    const isUseSrcToOtherSiteHandle = (e) =>{
        setIsUseSrcToOtherSite(e.target.checked)
    }
    const cardTextHandle = (e) =>{
        setCardText(e.target.value)
    }
    const cardYoutubeVideoUrlHandle = (e) =>{
        setCardYoutubeVideoUrl(e.target.value)
    }


    return(
        <div>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать карточку</div>
            <Row>
                <Col className="col-6">
                    <Typography variant="h6" className="ml-5" color="textPrimary">{"ID: " + cardID + " " + cardHeader}</Typography>
                    <TextField
                        className="mt-2 ml-5"
                        key={cardID + "header"}
                        id="standard-multiline-flexible"
                        label="Название карточки / Заголовок карточки"
                        fullWidth
                        rowsMax={7}
                        // style={{width: "50vw"}}
                        value={cardHeader}
                        onChange={cardHeaderHandle}
                    />
                </Col>
                <Col>
                    <Button
                        className="ml-5 mt-2"
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="outlined"
                        color="primary"
                        onClick={handleClick}
                    >
                        <ListItemIcon>
                            <SettingsIcon/>
                        </ListItemIcon>
                        Настроить содержимое
                    </Button>
                    <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        // keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <StyledMenuItem>
                            <Switch
                                checked={isUseText}
                                onChange={isUseTextHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <TextFieldsIcon/>
                            </ListItemIcon>
                            Текст
                        </StyledMenuItem>
                        <StyledMenuItem>
                            <Switch
                                checked={isUseYoutubeVideo}
                                onChange={isUseYoutubeVideoHandler}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <YouTubeIcon/>
                            </ListItemIcon>
                            Видео с Youtube
                        </StyledMenuItem>
                        <StyledMenuItem>
                            <Switch
                                checked={isUseSrcToOtherSite}
                                onChange={isUseSrcToOtherSiteHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <HttpIcon/>
                            </ListItemIcon>
                            Ссылка на внешний ресурс
                        </StyledMenuItem>
                    </StyledMenu>



                </Col>
            </Row>
            <br/>
            <Row className="mt-4">

                    {isUseYoutubeVideo? <Col className="col-12 col-lg-5 ml-5 mt-4">
                        <ReactPlayer width="auto"  controls
                                     url={cardYoutubeVideoUrl}
                        />
                        <TextField
                            className="mt-2 col-12"
                            key={cardID + "youtubeVideo"}
                            id="standard-multiline-flexible"
                            label="Ссылка на видео на Youtube"
                            fullWidth
                            value={cardYoutubeVideoUrl}
                            onChange={cardYoutubeVideoUrlHandle}
                        />
                    </Col>: null}
                    {isUseText? <Col className="col-12 col-lg-6">
                        <TextField
                            className="mt-2 col-12 ml-3"
                            key={cardID + "text"}
                            id="standard-multiline-flexible"
                            label="Текст"
                            multiline
                            fullWidth
                            rowsMax={21}
                            // style={{width: "50vw"}}
                            value={cardText}
                            onChange={cardTextHandle}
                        />
                    </Col>: null}
            </Row>
            {/*<iframe src = "https://guide.herzen.spb.ru/static/schedule_dates.php?id_group=12460" width="680" height="480" allowFullScreen />*/}
        </div>
    )
}