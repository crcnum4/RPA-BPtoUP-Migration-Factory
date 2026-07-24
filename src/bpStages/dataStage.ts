
import { RawStage } from "../helpers/convertStage";
import { toArray } from "../helpers/toArray";
import { InputDef, normalizeBPDataType, PageId, DataStage } from "../types/bp";
import { createBaseStage } from "./CreateBaseStage";

export const extractInitialValue = (rawStage: RawStage) => {

  if (rawStage.datatype["#text"] === "password") {
    return rawStage.initialvalueenc["#text"] !== "" 
      ? rawStage.initialvalueenc["#text"] // if not blank keep
      : null //initialvalueenc does not use any identifier for empty strings so if empty assume null
  }

  return rawStage.initialvalue["#text"] !== "" 
          ? rawStage.initialvalue["#text"] // if not blank keep
          // : "@_xml:space" in rawStage.initialvalue ? "" : null, //if blank check is @_xml:space exists if so the empty string is intentional
          : null // TODO: see if datatypes other then string use @_xml:space for empty strings. for now assume null and give each datatype a default later in validation.
  }

export const converDataStage = (rawStage: RawStage, pageId: PageId): DataStage => {

    const dataStage: DataStage = {
        ...createBaseStage(rawStage, pageId),
        type: "Data",
        dataType: normalizeBPDataType(rawStage.datatype["#text"]),
        defaultValue: extractInitialValue(rawStage),
        private: "private" in rawStage
    }

    return dataStage;
  }