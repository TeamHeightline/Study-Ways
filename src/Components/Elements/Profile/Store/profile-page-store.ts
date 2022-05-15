import {makeAutoObservable, reaction} from "mobx";
import {ClientStorage} from "../../../../Store/ApolloStorage/ClientStorage";
import {LoadUserProfile, UpdateUserProfile} from "./query";
import {Query} from "../../../../SchemaTypes";
import {UserStorage} from "../../../../Store/UserStore/UserStore";

class ProfilePageStoreClass {
    constructor() {
        makeAutoObservable(this)
        reaction(() => this.userStorage.isLogin, () => this.loadUserProfile())
    }

    firstname = ''
    lastname = ''
    imageSrc = ''
    studyIn?: string
    clientStorage = ClientStorage
    userStorage = UserStorage
    allDataLoaded = false
    dataUpdated = true

    loadUserProfile = () => {
        if (this.userStorage.isLogin) {
            this.clientStorage.client
                .query<Query>({
                    query: LoadUserProfile,
                    fetchPolicy: "network-only"
                })
                .then(res => res.data.myProfile)
                .then(profileData => {
                    if (profileData) {
                        this.firstname = profileData.firstname
                        this.lastname = profileData.lastname
                        this.imageSrc = profileData.avatarSrc || ""
                        this.studyIn = profileData.studyIn?.id
                        this.allDataLoaded = true
                    }
                })
        }
    }


    updateUserProfile = () => {
        this.dataUpdated = false
        this.clientStorage.client.mutate({
            mutation: UpdateUserProfile, variables: {
                lastname: this.lastname,
                firstname: this.firstname,
                studyIn: this.studyIn,
                avatarSrc: this.imageSrc
            }
        })
            .then(() => this.dataUpdated = true)
    }

    get avatarText() {
        return this.firstname.slice(0, 1) + this.lastname.slice(0, 1)
    }

    changeFirstName = (e) => {
        this.firstname = e.target.value
    }

    changeLastName = (e) => {
        this.lastname = e.target.value
    }

    changeImageSrc = (e) => {
        this.imageSrc = e.target.value
    }

    changeStudyIn = (e) => {
        this.studyIn = e.target.value
    }
}

const ProfilePageStore = new ProfilePageStoreClass()

export default ProfilePageStore
