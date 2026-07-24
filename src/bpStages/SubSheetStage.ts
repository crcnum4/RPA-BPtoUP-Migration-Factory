import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputProp, normalizeBPDataType, OutputProp, PageId, SubSheetStage } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertSubSheetStage = (rawStage: RawStage, pageId: PageId): SubSheetStage => {
    const subsheetStage: SubSheetStage = {
        ...createBaseStage(rawStage, pageId),
        type: 'SubSheet',
        inputs: null,
        outputs: null,
        destination: rawStage.processid['#text'],
        out: rawStage.onsuccess['#text']
    }

    if ("inputs" in rawStage) {
        const inputs = toArray(rawStage.inputs.input)
        const inputProps: InputProp[] = []
        for (const input of inputs) {
            inputProps.push({
                name: input["@_name"],
                dataType: normalizeBPDataType(input["@_type"]),
                description: input["@_narrative"] ?? "",
                expression: input["@_expr"] ?? null
            })
        }
        subsheetStage.inputs = inputProps
    }

    if ("outputs" in rawStage) {
        const outputs = toArray(rawStage.outputs.output)
        const outProps: OutputProp[] = []
        for (const output of outputs) {
            outProps.push({
                name: output["@_name"],
                dataType: normalizeBPDataType(output["@_type"]),
                description: output["@_narrative"],
                storeIn: output['@_stage'] ?? null
            })
        }
        subsheetStage.outputs = outProps
    }

    return subsheetStage;

}