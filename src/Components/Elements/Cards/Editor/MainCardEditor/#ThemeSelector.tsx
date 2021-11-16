import React, {useEffect, useState} from 'react'
import {gql, useQuery} from "@apollo/client";
import TreeSelect from "antd/es/tree-select";
import {Spinner} from "react-bootstrap";
import {CardPageStorage} from "../../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {sort} from "fast-sort";
import {CardNode} from "../../../../../SchemaTypes";

const {SHOW_CHILD} = TreeSelect;
const GET_THEMES = gql`
    query GET_THEMES{
        cardGlobalTheme{
            id
            name
            cardthemeSet{
                id
                name
                cardsubthemeSet{
                    id
                    name
                }
            }
        }
    }`

interface IThemeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    cards_data?: CardNode[],
    openFromPublicView?: boolean,
    changeSelectedData?: any,
}

export const ThemeSelector = observer(({
                                           cards_data,
                                           openFromPublicView,
                                           changeSelectedData,
                                           ...props
                                       }: IThemeSelectorProps) => {
    const [dataForCardSubThemeSelect, setDataForCardThemeSelect] = useState<any>()
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState<any>()
    useEffect(() => {
        changeSelectedData(cards_data)
    }, [cards_data])
    const selectByThemes = (selected_themes) => {
        if (selected_themes.length === 0) {
            return (cards_data)
        }
        const selectedCardsArray: any = []
        cards_data?.map((sameCard) => {
            sameCard?.subTheme?.map((sameThemeInSameCard) => {
                if (selected_themes.indexOf(Number(sameThemeInSameCard?.id) * 1000000) !== -1) {
                    if (selectedCardsArray.indexOf(sameCard) === -1) {
                        selectedCardsArray.push(sameCard)
                    }
                }
            })
        })
        return (selectedCardsArray)
    }
    useQuery(GET_THEMES, {
        onCompleted: themesData => {
            //сбор массива ID подтем
            const cardsThemesIDArray: any = []
            cards_data?.map((sameCard) => {
                sameCard?.subTheme?.map((sameSubTheme) => {
                    if (cardsThemesIDArray.indexOf(sameSubTheme.id) == -1) {
                        cardsThemesIDArray.push(sameSubTheme.id)
                    }
                })
            })
            //Алгоритм -  сначала мы собираем массив айдишников нужных тем, затем в цикле проверяем,
            // совпадают ли эти айдишники с айди подтем, если да, то пушим в общй массив и разрешаем нашей
            //теме тоже пушится, это разрешает глобальной теме пушится, в результате у нас пушатся только нужные
            //подтемы, темы и глобальные темы

            const data: any = []
            themesData.cardGlobalTheme.map((GlobalTheme) => {
                const ThisGlobalTheme: any = {}
                ThisGlobalTheme.title = GlobalTheme.name
                ThisGlobalTheme.id = GlobalTheme.id
                ThisGlobalTheme.value = GlobalTheme.id
                ThisGlobalTheme.isLead = false
                ThisGlobalTheme.pid = 0
                let validGlobalThemeCounter = 0
                GlobalTheme.cardthemeSet.map((Theme) => {
                    const ThisTheme: any = {}
                    ThisTheme.title = Theme.name
                    ThisTheme.id = Theme.id * 1000
                    ThisTheme.value = Theme.id * 1000
                    ThisTheme.pId = ThisGlobalTheme.id
                    ThisGlobalTheme.isLead = false
                    let validSubThemeCounter = 0
                    Theme.cardsubthemeSet.map((SubTheme) => {
                        if (cardsThemesIDArray.indexOf(SubTheme.id) !== -1) {
                            validSubThemeCounter += 1
                            const ThisSubTheme: any = {}
                            ThisSubTheme.title = SubTheme.name
                            ThisSubTheme.id = SubTheme.id * 1000000
                            ThisSubTheme.value = SubTheme.id * 1000000
                            ThisSubTheme.pId = Theme.id * 1000
                            ThisGlobalTheme.isLead = true
                            data.push(ThisSubTheme)
                        }
                    })
                    if (validSubThemeCounter !== 0) {
                        data.push(ThisTheme)
                        validGlobalThemeCounter += 1
                    }

                })
                if (validGlobalThemeCounter !== 0) {
                    data.push(ThisGlobalTheme)
                }

            })
            console.log(data)
            setDataForCardThemeSelect(sort(data).asc([
                (anyTheme: any) => anyTheme.title.replace(/\D/g, '').length != 0 ? Number(anyTheme.title.replace(/[^\d]/g, '')) : 10000000,
                (anyTheme: any) => anyTheme.title
            ]))

        }
    })

    if (openFromPublicView ? !dataForCardSubThemeSelect : !toJS(CardPageStorage.dataForCardSubThemeSelect)) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    const tProps = {
        treeDataSimpleMode: true,
        treeData: !openFromPublicView ? dataForCardSubThemeSelect : toJS(CardPageStorage.dataForCardSubThemeSelect),
        value: cardSelectedThemeID,
        onChange: (data) => {
            changeSelectedData(selectByThemes(data))
            setCardSelectedThemeID(data)
        },
        treeCheckable: true,
        showCheckedStrategy: SHOW_CHILD,
        placeholder: 'Выбирите тему карточки',
        style: {
            width: '100%', backgroundColor: "#0A1929"
        },
    };

    return (
        <div {...props}>
            {!(openFromPublicView ? !dataForCardSubThemeSelect : !toJS(CardPageStorage.dataForCardSubThemeSelect))
            && <TreeSelect  {...openFromPublicView ? CardPageStorage.tProps : tProps}/>}
        </div>
    )
})