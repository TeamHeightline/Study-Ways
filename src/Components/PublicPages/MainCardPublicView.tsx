import React, {useEffect, useMemo} from 'react'
import {ThemeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ThemeSelector";
import {ContentTypeSelector} from "../Elements/Cards/Editor/MainCardEditor/#ContentTypeSelector";
import {AuthorSelector} from "../Elements/Cards/Editor/MainCardEditor/#AuthorSelector";
import {CardPageStorage} from "../../Store/PublicStorage/CardsPage/CardPageStorage";
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {CircularProgress, Grid, Snackbar} from "@mui/material";
import {Alert, Pagination} from '@mui/material';
import {MCPVSearchString} from "../Elements/Cards/CardView/#MCPVSearchString";
import {MCPVCards} from "../Elements/Cards/CardView/#MCPVCards";
import {isMobileHook} from "../../CustomHooks/isMobileHook";

export const MainCardPublicView = observer(({...props}: any) => {
    useEffect(() => {
        CardPageStorage.getCardsDataFromServer()
    }, [])
    const isMobile = isMobileHook()

    const memorizedCardsForDisplay = useMemo(() => <MCPVCards
            cardsDataForRender={toJS(CardPageStorage.cardsDataForRender)}/>,
        [toJS(CardPageStorage.cardsDataForRender)[0]?.id, toJS(CardPageStorage.cardsDataForRender)[1]?.id,
            toJS(CardPageStorage.cardsDataForRender)[2]?.id])
    return (
        <div {...props} style={{paddingTop: isMobile? 0: 3}}>
            <MCPVSearchString/>
            <Grid container justifyContent={"space-around"} alignItems={"center"} rowSpacing={1}
                  style={{paddingTop: isMobile? 0: 9}}>
                <Grid item xs={12} md={3}>
                    <ThemeSelector openFromPublicView={true}
                                   cards_data={[]}
                                   changeSelectedData={() => {
                                       void (0)
                                   }}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    {CardPageStorage.cardsDataAfterSelectTheme &&
                    <ContentTypeSelector
                        openFromPublicView={true}
                        cards_data={[]}
                        changeSelectedData={() => {
                            // console.log(data)
                            void (0)
                        }}/>}
                </Grid>
                <Grid item xs={12} md={3}>
                    {CardPageStorage.cardsDataAfterSelectContentType &&
                    <AuthorSelector cards_data={[]}
                                    openFromPublicView={true}
                                    changeSelectedData={() => {
                                        void (0)
                                    }}/>}
                </Grid>
            </Grid>

            <Grid container justifyContent="center" >
                <Grid item>
                    {!toJS(CardPageStorage.cardsDataForRender).length && <div style={{marginTop: 12}}><CircularProgress/></div>}
                </Grid>
            </Grid>
            {memorizedCardsForDisplay}
            {toJS(CardPageStorage.cardsDataForRender).length !== 0 && CardPageStorage.cardsDataForRender &&
            <Grid container justifyContent="center" style={{marginTop: 12}}>
                <Grid item>
                    <Pagination
                        page={CardPageStorage.pageNumber}
                        onChange={(e, value) =>
                            CardPageStorage.changeActiveCardMicroViewPage(value)}
                        size="large"
                        count={CardPageStorage.numberOfPages}
                        shape="rounded"/>
                </Grid>
            </Grid>}
            <Snackbar open={true} autoHideDuration={6000}>
                <Alert severity="success">
                    Обновить данные
                </Alert>
            </Snackbar>
        </div>
    );
})