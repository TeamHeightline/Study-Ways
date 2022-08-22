import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Card, CardActionArea} from "@mui/material";
import {CardByIDStore} from "../Store/CardByIDStore";


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

    const onGoToTestButtonClick = () => {
        console.log("testing time")
        if (!!card_store?.testElementRef?.current) {
            card_store.testElementRef.current.scrollIntoView({behavior: "smooth"})
        }
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
            <Button color={"error"} fullWidth variant={"contained"} onClick={onGoToTestButtonClick}>
                К тесту
            </Button>

        </Card>
    )
})

export default CardImage
