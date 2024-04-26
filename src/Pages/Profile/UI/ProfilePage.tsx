import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {
    Avatar,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField
} from "@mui/material";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import Typography from "@mui/material/Typography";
import {useAppDispatch, useAppSelector} from "../../../ReduxStore/RootStore";
import {loadMyProfile, updateProfile} from "../redux-store/async-acrions";
import {changeProfileData} from "../redux-store";
import {IProfile} from "../redux-store/types";


interface IProfilePageProps extends PaperProps {

}

const ProfilePage = observer(({...props}: IProfilePageProps) => {
    const dispatch = useAppDispatch()
    const {profileData, pending, pendingUpdate} = useAppSelector(state => state.profile)

    const isMobile = isMobileHook()

    useEffect(() => {
        if (UserStorage.isLogin) {
            dispatch(loadMyProfile())
        }
    }, [UserStorage.isLogin]);


    function changeField({key, value}: { key: keyof IProfile, value: IProfile[keyof IProfile] }) {
        dispatch(changeProfileData({key, value}))
    }

    function saveProfile() {
        if (!profileData) {
            return
        }
        dispatch(updateProfile(profileData))
            .then(() => {
                dispatch(loadMyProfile())
            })
    }


    if (pending) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>)
    }


    return (
        <Paper elevation={0} {...props}>
            <Stack justifyContent={"center"} alignItems={"center"}>
                <Stack direction={"column"} spacing={2} alignItems={"center"}>
                    <Stack direction={isMobile ? "column" : "row"} spacing={8} sx={{pt: 8, px: 1}}
                           alignItems={"center"}>
                        <Stack direction={"column"} justifyContent={"center"}>
                            <Avatar
                                sx={{width: 200, height: 200}}
                                src={profileData?.avatar_src || ""}
                            >
                                {(profileData?.firstname?.slice(0.1) || "") + (profileData?.lastname?.slice(0.1) || "")}
                            </Avatar>
                            <Typography variant={"subtitle1"} align={"center"}>
                                {profileData?.users_customuser?.username || ''}
                            </Typography>
                        </Stack>
                        <Stack direction={"column"} spacing={2}>
                            <Stack direction={"row"} spacing={0.1}>
                                <TextField
                                    sx={{"& .MuiFilledInput-root": {borderTopRightRadius: 0}}}
                                    value={profileData?.firstname || ""}
                                    onChange={(e) => changeField({key: "firstname", value: e.target.value})}
                                    id={"first_name"}
                                    label={"Имя"}
                                    variant={"filled"}/>
                                <TextField
                                    sx={{"& .MuiFilledInput-root": {borderTopLeftRadius: 0}}}
                                    value={profileData?.lastname || ""}
                                    onChange={(e) => changeField({key: "lastname", value: e.target.value})}
                                    id={"last_name"}
                                    label={"Фамилия"}
                                    variant={"filled"}/>
                            </Stack>
                            <Stack direction={"row"} spacing={0.1}>
                                <FormControl fullWidth
                                             sx={{
                                                 "& .MuiOutlinedInput-root": {
                                                     borderTopRightRadius: 0,
                                                     borderBottomRightRadius: 0
                                                 }
                                             }}>
                                    <InputLabel>Учебное заведение</InputLabel>
                                    <Select
                                        value={profileData?.study_in_id || ""}
                                        onChange={(e) => changeField({key: "study_in_id", value: e.target.value})}
                                        label="Учебное заведение"
                                    >
                                        <MenuItem value={1}>ФМЛ 30</MenuItem>
                                        <MenuItem value={2}>РГПУ Им Герцена</MenuItem>
                                        <MenuItem value={3}>ЛЭТИ</MenuItem>
                                        <MenuItem value={4}>ИТМО</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0
                                        }, width: 200
                                    }}
                                    value={profileData?.group || ""}
                                    onChange={(e) => changeField({key: "group", value: e.target.value})}
                                    id={"last_name"}
                                    label={"Группа"}
                                    variant={"outlined"}/>
                            </Stack>
                            <TextField
                                value={profileData?.avatar_src}
                                onChange={(e) => changeField({key: "avatar_src", value: e.target.value})}
                                id={"image_src"}
                                fullWidth
                                label="Ссылка на изображение профиля"
                                variant="standard"/>
                            <LoadingButton
                                color="primary"
                                onClick={saveProfile}
                                loading={pendingUpdate}
                                loadingPosition="start"
                                startIcon={<SaveIcon/>}
                                variant="outlined"
                            >
                                Сохранить
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    )
})

export default ProfilePage
