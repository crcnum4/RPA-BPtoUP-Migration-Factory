
import { RawStage } from "../helpers/convertStage"
import { toArray } from "../helpers/toArray"
import { PageId, EndStage, OutputDef, normalizeBPDataType } from "../types/bp"
import { createBaseStage } from "./CreateBaseStage"

export const convertEndStage = (rawStage: RawStage, pageId: PageId): EndStage => {
    const endStage: EndStage = {
        ...createBaseStage(rawStage, pageId),
        type: "End",
        raw: rawStage,
        output: []
    }

    if ("outputs" in rawStage) {
        const outputDefs: OutputDef[] = []
        const outputs = toArray(rawStage.outputs.output)
        for (const output of outputs) {
            outputDefs.push ({
                name: output["@name"],
                dataType: normalizeBPDataType(output["@_type"]),
                description: output["@_narrative"] ?? "",
                valueFrom: output["@_stage"] ?? ""
            })
        }

        endStage.output = outputDefs;
    }

    return endStage
}