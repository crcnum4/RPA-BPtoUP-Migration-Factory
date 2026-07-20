import { toArray } from "../helpers/toArray";
import { PageId, ProcessPage } from "../types/bp";

export const extractPages = (value: any): Record<PageId, ProcessPage> => {
    const processPages: Record<PageId, ProcessPage> = {};

    const subsheets = toArray(value);

    for (const subsheet of subsheets) {
        const processPage: ProcessPage = {
            id: subsheet["@_subsheetid"],
            name: subsheet.name["#text"],
            stageIds: [],
            published: subsheet["@_published"] === "True"
        }

        processPages[processPage.id] = processPage;
    }

    return processPages
}