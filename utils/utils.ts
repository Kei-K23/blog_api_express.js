export function omit(obj1: Record<string, any> | null, ary: Array<string>) {
  if (typeof obj1 !== "object" || obj1 === null || Array.isArray(obj1))
    throw new Error("omit subject must be object");

  if (!Array.isArray(ary) || ary.length <= 0) throw new Error("invalid array");

  let newObj: Record<string, any> = {};

  for (let key in obj1) {
    if (!ary.includes(key)) {
      newObj[key] = obj1[key];
    }
  }
  return newObj;
}

export function isEmpty(obj: Record<string, any> | Array<any>) {
  // if (typeof obj !== "object" || !Array.isArray(obj) || obj === null)
  //   throw new Error("subject must be object or array");

  if (typeof obj === "object") {
    if (Object.keys(obj).length <= 0) {
      return true;
    } else {
      return false;
    }
  }
  if (Array.isArray(obj)) {
    if (Array(obj).length <= 0) {
      return true;
    } else {
      return false;
    }
  }
}
