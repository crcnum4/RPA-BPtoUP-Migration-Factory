import {readFile} from "node:fs/promises";
import {XMLParser} from 'fast-xml-parser'
import { ProcessGraph, SubSheetInfoStage } from "./types/bp";
import { extractPages } from "./bpStages/extractPages";
import { toArray } from "./helpers/toArray";
import { ensurePage } from "./helpers/ensurePage";
import { convertStage } from "./helpers/convertStage";

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
    }
    // console.log(parsedData.process.stage[0])

    output(process);

    console.log(process.stagesById["1b83267d-0ca1-46b5-8a0f-74d8cd039c0c"]);

}

const output = (process: ProcessGraph) => {
    console.log(`Parsed Process: ${process.processName}`)
    console.log(`Pages discoverd: ${Object.keys(process.pagesById).length - 1}`)
    console.log(`Stages discoverd: ${Object.keys(process.stagesById).length}`)
    console.log("Page to stage breakdown:")
    console.table(
        Object.values(process.pagesById).map(page => ({
            id: page.id,
            name: page.name,
            stages: page.stageIds.length,
        }))
    )
}

main()
