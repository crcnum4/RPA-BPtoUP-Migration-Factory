import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { CalculationStep, MultiCalcStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertMultipleCalculations = (rawStage: RawStage, pageId: PageId): MultiCalcStage => {
    const multiCalcStage: MultiCalcStage = {
        ...createBaseStage(rawStage, pageId),
        type: 'MultipleCalculation',
        out: rawStage.onsuccess ? rawStage.onsuccess['#text'] : null,
        steps: []
    }

    if ("steps" in rawStage) {
        const steps = toArray(rawStage.steps.calculation)
        const calcSteps: CalculationStep[] = [];
        for (const step of steps) {
            calcSteps.push({
                expression: step['@_expression'],
                storeIn: step['@_stage']
            })
        }
        multiCalcStage.steps = calcSteps
    }

    return multiCalcStage
}