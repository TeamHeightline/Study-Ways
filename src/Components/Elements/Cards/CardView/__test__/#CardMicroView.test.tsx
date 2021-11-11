import React from "react";
import CardMicroView from "../#CardMicroView"
import {MockedProvider} from "@apollo/client/testing";
import { mount } from "enzyme";
import { act } from 'react-dom/test-utils';
import wait from "waait";
import  {mountToJson} from "enzyme-to-json";


const mocks = [];

const mocksWithData = {
        request: {
            query: GET_CARD_FOR_MICRO_VIEW_BY_ID,
            variables: { id: 1800 },
        },
        result:  {
            data: {
                cardById: {
                    id: 1800,
                    title: "Лекция 3.5.2 | Классический закон сложения скоростей | Александр Чирцов | Лекториум",
                    cardContentType: "A_0",
                    videoUrl: "https://www.youtube.com/watch?v=rVs1Nqe0Rxw",
                    subTheme: [
                        {
                            id: 50,
                            name: "Кинематика",
                            theme: {
                                id: 49,
                                name: "Физика",
                                globalTheme: {
                                    id: 38,
                                    name: "Лекции Лекториум"
                                }
                            }
                        }
                    ],
                    author: [
                        {
                            id: 6,
                            name: "А.С. Чирцов"
                        }
                    ]
                }
            },
        }
    }

import {GET_CARD_FOR_MICRO_VIEW_BY_ID} from "../Struct";

describe("CardMicroView Testing", () => {
    let wrapper
    let wrapperWithData
    beforeEach(async () =>{
         wrapper = mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <CardMicroView/>
            </MockedProvider>
        );
        await act(async()=>{
            wrapperWithData  = mount(
                <MockedProvider mocks={[mocksWithData]} addTypename={false}>
                    <CardMicroView cardID={1800}/>
                </MockedProvider>
            )
        })
        await act(()=> wait(0))
        wrapperWithData.update()
    })
    test("CardMicroView without data can be rendered", () => {
        expect(wrapper).toBeTruthy();
    })
    test("Render loading skeleton test", () =>{
        expect (wrapper.exists('.MuiSkeleton-root')).toEqual(true);
        expect (wrapper.exists('.MuiSkeleton-rectangular')).toEqual(true)
    })
    test("CardMicroView with data can be rendered", () =>{
        expect(wrapperWithData).toBeTruthy();
    })
    test("Skeleton cannot be shown if data is not empty",   async() =>{
        expect (wrapperWithData.exists('.MuiSkeleton-root')).toEqual(false);
        expect (wrapperWithData.exists('.MuiSkeleton-rectangular')).toEqual(false)
    })
    test("Check that ID is renders", async() =>{
        expect (wrapperWithData.text().includes("ID: "+ mocksWithData.result.data.cardById.id)).toEqual(true)
    })
    test("Check that Title is renders", async() =>{
        expect (wrapperWithData.text().includes(mocksWithData.result.data.cardById.title.slice(0, 56))).toEqual(true)
    })
    test("Check that SubTheme is renders", async() =>{
        expect (wrapperWithData.text().includes(mocksWithData.result.data.cardById.subTheme[0].name)).toEqual(true)
    })
    test("Check that Author is renders", async() =>{
        expect (wrapperWithData.text().includes(mocksWithData.result.data.cardById.author[0].name)).toEqual(true)
    })
    test("Check that youtube icon  is renders", async() =>{
        expect (wrapperWithData.exists("#YouTube-icon")).toEqual(true)
    })
    test("Check that layout of component without data doesn't change", async()=>{
        // Создает и проверяет снапшот для компонента до получения данных
        expect(mountToJson(wrapperWithData)).toMatchSnapshot();
    })
    test("Check that layout of component with data doesn't change", async()=>{
        // Создает и проверяет снапшот после получения данных
        expect(mountToJson(wrapperWithData)).toMatchSnapshot();
    })

})