import { RawStage } from "../helpers/convertStage";
import { PageId, ResumeStage } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertResumeStage = (rawStage: RawStage, pageId: PageId): ResumeStage => {
    return {
        ...createBaseStage(rawStage, pageId),
        type: 'Resume',
        out: rawStage.onsuccess["#text"]
    }
}