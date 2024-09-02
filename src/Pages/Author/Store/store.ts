import {makeAutoObservable, reaction, toJS} from "mobx";
import axiosClient from "../../../ServerLayer/QueryLayer/config";
import {AuthorData} from "./types";

class AuthorPageStore {
    constructor() {
        makeAutoObservable(this)
        reaction(() => this.author_id, () => this.loadPageData())
    }

    author_id: null | number = null
    pageData: null | AuthorData = null
    is_loading = true

    setAuthorID(id: string | number) {
        this.author_id = Number(id)
    }

    async loadPageData() {
        if (!this.author_id) {
            return
        }
        this.is_loading = true

        const res = await axiosClient.get<AuthorData>('page/author/' + this.author_id)
        this.pageData = res.data
        console.log(res)
        console.log(toJS(this.pageData))
        this.is_loading = false
    }

}

export const authorPageStore = new AuthorPageStore()