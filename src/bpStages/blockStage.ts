import { RawStage } from "../helpers/convertStage";
import { BlockStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertBlockStage = (rawStage: RawStage, pageId: PageId): BlockStage => {
    const blockStage: BlockStage = {
        ...createBaseStage(rawStage, pageId),
        type: 'Block',
        width: rawStage.display["@_w"],
        height: rawStage.display["@_y"],
        containsStageIds: []
    }

    return blockStage
}