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
import ProfilePageStore from "../Store/profile-page-store";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import Typography from "@mui/material/Typography";


interface IProfilePageProps extends PaperProps {

}

const ProfilePage = observer(({...props}: IProfilePageProps) => {
    const isMobile = isMobileHook()
    useEffect(() => ProfilePageStore.loadUserProfile(), [])
    if (!ProfilePageStore.allDataLoaded) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>)
    }
    return (
        <Paper elevation={0} {...props}>
            <Stack justifyContent={"center"} alignItems={"center"}>
                <Stack direction={"column"} spacing={2} alignItems={"center"}>
                    <Stack direction={isMobile ? "column" : "row"} spacing={8} sx={{pt: 8}} alignItems={"center"}>
                        <Stack direction={"column"} justifyContent={"center"}>
                            <Avatar
                                sx={{width: 200, height: 200}}
                                src={ProfilePageStore.imageSrc}
                            >
                                {ProfilePageStore.avatarText}
                            </Avatar>
                            <Typography variant={"subtitle1"} align={"center"}>
                                {UserStorage.username}
                            </Typography>
                        </Stack>
                        <Stack direction={"column"} spacing={2}>
                            <Stack direction={"row"} spacing={0.1}>
                                <TextField
                                    sx={{"& .MuiFilledInput-root": {borderTopRightRadius: 0}}}
                                    value={ProfilePageStore.firstname}
                                    onChange={ProfilePageStore.changeFirstName}
                                    id={"first_name"}
                                    label={"Имя"}
                                    variant={"filled"}/>
                                <TextField
                                    sx={{"& .MuiFilledInput-root": {borderTopLeftRadius: 0}}}
                                    value={ProfilePageStore.lastname}
                                    onChange={ProfilePageStore.changeLastName}
                                    id={"last_name"}
                                    label={"Фамилия"}
                                    variant={"filled"}/>
                            </Stack>
                            <FormControl fullWidth>
                                <InputLabel>Учебное заведение</InputLabel>
                                <Select
                                    value={ProfilePageStore.studyIn}
                                    onChange={ProfilePageStore.changeStudyIn}
                                    label="Учебное заведение"
                                >
                                    <MenuItem value={1}>ФМЛ 30</MenuItem>
                                    <MenuItem value={2}>РГПУ Им Герцена</MenuItem>
                                    <MenuItem value={3}>ЛЭТИ</MenuItem>
                                    <MenuItem value={4}>ИТМО</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                value={ProfilePageStore.imageSrc}
                                onChange={ProfilePageStore.changeImageSrc}
                                id={"image_src"}
                                fullWidth
                                label="Ссылка на изображение профиля"
                                variant="standard"/>
                            <LoadingButton
                                color="primary"
                                onClick={ProfilePageStore.updateUserProfile}
                                loading={!ProfilePageStore.dataUpdated}
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
