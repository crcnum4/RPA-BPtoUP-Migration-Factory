import { ChoiceEndStage, isChoiceStage, isSingleOutStage, ProcessGraph } from "../types/bp"

export const resolveChoiceDefaults = (process: ProcessGraph): void => {
    const choiceEndByGroupId: Record<string, ChoiceEndStage> = {};
    
    for (const stage of Object.values(process.stagesById)) {
        if(stage.type === "ChoiceEnd" && "groupId" in stage) {
            choiceEndByGroupId[stage.groupId] = stage
        }
    }

    for (const stage of Object.values(process.stagesById)) {
        if (!isChoiceStage(stage)) continue

        const choiceEnd = choiceEndByGroupId[stage.unresolvedGroupId]

        if (!choiceEnd) {
            // TODO: add parser warning that a choice has no defalut
            continue
        }

        stage.defaultOut = choiceEnd.id
        process.links.push({
            from: stage.id,
            to: choiceEnd.id,
            condition: "default",
            pageId: stage.pageId
        })
    }
}