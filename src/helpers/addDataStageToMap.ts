import { CollectionStage, DataScopeId, DataStage, GLOBAL_SCOPE_ID, ProcessGraph } from "../types/bp";


export const addDataStageToMap = (process: ProcessGraph, stage: DataStage | CollectionStage): void => {
    const scopeId = stage.private ? stage.pageId : GLOBAL_SCOPE_ID

    process.dataMap[scopeId] ??= {}
    process.dataMap[scopeId][stage.name] = stage.id
}