import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { ChoiceBranch, ChoiceStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertChoiceStage = (rawStage: RawStage, pageId: PageId): ChoiceStage => {
    const choiceStage: ChoiceStage = {
        ...createBaseStage(rawStage, pageId),
        type: "Choice",
        branches: [],
        defaultOut: null, //map later with groupId
        unresolvedGroupId: rawStage.groupid['#text']
    }

    if ("choices" in rawStage) {
        const choices = toArray(rawStage.choices.choice)
        const choiceBranches: ChoiceBranch[] = [];
        for (const choice of choices) {
            choiceBranches.push({
                label: choice.name ? choice.name['#text'] : "",
                condition: choice['@_expression'],
                out: choice.ontrue ? choice.ontrue['#text'] : null,
            })
        }

        choiceStage.branches = choiceBranches
    }

    return choiceStage
}