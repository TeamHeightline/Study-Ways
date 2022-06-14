export interface sequenceDataI {
    id: string,
    name: string,
    created_by_id: string,
    description: string,
    sequence_data: {
        sequence: number[]
    }
}
