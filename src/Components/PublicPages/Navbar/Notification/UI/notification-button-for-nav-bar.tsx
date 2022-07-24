import {Badge, Box, IconButton, Paper, Popover, Tooltip} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {RootState, useAppDispatch} from "../../../../../root-redux-store/RootStore";
import {useEffect, useState} from "react";
import recombeeClient from "../../../../../Store/RecombeeClient/recombee-client";
// @ts-ignore
import recombee from 'recombee-js-api-client';
import {
    addNotification,
    closeNotificationWindow,
    INotificationFormat,
    openNotificationWindow
} from "../redux-store/NotificationSlice";
import {useSelector} from "react-redux";
import NotificationContent from "./notification-content";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";

interface INotificationButtonForNavbarProps extends BoxProps {

}

export default function NotificationButtonForNavbar({...props}: INotificationButtonForNavbarProps) {
    const dispatch = useAppDispatch()
    const number_of_not_viewed_notifications = useSelector((state: RootState) => state.notification.number_of_not_viewed_notifications)
    const is_show_notification_window = useSelector((state: RootState) => state.notification.is_show_notification_window)
    const [anchorElement, setAnchorElement] = useState<any>(null)

    function handleClose() {
        dispatch(closeNotificationWindow())
    }


    useEffect(() => {
        recombeeClient.send(new recombee.RecommendItemsToUser(UserStorage.userIDForRecombee, 5,
                {'scenario': 'On-open-suggestion'}),
            (err, matches) => {
                const cardsID = matches?.recomms?.map((recomm) => recomm.id)
                if (cardsID) {
                    const notification: INotificationFormat = {
                        text: "Рекомендованные карточки",
                        type: "CARD_SUGGESTION",
                        payload: cardsID,
                    }
                    dispatch(addNotification(notification))
                }
            })

    }, [])
    return (
        <Box {...props}>
            <Tooltip title={"Уведомления"}>
                <IconButton onClick={(event) => {
                    setAnchorElement(event.currentTarget)
                    dispatch(openNotificationWindow())
                }}>
                    <Badge color="secondary" badgeContent={number_of_not_viewed_notifications}>
                        <NotificationsNoneIcon/>
                    </Badge>
                </IconButton>
            </Tooltip>


            {!!anchorElement &&
                <Popover
                    open={is_show_notification_window}
                    anchorEl={anchorElement}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Paper
                        variant={"outlined"}
                        sx={{
                            height: 320,
                            width: "100%",
                            maxWeight: 800,
                        }}>
                        <NotificationContent/>
                    </Paper>
                </Popover>}
        </Box>
    )
}
