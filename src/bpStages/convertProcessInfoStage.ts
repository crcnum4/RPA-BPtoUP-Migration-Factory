import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, NoOutStage } from "../types/bp";

export const convertProcessInfoStage = (rawStage: RawStage, pageId: PageId): NoOutStage => {
    return {
        type: "ProcessInfo",
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"] ?? "Process Info",
        description: "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
    }
}