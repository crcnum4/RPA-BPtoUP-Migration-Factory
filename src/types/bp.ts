export type StageId = string;
export type PageId = string;

export const GLOBAL_SCOPE_ID = "global" as const;
export type DataScopeId = PageId | typeof GLOBAL_SCOPE_ID;

export const BP_DATA_TYPES = [
    "date",
    "datetime",
    "flag",
    "number",
    "password",
    "text",
    "time",
    "timespan",
    "image",
    "binary",
    "collection",
    "unknown"
] as const
export type BPDataType = (typeof BP_DATA_TYPES)[number]

export const isBPDataType = (value: unknown): value is BPDataType => {
    return typeof value === "string" && BP_DATA_TYPES.includes(value as BPDataType);
}

export const normalizeBPDataType = (value: unknown): BPDataType => {
    return isBPDataType(value) ? value : "unknown"
}

export const SINGLE_OUT_STAGE_TYPES = [
    "Process",
     "Action",
     "Calculation",
     "MultipleCalculation",
     "Loop",
     "Anchor",
     "Start",
     "Note",
     "Alert",
     "Recover",
     "Resume",
     "SubSheet",
     "ChoiceEnd",
] as const

export type SingleOutType = (typeof SINGLE_OUT_STAGE_TYPES)[number]

export const isSingleOutStage = (stage: BluePrismStage): stage is SingleOutStage => { 
    return SINGLE_OUT_STAGE_TYPES.includes(stage.type as SingleOutType)
}

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
    expression: string | null
    description?: string
}

export interface OutputProp {
    name: string,
    dataType: BPDataType,
    description?: string
    storeIn: string | null
}

export interface InputDef {
    name: string,
    description?: string,
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
    steps: CalculationStep[]
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
    overrideAttempts: number | null,
    raiseToParent: boolean | null
}

export interface ResumeStage extends SingleOutStage {type: "Resume"}

export interface SubSheetStage extends SingleOutStage {
    type: "SubSheet",
    inputs: InputProp[] | null,
    outputs: OutputProp[] | null,
    destination: PageId
}

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
    private: boolean
}

export interface CollectionField {
    label: string,
    dataType: BPDataType,
    defaultValue: unknown | null
}

export interface CollectionStage extends NoOutStage {
    type: "Collection"
    dataType: "collection",
    private: boolean,
    collection: Record<string, CollectionField> | null // null means no defined structure
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
    out: StageId | null
}

export const isDecisionStage = (stage: BluePrismStage): stage is DecisionStage => {
    return stage.type === "Decision"
}

export const isChoiceStage = (stage: BluePrismStage): stage is ChoiceStage => {
    return stage.type === "Choice"
}

export interface ChoiceStage extends BaseStage {
    type: "Choice",
    branches: ChoiceBranch[]
    defaultOut: StageId | null // uses groupId
    unresolvedGroupId: StageId
}

export interface ChoiceEndStage extends SingleOutStage {
    type: "ChoiceEnd"
    groupId: StageId
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
    | ChoiceEndStage
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
    | NoOutStage
    | SingleOutStage

export type SingleOutBluePrismStage = Extract<BluePrismStage, {out: StageId | null}>

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
    dataMap: Record<DataScopeId, Record<string, StageId>> //link the name to the stageID for reference
}

export interface StageLink {
    from: StageId,
    to: StageId | null,
    label?: string,
    condition?: string,
    pageId: PageId
}


