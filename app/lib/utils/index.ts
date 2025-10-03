import { v4 as uuid, validate, NIL as nilUUID } from "uuid";
import slugify from "slugify";

export const createUUID = () => uuid();

export const nullUUID = () => nilUUID;

export const validateUUID = (uuidVal: string) => {
  return validate(uuidVal);
};

export const generateSlug = (text: string) => {
  return slugify(text.toLowerCase(), { remove: /[*+~.(),#&=$/'"!:@]/g });
};
