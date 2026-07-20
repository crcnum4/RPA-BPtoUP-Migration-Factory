
import { converDataStage, convertActionStage, convertCollectionStage, convertEndStage, convertProcessInfoStage, convertStartStage, convertSubSheetInfoStage, convertUknownStage } from "../bpStages";
import { BluePrismStage, PageId } from "../types/bp"

export type RawStage = any;


export const convertStage = (rawStage: RawStage, pageId: PageId): BluePrismStage => {
    switch (rawStage["@_type"]) {
        case "Start":
            return convertStartStage(rawStage, pageId)
        case "End": 
            return convertEndStage(rawStage, pageId)
        case "ProcessInfo":
            return convertProcessInfoStage(rawStage, pageId)
        case "SubSheetInfo":
            return convertSubSheetInfoStage(rawStage, pageId)
        case "Action":
            return convertActionStage(rawStage, pageId)
        case "Data":
            return converDataStage(rawStage, pageId)
        case "Collection":
            return convertCollectionStage(rawStage, pageId)
        default: 
            return convertUknownStage(rawStage, pageId)
    }
}