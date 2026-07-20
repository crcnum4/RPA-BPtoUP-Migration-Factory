import { RawStage } from "../helpers/convertStage"
import { PageId, UnknownStage } from "../types/bp"

export const convertUknownStage = (rawStage: RawStage, pageId: PageId): UnknownStage => {
    return {
        type: "Unknown",
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"],
        description: rawStage.narrative ?? "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
        raw: rawStage,
    }
}