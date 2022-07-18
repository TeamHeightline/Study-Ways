import {TableCell} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {IBasicUserInformation} from "../../../../ServerLayer/Types/user.types";
import {useDispatch} from "react-redux";

interface IUIUserStatusCellProps extends PaperProps {
    user: IBasicUserInformation
}

export default function UIUserStatusCell({user, ...props}: IUIUserStatusCellProps) {
    const dispatch: any = useDispatch()
    // const activeEditUserID = useSelector((state: RootState) => state.statusEditorReducer.activeEditUserID)
    // const aciveEditUserStatus = useSelector((state: RootState) => state.statusEditorReducer.activeEditUserStatus)
    // const loadingUpdateStatus = useSelector((state: RootState) => state.statusEditorReducer.loading_update_status)
    //
    //
    // function editThisUser() {
    //     dispatch(changeEditUserStatus(user.user_access_level))
    //     dispatch(changeEditUserID(user.id))
    // }

    // function changeUserStatus(event) {
    //     dispatch(changeEditUserStatus(event.target.value))
    //     dispatch(statusEditorUpdateUserStatus(activeEditUserID, event.target.value))
    // }
    //
    // function closeEditMenu() {
    //     dispatch(changeEditUserID(null))
    //     dispatch(searchUsers())
    // }

    // if (activeEditUserID == user.id) {
    //     return (
    //         <TableCell>
    //             <Stack direction={"row"} alignItems={"center"} spacing={2}>
    //                 <FormControl>
    //                     <InputLabel>Статус</InputLabel>
    //                     <Select
    //                         size={"small"}
    //                         value={aciveEditUserStatus}
    //                         onChange={changeUserStatus}
    //                         label="Статус"
    //                     >
    //                         <MenuItem value={"STUDENT"}>Студент</MenuItem>
    //                         <MenuItem value={"TEACHER"}>Преподаватель</MenuItem>
    //                         <MenuItem value={"ADMIN"}>Администратор</MenuItem>
    //                     </Select>
    //                 </FormControl>
    //                 <LoadingButton
    //                     onClick={closeEditMenu}
    //                     loading={loadingUpdateStatus}
    //                     loadingPosition="start"
    //                     startIcon={<CheckIcon/>}
    //                     variant="outlined"
    //                 />
    //
    //             </Stack>
    //         </TableCell>
    //     )
    // }
    return (
        <TableCell>
            {user.user_access_level == "STUDENT" && "Студент"}
            {user.user_access_level == "TEACHER" && "Преподаватель"}
            {user.user_access_level == "ADMIN" && "Администратор"}
            {/*{UserStorage.userAccessLevel == "ADMIN"*/}
            {/*    && <IconButton onClick={editThisUser}>*/}
            {/*        <EditIcon/>*/}
            {/*    </IconButton>}*/}
        </TableCell>
    )
}
