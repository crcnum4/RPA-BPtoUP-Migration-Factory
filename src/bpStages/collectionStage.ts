import { RawStage } from "../helpers/convertStage"
import { CollectionStage, PageId } from "../types/bp"
import { createBaseStage } from "./CreateBaseStage";

export const convertCollectionStage = (rawStage: RawStage, pageId: PageId): CollectionStage => {

    const collectionStage: CollectionStage = {
        ...createBaseStage(rawStage, pageId),
        type: "Collection",
        collection: null,
        private: "private" in rawStage,
        dataType: "collection",
    }

    //TODO: create a collection with default structure in BP for reference to extract a default structure.

    return collectionStage;
}