
import { converDataStage, convertActionStage, convertAnchorStage, convertBlockStage, convertCalculationStage, convertChoiceEndStage, convertChoiceStage, convertCollectionStage, convertDecisionStage, convertEndStage, convertExceptionStage, convertMultipleCalculations, convertNoteStage, convertProcessInfoStage, convertRecoverStage, convertResumeStage, convertStartStage, convertSubSheetInfoStage, convertSubSheetStage, convertUknownStage } from "../bpStages";
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
        case "SubSheet":
            return convertSubSheetStage(rawStage, pageId)
        case "Decision":
            return convertDecisionStage(rawStage, pageId)
        case "Recover":
            return convertRecoverStage(rawStage, pageId)
        case "Resume":
            return convertResumeStage(rawStage, pageId)
        case "Calculation":
            return convertCalculationStage(rawStage, pageId)
        case "Anchor":
            return convertAnchorStage(rawStage, pageId)
        case "Block":
            return convertBlockStage(rawStage, pageId)
        case 'Exception':
            return convertExceptionStage(rawStage, pageId)
        case 'Note':
            return convertNoteStage(rawStage, pageId)
        case 'MultipleCalculation':
            return convertMultipleCalculations(rawStage, pageId)
        case 'ChoiceEnd':
            return convertChoiceEndStage(rawStage, pageId)
        case 'ChoiceStart':
            return convertChoiceStage(rawStage, pageId)
        default: 
            return convertUknownStage(rawStage, pageId)
    }
}