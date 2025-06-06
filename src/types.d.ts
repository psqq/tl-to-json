import { Comment, Space, TlConstructor, TlMethod } from "./Parser.js";

export type Entity = Space | Comment | TlConstructor | TlMethod;

interface Parameter {
    name: string;
    type: string;
}
