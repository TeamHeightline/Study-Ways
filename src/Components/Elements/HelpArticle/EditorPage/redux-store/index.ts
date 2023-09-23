import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createHelpArticle} from "./async-actions";

const helpArticleEditorPageSlice = createSlice({
    name: 'helpArticleEditorPage',
    initialState: {
        is_open_create_dialog: true,
        is_loading_create_article: false,
        create_article_data: {
            title: "",
            url: "",
            content: "",
            video_url: ""
        }
    },
    reducers: {
        setIsOpenCreateDialog: (state, action) => {
            state.is_open_create_dialog = action.payload
        },
        changeCreateArticleData: (state, action: PayloadAction<{ field: string, value: any }>) => {
            const {field, value} = action.payload
            state.create_article_data[field] = value
        }
    },
    extraReducers: builder => {
        builder.addCase(createHelpArticle.pending, (store) => {
            store.is_loading_create_article = true
            store.is_open_create_dialog = false
        })
        builder.addCase(createHelpArticle.rejected, (store) => {
            store.is_loading_create_article = false
            store.is_open_create_dialog = true
        })

    }
})

export const {setIsOpenCreateDialog, changeCreateArticleData} = helpArticleEditorPageSlice.actions
export default helpArticleEditorPageSlice.reducer