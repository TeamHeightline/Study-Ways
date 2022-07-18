import {Alert, Box} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {RootState} from "../../../../root-redux-store/RootStore";
import {useSelector} from "react-redux";

interface IUILoadUsersFailProps extends BoxProps {

}

export default function UILoadUsersFail({...props}: IUILoadUsersFailProps) {
    const is_users_loading_error = useSelector((state: RootState) => state.statusEditor.is_users_loading_error)
    return (
        <Box {...props}>
            {is_users_loading_error &&
                <Alert severity={"error"}>
                    Ошибка загрузки пользователей
                </Alert>}
        </Box>
    )
}
