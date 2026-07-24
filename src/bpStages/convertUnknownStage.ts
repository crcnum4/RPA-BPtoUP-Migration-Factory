import { RawStage } from "../helpers/convertStage"
import { PageId, UnknownStage } from "../types/bp"
import { createBaseStage } from "./CreateBaseStage"

export const convertUknownStage = (rawStage: RawStage, pageId: PageId): UnknownStage => {
    return {
        ...createBaseStage(rawStage, pageId),
        type: "Unknown",
        raw: rawStage,
    }
}