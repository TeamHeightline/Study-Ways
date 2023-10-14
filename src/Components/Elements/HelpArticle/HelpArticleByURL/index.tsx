import {Box, IconButton} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {getArticles} from "./redux-store/async-actions";
import React, {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from "../../../../root-redux-store/RootStore";
import {useLocation} from "react-router-dom";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ContentDialog from "./UI/content-dialog";

interface IArticleByURLProps extends BoxProps {

}

export default function ArticleByURL({...props}: IArticleByURLProps) {
    const dispatch = useAppDispatch()
    const location = useLocation();
    const articles = useAppSelector(state => state.helpArticleByURL.articles)

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        dispatch(getArticles())
    }, [])


    const pathname = location.pathname

    const sorted_articles_by_url_length = [...articles]
        .sort((aItem, bItem) => bItem.url.length - aItem.url.length)

    const article_by_url =sorted_articles_by_url_length.find((article) => pathname.includes(article.url))

    useEffect(() => {
        setIsOpen(false)
    }, [!!article_by_url])


    return (
        <Box {...props}>
            {article_by_url &&
                <>
                    <IconButton onClick={() => setIsOpen(true)}>
                        <QuestionMarkIcon/>
                    </IconButton>
                    <ContentDialog isOpen={isOpen} article={article_by_url} onClose={() => setIsOpen(false)}/>
                </>
            }

        </Box>
    )
}
