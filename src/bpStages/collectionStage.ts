import { RawStage } from "../helpers/convertStage"
import { CollectionStage, PageId } from "../types/bp"

export const convertCollectionStage = (rawStage: RawStage, pageId: PageId): CollectionStage => {

    const collectionStage: CollectionStage = {
        type: "Collection",
        id: rawStage["@_stageid"],
        pageId,
        name: rawStage["@_name"],
        description: rawStage.narrative ? rawStage.narrative["#text"] : "",
        x: parseInt(rawStage.display["@_x"]),
        y: parseInt(rawStage.display["@_y"]),
        collection: null,
        private: "private" in rawStage,
        dataType: "collection",
    }

    //TODO: create a collection with default structure in BP for reference to extract a default structure.

    return collectionStage;
}