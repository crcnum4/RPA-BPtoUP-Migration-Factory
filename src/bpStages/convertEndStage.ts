
import { RawStage } from "../helpers/convertStage"
import { toArray } from "../helpers/toArray"
import { PageId, EndStage, OutputDef, normalizeBPDataType } from "../types/bp"

export const convertEndStage = (rawStage: RawStage, pageId: PageId): EndStage => {
    const endStage: EndStage = {
        type: "End",
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"],
        description: rawStage.narrative ? rawStage.narrative["#text"] : "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
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