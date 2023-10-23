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
