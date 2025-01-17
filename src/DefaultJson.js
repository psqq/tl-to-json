import { Comment, Parser, Space, TlConstructor, TlMethod } from './Parser.js';

export class DefaultJson {
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

        let i = 0;

        while (i < entities.length) {
            const entity = entities[i];
            i++;
            if (entity instanceof Space) {
                continue;
            }
            if (entity instanceof Comment) {
                continue;
            }
            if (entity instanceof TlConstructor) {
                constructors.push(structuredClone(entity));
                continue;
            }
            if (entity instanceof TlMethod) {
                methods.push(structuredClone(entity));
                continue;
            }
        }

        constructors.sort((a, b) => a.predicate.localeCompare(b.predicate))
        methods.sort((a, b) => a.method.localeCompare(b.method))

        return {
            constructors,
            methods,
        };
    }
}
