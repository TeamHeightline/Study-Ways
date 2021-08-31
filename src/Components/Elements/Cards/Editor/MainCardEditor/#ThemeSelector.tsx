import React, {useEffect, useState} from 'react'
import {gql, useQuery} from "@apollo/client";
import { TreeSelect} from "antd";
import {Spinner, Row, Col} from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import {CardPageStorage} from "../../../../../Store/PublicStorage/CardsPage/CardPageStorage";
import {observer} from "mobx-react";
import {toJS} from "mobx";
const { SHOW_CHILD } = TreeSelect;
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


export const ThemeSelector = observer(({cards_data, ...props}: any) =>{
    const [dataForCardSubThemeSelect, setDataForCardThemeSelect] = useState<any>()
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState<any>()
    useEffect(()=>{
        props.changeSelectedData(cards_data)
    }, [cards_data])
    const selectByThemes = (selected_themes) =>{
        if(selected_themes.length === 0){
            return (cards_data)
        }
        const selectedCardsArray: any = []
        cards_data.map((sameCard) =>{
            sameCard.subTheme.map((sameThemeInSameCard)=>{
                if(selected_themes.indexOf(sameThemeInSameCard.id * 1000000) !== -1){
                    if(selectedCardsArray.indexOf(sameCard) === -1){
                        selectedCardsArray.push(sameCard)
                    }
                }
            })
        })
        return(selectedCardsArray)
    }
    const {data: themesData} = useQuery(GET_THEMES, {
        onCompleted: themesData => {
            //сбор массива ID подтем
            const cardsThemesIDArray: any = []
            cards_data.map((sameCard) =>{
                sameCard.subTheme.map((sameSubTheme) =>{
                    if(cardsThemesIDArray.indexOf(sameSubTheme.id) == -1){
                        cardsThemesIDArray.push(sameSubTheme.id)
                    }
                })
            })
            //Алгоритм -  сначала мы собираем массив айдишников нужных тем, затем в цикле проверяем,
            // совпадают ли эти айдишники с айди подтем, если да, то пушим в общй массив и разрешаем нашей
            //теме тоже пушится, это разрешает глобальной теме пушится, в результате у нас пушатся только нужные
            //подтемы, темы и глобальные темы

            const data: any = []
            themesData.cardGlobalTheme.map((GlobalTheme) =>{
                const ThisGlobalTheme: any = {}
                ThisGlobalTheme.title = GlobalTheme.name
                ThisGlobalTheme.id = GlobalTheme.id
                ThisGlobalTheme.value = GlobalTheme.id
                ThisGlobalTheme.isLead = false
                ThisGlobalTheme.pid = 0
                let validGlobalThemeCounter = 0
                GlobalTheme.cardthemeSet.map((Theme) =>{
                    const ThisTheme: any = {}
                    ThisTheme.title = Theme.name
                    ThisTheme.id = Theme.id * 1000
                    ThisTheme.value = Theme.id * 1000
                    ThisTheme.pId = ThisGlobalTheme.id
                    ThisGlobalTheme.isLead = false
                    let validSubThemeCounter = 0
                    Theme.cardsubthemeSet.map((SubTheme) =>{
                        if(cardsThemesIDArray.indexOf(SubTheme.id) !== -1){
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
                    if(validSubThemeCounter !== 0){
                        data.push(ThisTheme)
                        validGlobalThemeCounter += 1
                    }

                })
                if(validGlobalThemeCounter !== 0){
                    data.push(ThisGlobalTheme)
                }

            })
            setDataForCardThemeSelect(data)

        }
    })

    if(props.openFromPublicView ? !dataForCardSubThemeSelect : !toJS(CardPageStorage.dataForCardSubThemeSelect)){
        return(
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    const tProps = {
        treeDataSimpleMode: true,
        treeData: toJS(CardPageStorage.dataForCardSubThemeSelect),
        value: cardSelectedThemeID,
        onChange: (data) =>{
            props.changeSelectedData(selectByThemes(data))
            setCardSelectedThemeID(data)
        },
        treeCheckable: true,
        showCheckedStrategy: SHOW_CHILD,
        placeholder: 'Выбирите тему карточки',
        style: {
            width: '100%',
        },
    };

    return(
        <Row {...tProps}>
            <Col className="col-3 mt-2 ml-lg-2">
                <Typography variant="h6" gutterBottom className="ml-lg-4">
                    Тема:
                </Typography>
            </Col>
            <Col className="col-8 mt-2 ml-2 ml-lg-0">
                {!(props.openFromPublicView ? !dataForCardSubThemeSelect : !toJS(CardPageStorage.dataForCardSubThemeSelect))
                && <TreeSelect className="col-11" {...props?.openFromPublicView ? CardPageStorage.tProps : tProps}/>}

            </Col>
        </Row>
    )
})