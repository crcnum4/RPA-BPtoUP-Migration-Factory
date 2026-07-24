import { RawStage } from "../helpers/convertStage";
import { ChoiceEndStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertChoiceEndStage = (rawStage: RawStage, pageId: PageId): ChoiceEndStage => {
    return {
        ...createBaseStage(rawStage, pageId),
        type: "ChoiceEnd",
        groupId: rawStage.groupid['#text'],
        out: rawStage.onsuccess ? rawStage.onsuccess['#text'] : null
    }
}