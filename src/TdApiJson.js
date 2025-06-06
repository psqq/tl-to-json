//@ts-check
import { Comment, Parser, Space, TlConstructor, TlMethod } from './Parser.js';

export class TdApiJson {
    /**
     * @param {string} raw
     */
    constructor(raw) {
        this.parser = new Parser(raw);
    }

    makeJson() {
        this.parser.parse();

        const entities = this.parser.entities;

        const constructors = [];
        const methods = [];
        const classes = [];

        /** @type {any} */
        let comments = {};
        let lastCommentKey = '';
        let i = 0;

        while (i < entities.length) {
            const entity = entities[i];
            if (entity instanceof Space) {
                if (comments.class) {
                    if (Object.keys(comments).length > 2) {
                        console.warn(comments);
                    }
                    classes.push(comments);
                }
                comments = {};
            } else if (entity instanceof Comment) {
                let s = entity.value;
                if (s[0] === '-') {
                    comments[lastCommentKey] += ' ' + s.substring(1);
                } else {
                    while (true) {
                        let m = s.match(/^@(\w+)/);
                        if (!m) {
                            break;
                        }
                        let description = s.substring(m[0].length).trim();
                        let indexOfInnerDescription = description.indexOf('@');
                        if (indexOfInnerDescription > 0) {
                            s = description.substring(indexOfInnerDescription).trim();
                            description = description.substring(0, indexOfInnerDescription).trim();
                        } else {
                            s = '';
                        }
                        lastCommentKey = m[1];
                        comments[m[1]] = description;
                    }
                }
            } else if (entity instanceof TlConstructor) {
                const jsonConstructor = {
                    ...entity,
                    params: entity.params.map((param) => ({
                        ...param,
                        description: '',
                    })),
                    description: '',
                };
                if (comments.description) {
                    jsonConstructor.description = comments.description;
                }
                for (const param of jsonConstructor.params) {
                    if (comments[param.name]) {
                        param.description = comments[param.name];
                    }
                }
                constructors.push(jsonConstructor);
            } else if (entity instanceof TlMethod) {
                const jsonMethod = {
                    ...entity,
                    params: entity.params.map((param) => ({
                        ...param,
                        description: '',
                    })),
                    description: '',
                };
                if (comments.description) {
                    jsonMethod.description = comments.description;
                }
                for (const param of jsonMethod.params) {
                    if (comments[param.name]) {
                        param.description = comments[param.name];
                    }
                }
                methods.push(jsonMethod);
            }
            i++;
        }

        return {
            classes,
            constructors,
            methods,
        };
    }
}
