import { BluePrismStage, isSingleOutStage, StageLink } from "../types/bp"

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

    return []
}