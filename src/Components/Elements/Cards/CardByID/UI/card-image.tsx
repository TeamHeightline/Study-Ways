import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Card, CardActionArea} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";
import GoToTestButton from "./go-to-test-button";


interface ICardImageProps extends PaperProps {
    card_store: CardByIDStore

}

const CardImage = observer(({card_store, ...props}: ICardImageProps) => {
    const card_image = "url(" + card_store.cardImageURLForUI + ")"
    const isRemoteResourceContentType = card_store?.card_data?.cardContentType == "A_1"
    const remoteResourceURL = String(card_store.card_data?.siteUrl)

    const isClickableImage = isRemoteResourceContentType && remoteResourceURL
    const goToRemoteResource = () => {
        window.open(remoteResourceURL, '_blank')
    }


    return (
        <Card elevation={0} {...props}
              sx={{
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  width: "100%",
                  height: 400,
                  backgroundImage: card_image,
              }}>
            {isClickableImage &&
                <CardActionArea
                    sx={{
                        width: "100%",
                        height: "100%"
                    }}
                    onClick={goToRemoteResource}
                />}
            <GoToTestButton card_store={card_store}/>

        </Card>
    )
})

export default CardImage
