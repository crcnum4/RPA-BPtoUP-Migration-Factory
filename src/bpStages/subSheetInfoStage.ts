import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, SubSheetInfoStage } from "../types/bp";

export const convertSubSheetInfoStage = (rawStage: RawStage, pageId: PageId): SubSheetInfoStage => {
    const subSheetInfoStage: SubSheetInfoStage = {
        type: "SubSheetInfo",
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"],
        description: rawStage.narrative ? rawStage.narrative["#text"] : "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
    }

    if ("postconditions" in rawStage) {
        subSheetInfoStage.postconditions = rawStage.postconditions["#text"]
    }
    if ("preconditions" in rawStage) {
        subSheetInfoStage.preconditions = rawStage.preconditions["#text"]
    }

    return subSheetInfoStage;
}