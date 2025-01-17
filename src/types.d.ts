import { Comment, Space, TlConstructor, TlMethod } from "./Parser";

export type Entity = Space | Comment | TlConstructor | TlMethod;

interface Parameter {
    name: string;
    type: string;
}
