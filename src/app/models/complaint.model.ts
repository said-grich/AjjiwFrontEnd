// To parse this data:
//
//   import { Convert, Complaint } from "./file";
//
//   const complaint = Convert.toComplaint(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Complaint {
  id:               number;
  title:            string;
  user:             User;
  photoUri:         string;
  etatDeclarations: EtatDeclaration[];
  dateDecl:         number;
  content:          string;
  longitude:        number;
  latitude:         number;
  adresse:          string;
  etatD:            null;
  categ:            string;
}

export interface EtatDeclaration {
  id_etatD: number;
  etat:     Etat;
  dateEtat: number;
}

export interface Etat {
  id_et:   number;
  libelle: string;
}

export interface User {
  id:        number;
  isAdmin:   boolean;
  email:     string;
  active:    boolean;
  password:  string;
  nom:       string;
  prenom:    string;
  role:      string;
  cin:       string;
  telephone: string;
  imm:       null;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toComplaint(json: string): Complaint {
    return cast(JSON.parse(json), r("Complaint"));
  }

  public static complaintToJson(value: Complaint): string {
    return JSON.stringify(uncast(value, r("Complaint")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "Complaint": o([
    { json: "id", js: "id", typ: 0 },
    { json: "title", js: "title", typ: "" },
    { json: "user", js: "user", typ: r("User") },
    { json: "photoUri", js: "photoUri", typ: "" },
    { json: "etatDeclarations", js: "etatDeclarations", typ: a(r("EtatDeclaration")) },
    { json: "dateDecl", js: "dateDecl", typ: 0 },
    { json: "content", js: "content", typ: "" },
    { json: "longitude", js: "longitude", typ: 0 },
    { json: "latitude", js: "latitude", typ: 0 },
    { json: "adresse", js: "adresse", typ: "" },
    { json: "etatD", js: "etatD", typ: null },
    { json: "categ", js: "categ", typ: "" },
  ], false),
  "EtatDeclaration": o([
    { json: "id_etatD", js: "id_etatD", typ: 0 },
    { json: "etat", js: "etat", typ: r("Etat") },
    { json: "dateEtat", js: "dateEtat", typ: 0 },
  ], false),
  "Etat": o([
    { json: "id_et", js: "id_et", typ: 0 },
    { json: "libelle", js: "libelle", typ: "" },
  ], false),
  "User": o([
    { json: "id", js: "id", typ: 0 },
    { json: "isAdmin", js: "isAdmin", typ: true },
    { json: "email", js: "email", typ: "" },
    { json: "active", js: "active", typ: true },
    { json: "password", js: "password", typ: "" },
    { json: "nom", js: "nom", typ: "" },
    { json: "prenom", js: "prenom", typ: "" },
    { json: "role", js: "role", typ: "" },
    { json: "cin", js: "cin", typ: "" },
    { json: "telephone", js: "telephone", typ: "" },
    { json: "imm", js: "imm", typ: null },
  ], false),
};
