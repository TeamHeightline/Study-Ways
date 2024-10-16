import {makeAutoObservable, toJS} from "mobx";
import {getCardsBySearch, getNextCards} from "./api";
import {Edge, Node} from "@xyflow/react/dist/esm/types";
import {generateInitialNodes} from "../utils/generateInitialNodes";
import {generateNextNodes} from "../utils/generateNextNodes";
import {generateEdgesForNextNodes} from "../utils/generateEdgesForNextNodes";
import {getLayoutedElements} from "../utils/getLayoutElements";

class Store {
    constructor() {
        makeAutoObservable(this)
    }

    searchString = ''
    defaultCardIDs: number[] = []


    nodes: Node[] = []

    edges: Edge[] = []

    selectedDefaultCardID: null | number = null

    selectedCardId: null | number = null

    isSearchButtonClicked = false

    isDefaultCardsLoaded = false

    cardIDMap: Record<string, boolean> = {}

    onSearch = () => {
        this.isSearchButtonClicked = true
        getCardsBySearch(this.searchString)
            .then((data) => {
                this.isDefaultCardsLoaded = true
                this.setDefaultCardIDs(data)
            })
    }

    loadNextCards = (cardID: number) => {
        getNextCards(cardID)
            .then((nextCardIds) => {
                const newCardIDs = this.filterNotCreatedCards(nextCardIds)
                this.addNewCards(nextCardIds)
                this.generateNextNodes(cardID, newCardIDs)
                this.generateEdgesForNextNode(cardID, newCardIDs)
                this.reLayout()
            })
    }

    generateNextNodes = (rootNodeID: number, nextNodeIDs: number[]) => {
        const rootCard = this.nodes.find(node => node.id === String(rootNodeID))
        if (!rootCard) {
            return
        }
        const newNodes = generateNextNodes(rootCard.position, nextNodeIDs)

        this.setNodes([...toJS(this.nodes), ...newNodes])
    }

    generateEdgesForNextNode = (rootNodeID: number, nextNodeIDs: number[]) => {
        this.setEdges([...toJS(this.edges), ...generateEdgesForNextNodes(rootNodeID, nextNodeIDs)])
    }

    reLayout = () => {
        const {nodes, edges} = getLayoutedElements(toJS(this.nodes), toJS(this.edges), {direction: 'LR'});
        this.nodes = nodes
        this.edges = edges
    }


    generateDefaultNodes = () => {
        this.clearNodes()
        this.nodes = generateInitialNodes(this.defaultCardIDs)
    }


    setUINodes = (callBackFn: (nodes: Node[]) => Node[]) => {
        this.setNodes(callBackFn(this.nodes))
    }
    setUiEdges = (callBackFn: (nodes: Edge[]) => Edge[]) => {
        this.setEdges(callBackFn(this.edges))
    }

    clearNodes = () => {
        this.setNodes([])
    }


    setNodes = (nodes: Node[]) => {
        this.nodes = nodes
    }
    setEdges = (edges: Edge[]) => {
        this.edges = edges
    }
    setSearchString = (searchString: string) => {
        this.searchString = searchString
    }

    setDefaultCardIDs = (cardIDs: number[]) => {
        this.defaultCardIDs = cardIDs
        this.generateDefaultNodes()
    }

    setSelectedCardID = (cardID: number) => {
        this.selectedCardId = cardID
    }

    setDefaultCardID = (cardID: number) => {
        this.selectedDefaultCardID = cardID

        const node = this.nodes
            .find(node => node.id === String(cardID))
        if (!node) {
            return
        }
        node.position = {x: 0, y: 0}
        this.nodes = [node]
    }

    filterNotCreatedCards = (cardIDArray: number[]) => {
        return cardIDArray.filter((cardID) => !this.cardIDMap?.[cardID])
    }

    addNewCards = (cardIDArray: number[]) => {
        cardIDArray.forEach((cardID) => {
            this.cardIDMap[cardID] = true
        })
    }


}

export const AICourseStore = new Store()