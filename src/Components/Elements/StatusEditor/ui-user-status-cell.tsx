import {FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TableCell} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {IBasicUserInformation} from "../../../ServerLayer/Types/user.types";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import EditIcon from "@mui/icons-material/Edit";
import {useDispatch, useSelector} from "react-redux";
import {changeEditUserID, changeEditUserStatus} from "../../../redux-store/user-status-editor/actions";
import {RootState} from "../../../redux-store/RootReducer";
import SaveIcon from '@mui/icons-material/Save';


interface IUIUserStatusCellProps extends PaperProps {
    user: IBasicUserInformation
}

export default function UIUserStatusCell({user, ...props}: IUIUserStatusCellProps) {
    const dispatch = useDispatch()
    const activeEditUserID = useSelector((state: RootState) => state.statusEditorReducer.activeEditUserID)
    const aciveEditUserStatus = useSelector((state: RootState) => state.statusEditorReducer.activeEditUserStatus)

    function editThisUser() {
        dispatch(changeEditUserStatus(user.user_access_level))
        dispatch(changeEditUserID(user.id))
    }

    function changeUserStatus(event) {
        dispatch(changeEditUserStatus(event.target.value))
    }

    if (activeEditUserID == user.id) {
        return (
            <TableCell>
                <Stack direction={"row"} alignItems={"center"}>
                    <FormControl>
                        <InputLabel>Статус</InputLabel>
                        <Select
                            value={aciveEditUserStatus}
                            onChange={changeUserStatus}
                            label="Статус"
                        >
                            <MenuItem value={"STUDENT"}>Студент</MenuItem>
                            <MenuItem value={"TEACHER"}>Преподаватель</MenuItem>
                            <MenuItem value={"ADMIN"}>Администратор</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton>
                        <SaveIcon/>
                    </IconButton>
                </Stack>
            </TableCell>
        )
    }
    return (
        <TableCell>
            {user.user_access_level == "STUDENT" && "Студент"}
            {user.user_access_level == "TEACHER" && "Преподаватель"}
            {user.user_access_level == "ADMIN" && "Администратор"}
            {UserStorage.userAccessLevel == "ADMIN"
                && <IconButton onClick={editThisUser}>
                    <EditIcon/>
                </IconButton>}
        </TableCell>
    )
}
