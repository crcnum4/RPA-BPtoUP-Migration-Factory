import { RawStage } from "../helpers/convertStage";
import { DecisionStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertDecisionStage = (rawStage: RawStage, pageId: PageId): DecisionStage => {
    const decisionStage: DecisionStage = {
        ...createBaseStage(rawStage, pageId),
        type: 'Decision',
        expression: rawStage.decision["@_expression"] ?? "",
        trueOut: rawStage.ontrue['#text'],
        falseOut: rawStage.onfalse['#text'],
    }

    return decisionStage;
}