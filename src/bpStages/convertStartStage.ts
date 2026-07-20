import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, StartStage } from "../types/bp";

export const convertStartStage = (rawStage: RawStage, pageId: PageId): StartStage => {
    const startStage: StartStage = {
        type: "Start",
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"],
        description: rawStage.narrative ?? "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
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