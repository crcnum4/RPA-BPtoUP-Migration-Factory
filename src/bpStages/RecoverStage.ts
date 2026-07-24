import { RawStage } from "../helpers/convertStage";
import { PageId, RecoverStage } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertRecoverStage = (rawStage: RawStage, pageId: PageId): RecoverStage => {
    const recoverStage: RecoverStage = {
        ...createBaseStage(rawStage, pageId),
        type: "Recover",
        overrideAttempts: null,
        raiseToParent: null,
        out: rawStage.onsuccess['#text']
    }

    //TODO: need flow with example of override and raise.

    return recoverStage
}