import {Box, Stack, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../../../root-redux-store/RootStore";
import {changeCreateArticleData} from "../../redux-store";
import TitleIcon from '@mui/icons-material/Title';

interface ITitleProps extends BoxProps {

}

export default function Title({...props}: ITitleProps) {
    const {
        title
    } = useAppSelector(store => store.helpArticleEditor.create_article_data)
    const dispatch = useAppDispatch()

    function handleChange(e) {
        const value = e.target.value || ""
        dispatch(changeCreateArticleData({
            field: "title",
            value
        }))
    }

    return (
        <Box {...props}>
            <Stack direction={"row"} sx={{mt: 1}} spacing={1} alignItems={"center"}>
                <TitleIcon fontSize="large"/>
                
                <TextField value={title} onChange={handleChange} variant={"outlined"}
                           sx={{width: 550}}
                           label={"Заголовок справки"}>
                </TextField>
            </Stack>
        </Box>
    )
}
