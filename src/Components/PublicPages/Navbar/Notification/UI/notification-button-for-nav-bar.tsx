import {Box, IconButton} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

interface INotificationButtonForNavbarProps extends BoxProps {

}

export default function NotificationButtonForNavbar({...props}: INotificationButtonForNavbarProps) {
    return (
        <Box {...props}>
            <IconButton>
                <NotificationsNoneIcon/>
            </IconButton>
        </Box>
    )
}
