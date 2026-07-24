import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, StartStage } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertStartStage = (rawStage: RawStage, pageId: PageId): StartStage => {
    const startStage: StartStage = {
        ...createBaseStage(rawStage, pageId),
        type: "Start",
        inputDefinitions: [],
        out: rawStage.onsuccess["#text"]
    }

    if ("inputs" in rawStage) {
        const inputDefs: InputDef[] = []
        const inputs = toArray(rawStage.inputs.input)
        for (const input of inputs) {
            inputDefs.push({
                name: input["@_name"],
                dataType: normalizeBPDataType(input["@_type"]),
                description: input["@_narrative"] ?? "",
                storeIn: input["@_stage"] ?? "",
            })
        }

        startStage.inputDefinitions = inputDefs
    }

    return startStage
}