import { RawStage } from "../helpers/convertStage";
import { CalculationStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertCalculationStage = (rawStage: RawStage, pageId: PageId): CalculationStage => {
    const calculationStage: CalculationStage = {
        ...createBaseStage(rawStage, pageId),
        type: "Calculation",
        out: rawStage.onsuccess['#text'],
        expression: rawStage.calculation["@_expression"],
        storeIn: rawStage.calculation["@_stage"]
    }

    return calculationStage
}
