import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {
    Avatar,
    Button, CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import ProfilePageStore from "../Store/profile-page-store";
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import {LoadingButton} from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';


interface IProfilePageProps extends PaperProps {

}

const ProfilePage = observer(({...props}: IProfilePageProps) => {
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
                    <Stack direction={"row"} spacing={8} sx={{pt: 8}} alignItems={"center"}>
                        <Avatar
                            sx={{width: 200, height: 200}}
                            src={ProfilePageStore.imageSrc}
                        >
                            {ProfilePageStore.avatarText}
                        </Avatar>
                        <Stack direction={"column"} spacing={2}>
                            <Stack direction={"row"} spacing={2}>
                                <TextField
                                    value={ProfilePageStore.firstname}
                                    onChange={ProfilePageStore.changeFirstName}
                                    id={"first_name"}
                                    label={"Имя"}
                                    variant={"filled"}/>
                                <TextField
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