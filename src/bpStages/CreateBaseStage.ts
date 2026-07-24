import { RawStage } from "../helpers/convertStage";
import { BaseStage, BluePrismStage, PageId } from "../types/bp";

export const createBaseStage = (rawStage: RawStage, pageId: PageId): BaseStage => {
    return {
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"],
        description: rawStage.narrative ? rawStage.narrative["#text"] : "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
        type: "Unknown"
    }
}