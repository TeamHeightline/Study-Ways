import {Box, List, ListItem, ListItemButton, ListItemText, Stack, Typography, Divider, IconButton} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../../../App/ReduxStore/RootStore";
import LinkIcon from '@mui/icons-material/Link';
import {IHelpArticle} from "../../../HelpArticleByURL/redux-store/types";
import {openEditDialog} from "../../redux-store";
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteHelpArticle} from "../../redux-store/async-actions";
import {getArticles} from "../../../HelpArticleByURL/redux-store/async-actions";


interface IHelpArticleListProps extends BoxProps {

}

export default function HelpArticleList({...props}: IHelpArticleListProps) {
    const articles = useAppSelector((store) => store.helpArticleEditor.articles)
    const dispatch = useAppDispatch()

    function handleOpenEditDialog(article: IHelpArticle) {
        dispatch(openEditDialog(article))
    }

    function handleDelete(e, id: number) {
        e.stopPropagation()
        dispatch(deleteHelpArticle(id))
            .then(() => {
                dispatch(getArticles())
            })
    }

    return (
        <Box {...props}>
            <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                <List>
                    {articles.map((article, index) => {
                        const isLast = index === articles.length - 1
                        return (
                            <Box>
                                <ListItem key={article.id} sx={{p: 0}}
                                          secondaryAction={
                                              <IconButton onClick={(e) => handleDelete(e, Number(article.id))}>
                                                  <DeleteIcon/>
                                              </IconButton>
                                          }
                                          onClick={() => handleOpenEditDialog(article)}>
                                    <ListItemButton sx={{p: 2}}>
                                        <ListItemText primary={article.title}
                                                      secondary={<Stack alignItems={"center"}
                                                                        spacing={1}
                                                                        direction={"row"}>
                                                          <LinkIcon/>
                                                          <Typography>{article.url}</Typography>
                                                      </Stack>}/>
                                    </ListItemButton>
                                </ListItem>
                                {!isLast && <Divider/>}
                            </Box>
                        )
                    })}
                </List>
            </Box>
        </Box>
    )
}
