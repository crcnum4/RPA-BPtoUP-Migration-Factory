import { RawStage } from "../helpers/convertStage";
import { NoteStage, PageId } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const convertNoteStage = (rawStage: RawStage, pageId: PageId): NoteStage => {
    return {
        ...createBaseStage(rawStage, pageId),
        type: 'Note',
        text: rawStage.narrative ? rawStage.narrative['#text'] : null,
        out: rawStage.onsuccess ? rawStage.onsuccess['#text'] : null,
    }
}