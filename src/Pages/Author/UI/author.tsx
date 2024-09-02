import {observer} from "mobx-react";
import {toJS} from "mobx";
import {authorPageStore} from "../Store/store";
import {Box, Stack, Typography} from "@mui/material";

export const Author = observer(() => {
    const userProfile = toJS(authorPageStore.pageData?.users_userprofile)
    return (
        <Box>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={1}>
                <Box sx={{
                    width: "100%",
                    aspectRatio: 1,
                    maxWidth: {md: 300},
                    backgroundImage: `url(${userProfile?.avatar_src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "block",
                    borderRadius: 4
                }}/>
                <Box>
                    <Typography variant={'h3'}>
                        {userProfile?.firstname || ''} {' '}
                        {userProfile?.lastname || ''}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    )
})