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
import {HardLevelSelector} from "../Elements/Cards/Editor/MainCardEditor/#HardLevelSelector";

interface IMainCardPublicViewProps extends React.HTMLAttributes<HTMLDivElement>{
    onlyCardSelectionMode?: boolean,
    onCardSelect?: any,
}
export const MainCardPublicView = observer(({onlyCardSelectionMode, onCardSelect, ...props}: IMainCardPublicViewProps) => {
    useEffect(() => {
        CardPageStorage.getCardsDataFromServer()
    }, [])
    const isMobile = isMobileHook()

    const memorizedCardsForDisplay = useMemo(() => <MCPVCards
            onlyCardSelectionMode={onlyCardSelectionMode}
            onCardSelect={(card_id) => onCardSelect(card_id)}
            cardsDataForRender={toJS(CardPageStorage.cardsDataForRender)}/>,
        [toJS(CardPageStorage.cardsDataForRender)[0]?.id, toJS(CardPageStorage.cardsDataForRender)[1]?.id,
            toJS(CardPageStorage.cardsDataForRender)[20]?.id])
    return (
        <div {...props} style={{paddingTop: isMobile? 0: 3}}>
            <MCPVSearchString/>
            <Grid container justifyContent={"space-evenly"} alignItems={"center"} rowSpacing={1}
                  spacing={4}
                  sx={{pt: isMobile? 1: 2, pl: 2, pr: 2}}
                  // style={{paddingTop: isMobile? 0: 9}}
            >
                <Grid item xs={12} md={3}>
                    <ThemeSelector openFromPublicView={true}
                                   cards_data={[]}
                                   changeSelectedData={() => {
                                       void (0)
                                   }}/>
                </Grid>
                <Grid item xs={12} md={3}>
                    <HardLevelSelector />
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
                {CardPageStorage?.dataHasBeenUpdated ?
                    <Alert severity="success" variant={"filled"}>
                        Данные обновлены
                    </Alert>:
                    <Alert severity="info" variant={"filled"}>
                        Обновление данных
                    </Alert>}
            </Snackbar>
        </div>
    );
})