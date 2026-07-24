import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, SubSheetInfoStage } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertSubSheetInfoStage = (rawStage: RawStage, pageId: PageId): SubSheetInfoStage => {
    const subSheetInfoStage: SubSheetInfoStage = {
        ...createBaseStage(rawStage, pageId),
        type: "SubSheetInfo",
    }

    if ("postconditions" in rawStage) {
        subSheetInfoStage.postconditions = rawStage.postconditions["#text"]
    }
    if ("preconditions" in rawStage) {
        subSheetInfoStage.preconditions = rawStage.preconditions["#text"]
    }

    return subSheetInfoStage;
}