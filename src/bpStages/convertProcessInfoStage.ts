import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, NoOutStage } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertProcessInfoStage = (rawStage: RawStage, pageId: PageId): NoOutStage => {
    return {
        ...createBaseStage(rawStage, pageId),
        type: "ProcessInfo",
    }
}