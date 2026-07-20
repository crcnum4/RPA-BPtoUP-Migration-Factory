import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, ActionStage, InputProp, OutputProp } from "../types/bp";

export const convertActionStage = (rawStage: RawStage, pageId: PageId): ActionStage => {
    const actionStage: ActionStage = {
        type: "Action",
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"],
        description: rawStage.narrative ? rawStage.narrative["#text"] : "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
        resourceObject: rawStage.resource["@_object"],
        action: rawStage.resource["@_action"],
        input: [],
        output: [],
        out: rawStage.onsuccess["#text"]
    }

    if ("inputs" in rawStage) {
        const inputs = toArray(rawStage.inputs.input);
        const inputProps: InputProp[] = []
        for (const input of inputs) {
            inputProps.push({
                name: input["@_name"],
                dataType: normalizeBPDataType(input["@_type"]),
                description: input["@_narrative"] ?? "",
                expression: input["@_expr"] ?? ""
            })
        }
        actionStage.input = inputProps
    }

    if ("outputs" in rawStage) {
        const outputs = toArray(rawStage.outputs.output)
        const outputProps: OutputProp[] = []
        for (const output of outputs) {
            outputProps.push({
                name: output["@_name"],
                dataType: normalizeBPDataType(output["@_type"]),
                description: output["@_narrative"] ?? "",
                storeIn: output["@_stage"] ?? ""
            })
        }
        actionStage.output = outputProps
    }


    return actionStage

}