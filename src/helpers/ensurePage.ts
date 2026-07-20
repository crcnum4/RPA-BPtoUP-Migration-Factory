import { BP_MAIN_PAGE, ORPHANED_PAGE_ID } from ".."
import { PageId, ProcessPage } from "../types/bp"

export const ensurePage = (
    pagesById: Record<PageId, ProcessPage>,
    rawStage: any
): ProcessPage => {
    let page: ProcessPage | undefined
    if (!("subsheetid" in rawStage)) {
        page = pagesById[BP_MAIN_PAGE]
        if (!page) {
            console.error("Main page not initialized?")
        }
    } else {
        page = pagesById[rawStage.subsheetid["#text"]]

        if (!page) {
            page = pagesById[ORPHANED_PAGE_ID]
            if (!page) {
                console.error("No orphaned page initialized")
            }
        }
    }

    if (!page) {
        throw Error("No page assigned! either main or orphan was not created.")
    }

    return page
} 