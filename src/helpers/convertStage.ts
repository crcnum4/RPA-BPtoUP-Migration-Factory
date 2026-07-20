
import { convertEndStage, convertStartStage, convertUknownStage } from "../bpStages";
import { BluePrismStage, PageId } from "../types/bp"

export type RawStage = any;


export const convertStage = (rawStage: RawStage, pageId: PageId): BluePrismStage => {
    switch (rawStage["@_type"]) {
        case "Start":
            return convertStartStage(rawStage, pageId)
        case "End": 
            return convertEndStage(rawStage, pageId)
        default: 
            return convertUknownStage(rawStage, pageId)
    }
}