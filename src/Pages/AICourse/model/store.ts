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

    cardWithGeneratedAncestors: Record<string, boolean> = {}

    onSearch = () => {
        this.isSearchButtonClicked = true
        this.selectedDefaultCardID = null
        getCardsBySearch(this.searchString)
            .then((data) => {
                this.isDefaultCardsLoaded = true
                this.setDefaultCardIDs(data)
            })
    }

    loadNextCards = (cardID: number) => {
        if (this.isCardHaveAncestors(cardID)) {
            return
        }

        getNextCards(cardID)
            .then((nextCardIds) => {
                const newCardIDs = this.filterNotCreatedCards(toJS(nextCardIds))
                if (!newCardIDs) {
                    return
                }
                this.addNewCards(newCardIDs)
                this.generateNextNodes(cardID, newCardIDs)
                this.generateEdgesForNextNode(cardID, newCardIDs)
                this.addCardWithGeneratedAncestors(cardID)
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
        if (this.selectedDefaultCardID) {
            return;
        }

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
        return cardIDArray.filter((cardID) => !this.cardIDMap?.[cardID] && cardID !== this.selectedDefaultCardID)
    }

    addNewCards = (cardIDArray: number[]) => {
        cardIDArray.forEach((cardID) => {
            this.cardIDMap[cardID] = true
        })
    }

    addCardWithGeneratedAncestors = (cardID: number) => {
        this.cardWithGeneratedAncestors[cardID] = true
    }

    isCardHaveAncestors = (cardID: number) => {
        return this.cardWithGeneratedAncestors.hasOwnProperty(cardID)
    }


}

export const AICourseStore = new Store()