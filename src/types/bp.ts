export type StageId = string;
export type PageId = string;

export const BP_DATA_TYPES = [
    "Date",
    "DateTime",
    "Flag",
    "Number",
    "Password",
    "Text",
    "Time",
    "TimeSpan",
    "Image",
    "Binary",
    "Collection",
    "Unknown"
] as const
export type BPDataType = typeof BP_DATA_TYPES[number]

export const isBPDataType = (value: unknown): value is BPDataType => {
    return typeof value === "string" && BP_DATA_TYPES.includes(value as BPDataType);
}

export const normalizeBPDataType = (value: unknown): BPDataType => {
    return isBPDataType(value) ? value : "Unknown"
}

export type SingleOutType = 
    | "Process"
    | "Action"
    | "Calculation"
    | "MultipleCalculation"
    | "Loop"
    | "Anchor"
    | "Start"
    | "Note"
    | "Alert"
    | "Recover"
    | "Resume"

export type NoOutType = 
    | "Block"
    | "Data"
    | "Collection"
    | "End"
    | "Exception"
    | "Unknown"
    | "SubSheetInfo"
    | "ProcessInfo"
    | ""

export type StageType = //Collection of all stagetypes
    | "SubSheet"
    | "Decision"
    | "Choice"
    | SingleOutType
    | NoOutType

export interface BaseStage {
    id: StageId,
    pageId: PageId,
    type: StageType,
    name: string,
    description: string,
    x: number;
    y: number;
    raw?: unknown;
}

export interface SingleOutStage extends BaseStage {
    type: SingleOutType,
    out: StageId | null
}

export interface InputProp {
    name: string,
    dataType: BPDataType,
    valuefrom: string | null
}

export interface OutputProp {
    name: string,
    dataType: BPDataType,
    storeIn: string | null
}

export interface InputDef {
    name: string,
    description: string,
    dataType: BPDataType,
    storeIn: string | null
}

export interface OutputDef {
    name: string,
    description: string,
    dataType: BPDataType,
    valueFrom: string | null
}

export interface StartStage extends SingleOutStage {
    type: "Start",
    inputDefinitions: InputDef[]
}

export interface ProcessStage extends SingleOutStage {
    type: "Process"
    processName: string,
    processPath: string,
    input: InputProp[]
    output: OutputProp[]
}

export interface ActionStage extends SingleOutStage {
    type: "Action",
    resourceObject: string,
    action: string,
    input: InputProp[],
    output: OutputProp[], 
}

export interface CalculationStep {
    expression: string,
    storeIn: string | null
}

export interface CalculationStage extends SingleOutStage, CalculationStep {
    type: "Calculation"
}

export interface MultiCalcStage extends SingleOutStage {
    type: "MultipleCalculation"
    steps: CalculationStage[]
}

// need more research on loop stages. Not used as much as creating a loop through links and descisions
// export interface Loopstart extends SingleOutStage{}
// export interface LoopEnd extends SingleOutStage{}

export interface AnchorStage extends SingleOutStage {type: "Anchor"}

export interface NoteStage extends SingleOutStage {
    type: "Note",
    text: string
}

export interface AlertStage extends SingleOutStage {
    type: "Alert",
    expression: "string"
}

export interface RecoverStage extends SingleOutStage {
    type: "Recover",
    overrideAttempts: number,
    raiseToParent: boolean
}

export interface ResumeStage extends SingleOutStage {type: "Resume"}

export interface NoOutStage extends BaseStage {
    type: NoOutType,
}

export interface BlockStage extends NoOutStage {
    type: "Block",
    width: number,
    height: number,
    containsStageIds?: StageId[]
}

export interface DataStage extends NoOutStage {
    type: "Data"
    dataType: BPDataType,
    defaultValue: unknown | null,
}

export interface CollectionField {
    label: string,
    dataType: BPDataType,
    defaultValue: unknown | null
}

export interface CollectionStage extends NoOutStage {
    type: "Collection"
    collection: Record<string, CollectionField>
}

export interface EndStage extends NoOutStage {
    type: "End"
    output: OutputDef[]
}

export interface ExceptionStage extends NoOutStage {
    type: "Exception",
    exceptionType: string | null,
    detail: string | null,
    preserve: boolean, //if true exception details of this stage are blank as its inside a recover and is passing on from below.
}

export interface DecisionStage extends BaseStage {
    type: "Decision",
    expression: string,
    trueOut: StageId | null
    falseOut: StageId | null
}

export interface ChoiceBranch {
    label: string,
    condition?: string,
    out: StageId
}

export interface ChoiceStage extends BaseStage {
    type: "Choice",
    branches: ChoiceBranch[]
    defaultOut: StageId
}

export interface SubSheetInfoStage extends NoOutStage {
    type: "SubSheetInfo",
    preconditions?: string,
    postconditions?: string,
}

export interface UnknownStage extends NoOutStage {
    type: "Unknown",
    raw: unknown
}

export type BluePrismStage = 
    | DecisionStage
    | ChoiceStage
    | StartStage
    | ProcessStage
    | ActionStage
    | CalculationStage
    | MultiCalcStage
    | AnchorStage
    | NoteStage
    | AlertStage
    | ExceptionStage
    | RecoverStage
    | ResumeStage
    | BlockStage
    | DataStage
    | CollectionStage
    | EndStage
    | UnknownStage

export interface ProcessPage {
    id: PageId,
    name: string,
    stageIds: StageId[],
    published?: boolean,
    preconditions?: string,
    postconditions?: string,
}

export interface ProcessGraph {
    processName: string,
    description: string,
    preconditions?: string,
    postconditions?: string,
    pagesById: Record<PageId, ProcessPage>,
    stagesById: Record<StageId, BluePrismStage>,
    links: StageLink[]
    dataMap: Record<string, StageId> //link the name to the stageID for reference
}

export interface StageLink {
    from: StageId,
    to: StageId,
    label?: string,
    condition?: string,
    pageId: PageId
}


