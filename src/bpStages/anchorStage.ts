import { RawStage } from "../helpers/convertStage";
import { AnchorStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertAnchorStage = (rawStage: RawStage, pageId: PageId): AnchorStage => {
    return {
        ...createBaseStage(rawStage, pageId),
        type: "Anchor",
        out: rawStage.onsuccess['#text']
    }
}