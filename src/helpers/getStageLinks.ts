import { link } from "node:fs"
import { BluePrismStage, isChoiceStage, isDecisionStage, isSingleOutStage, StageLink } from "../types/bp"

export const getStageLinks = (stage: BluePrismStage): StageLink[] => {
    if (isSingleOutStage(stage)) {
        return stage.out 
            ? [
                {
                    from: stage.id,
                    to: stage.out,
                    pageId: stage.pageId
                }
            ]
            : []
    }

    if (isDecisionStage(stage)) {
        return [
            {
                from: stage.id,
                to: stage.trueOut,
                condition: `(${stage.expression}) is true`,
                pageId: stage.pageId
            },
            {
                from: stage.id,
                to: stage.falseOut,
                condition: `(${stage.expression}) is false`,
                pageId: stage.pageId
            }
        ]
    }

    if (isChoiceStage(stage)) {
        const links: StageLink[] = []
        for (const branch of stage.branches) {
            links.push({
                from: stage.id,
                to: branch.out,
                condition: branch.condition ?? '',
                pageId: stage.pageId
            })
        }
        return links
    }

    return []
}