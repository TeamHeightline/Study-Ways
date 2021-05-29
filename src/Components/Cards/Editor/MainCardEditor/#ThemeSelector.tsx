import React, {useEffect} from 'react'
import {gql} from "@apollo/client";

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


export default function ThemeSelector({cards_data, ...props}: any){
    console.log(cards_data)
    useEffect(() =>{
        const cardsThemes: any = []
        cards_data.map((sameCard) =>{
            sameCard.subTheme.map((sameSubTheme) =>{
                if(cardsThemes.indexOf(sameSubTheme) == -1){
                    cardsThemes.push(sameSubTheme)
                }
            })
        })
        console.log("-------")
        console.log(cardsThemes)
    }, [])
    return(
        <div>

        </div>
    )
}