import { RawStage } from "../helpers/convertStage";
import { ExceptionStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertExceptionStage = (rawStage: RawStage, pageId: PageId): ExceptionStage => {
    const exceptionStage: ExceptionStage = {
        ...createBaseStage(rawStage, pageId),
        type: 'Exception',
        exceptionType: rawStage.exception['@_type'],
        detail: rawStage.exception["@_detail"],
        preserve: "@_usecurrent" in rawStage.exception
    }

    return exceptionStage;
}