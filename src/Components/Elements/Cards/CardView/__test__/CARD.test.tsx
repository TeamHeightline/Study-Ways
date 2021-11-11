import React from "react";
import {MockedProvider} from "@apollo/client/testing";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';
import wait from "waait";
import  {mountToJson} from "enzyme-to-json";
import { CARD } from "../../Card";
import {SHOW_CARD_BY_ID} from "../Struct"
const mockData = {
    request:{
        query: SHOW_CARD_BY_ID,
        variables: {
            id: 1800
        }
    },
    result:{
        data: {
            "cardById": {
                "id": "1800",
                "videoUrl": "https://www.youtube.com/watch?v=rVs1Nqe0Rxw",
                "title": "Лекция 3.5.2 | Классический закон сложения скоростей | Александр Чирцов | Лекториум",
                "text": "<p>Лекция 3.5.2 Классический закон сложения скоростей | Курс: Кинематика | Лектор: Александр Чирцов | Организатор: Университет ИТМО, Санкт-Петербургский политехнический университет Петра Великого</p>",
                "subTheme": [
                    {
                        "name": "Кинематика",
                        "id": "50",
                        "theme": {
                            "id": "49",
                            "name": "Физика",
                            "globalTheme": {
                                "id": "38",
                                "name": "Лекции Лекториум"
                            }
                        }
                    }
                ],
                "siteUrl": null,
                "testInCard": null,
                "testBeforeCard": null,
                "isCardUseTestInCard": false,
                "isCardUseTestBeforeCard": false,
                "isCardUseMainText": true,
                "isCardUseMainContent": true,
                "isCardUseAdditionalText": false,
                "isCardUseCopyright": false,
                "isCardUseArrowNavigation": false,
                "arrowBefore": null,
                "arrowDown": null,
                "arrowUp": null,
                "arrowNext": null,
                "copyright": null,
                "cardContentType": "A_0",
                "additionalText": "",
                "author": [
                    {
                        "name": "А.С. Чирцов",
                        "id": "6"
                    }
                ]
            }
        }

    }
}
describe("CARD testing", () =>{
    let wrapper
    let wrapperWithData
    beforeEach(async ()=>{
        wrapper = mount(
            <MockedProvider mocks={[]} addTypename={false}>
                <CARD/>
            </MockedProvider>
        );
        await act(async()=>{
            wrapperWithData  = mount(
                <MockedProvider mocks={[mockData]} addTypename={false}>
                    <CARD id={1800}/>
                </MockedProvider>
            )
        })
        await act(()=> wait(0))
        wrapperWithData.update()
    })
    test("CARD basic render test without data", ()=>{
        console.log(wrapper.debug())
        expect(wrapper).toBeTruthy();
    })
    test("CARD have only one loading spinner without data", ()=>{
        expect(wrapper.exists("#simple-loading")).toEqual(true)
        expect(wrapper.exists("#course-only-loading")).toEqual(false)
    })

    test("CARD basic render test with data", ()=>{
        expect(wrapperWithData).toBeTruthy();
    })
    test("Card have title", ()=>{
        expect(wrapperWithData.exists("#card-title")).toEqual(true)
        expect(wrapperWithData.text()).toContain(mockData.result.data.cardById.title)
    })


})