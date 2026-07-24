import {readFile} from "node:fs/promises";
import {XMLParser} from 'fast-xml-parser'
import { GLOBAL_SCOPE_ID, isSingleOutStage, ProcessGraph, SubSheetInfoStage } from "./types/bp";
import { extractPages } from "./bpStages/extractPages";
import { toArray } from "./helpers/toArray";
import { ensurePage } from "./helpers/ensurePage";
import { convertStage } from "./helpers/convertStage";
import { getStageLinks } from "./helpers/getStageLinks";
import { addDataStageToMap } from "./helpers/addDataStageToMap";
import { resolveChoiceDefaults } from "./helpers/resolveChoiceDefaults";

export const BP_MAIN_PAGE = "main"
export const ORPHANED_PAGE_ID = "orphaned"

export const readBluePrismFile = async (filePath: string): Promise<string> => {
    return readFile(filePath, "utf-8")
} 

const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    alwaysCreateTextNode: true,
})


const main = async (): Promise<void> => {
    const xml = await readBluePrismFile("./src/test/testFile.bpprocess");
    // const xml = await readBluePrismFile("./src/test/templateTestFile.bpprocess");
    const parsedData = parser.parse(xml);
    // console.log(parsedData.process.subsheet)

    if (!("process" in parsedData)) {
        console.error("Invalid format")
        throw new Error("Invalid XML Format no process tag")
    }

    const process: ProcessGraph = {
        processName: parsedData.process["@_name"],
        description: parsedData.process["@_narrative"] ?? "missing",
        preconditions: parsedData.process.preconditions["#text"] ?? undefined,
        postconditions: parsedData.process.endpoint['@_narrative'] ?? undefined,
        pagesById: {
            [BP_MAIN_PAGE]: {
                id: BP_MAIN_PAGE,
                name: "Main",
                stageIds: [],
                preconditions: parsedData.process.preconditions["#text"] ?? undefined,
                postconditions: parsedData.process.endpoint['@_narrative'] ?? undefined,
            },
            [ORPHANED_PAGE_ID]: {
                id: ORPHANED_PAGE_ID,
                name: "Orphaned / Unknown Page",
                stageIds: [],
            }
        },
        stagesById: {},
        links: [],
        dataMap: {},
    } 

    if ("subsheet" in parsedData.process) {
        // more then just main pag
        process.pagesById = {...process.pagesById, ...extractPages(parsedData.process.subsheet)};
    }

    const stages = toArray(parsedData.process.stage)

    for (const rawStage of stages) {
        const page = ensurePage(process.pagesById, rawStage)

        page.stageIds.push(rawStage["@_stageid"])

        const stage = convertStage(rawStage, page.id)
        process.stagesById[stage.id] = stage

        if (stage.type === "SubSheetInfo") {
            const convertedStage = stage as SubSheetInfoStage
            if (convertedStage.postconditions)
                page.postconditions = convertedStage.postconditions
            if (convertedStage.preconditions)
                page.preconditions = convertedStage.preconditions
        }

        process.links.push(...getStageLinks(stage))

        /**
         * 
         * several stages have to be linked after all stages are processed as they may be processed out of order
         * or for other reasons
         * 
         * must have for direct links:
         * for each subsheet stage we need to find the endstage ID of that subsheet and create a link to the out of the subsheet
         * 
         * musthave for expanded:
         * for choice we need to match up the ChoiceStartStage defaultOut to the matching ChoiceEndStage based on groupid
         * for an anchor find links that point to it and then point it to the anchor's out collapsing the anchors.
         */

        if ((stage.type === "Data" || stage.type === "Collection") && ("private" in stage)) {
            addDataStageToMap(process, stage) 
        }
    }
    // console.log(parsedData.process.stage[0])
    resolveChoiceDefaults(process)

    output(process);

    console.log("debugging:")
    // console.log(process.stagesById);

}

const output = (process: ProcessGraph) => {
    console.log(`Parsed Process: ${process.processName}`)
    console.log(`Pages discoverd: ${Object.keys(process.pagesById).length - 1}`)
    console.log("\t- not including 1 synthetic safety page")
    console.log(`Stages discoverd: ${Object.keys(process.stagesById).length}`)
    console.log(`Links discovered: ${process.links.length}`)
    console.log(`Data items discovered: ${Object.values(process.dataMap).flatMap(scope => Object.values(scope)).length}`)
    console.log(`\t- includes ${Object.keys(process.dataMap[GLOBAL_SCOPE_ID] ?? {}).length} global data items`)
    console.log("")
    console.log("Page breakdown:")
    console.table(
        Object.values(process.pagesById).map(page => ({
            id: page.id,
            name: page.name,
            stages: page.stageIds.length,
            links: process.links.filter((l) => l.pageId === page.id).length,
            dataItems: Object.keys(process.dataMap[page.id] ?? {}).length
        }))
    )
    console.log("-------")
    console.log('')
}

main()
