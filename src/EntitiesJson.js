import { Comment, Parser, Space, TlConstructor, TlMethod } from './Parser.js';

export class EntitiesJson {
    /**
     * @param {string} raw
     */
    constructor(raw) {
        this.parser = new Parser(raw);
    }

    makeJson() {
        this.parser.parse();

        return {
            entities: this.parser.entities.map((entity) => {
                if (entity instanceof Comment) {
                    return {
                        entity_type: 'comment',
                        ...entity,
                    };
                }
                if (entity instanceof Space) {
                    return {
                        entity_type: 'space',
                        ...entity,
                    };
                }
                if (entity instanceof TlConstructor) {
                    return {
                        entity_type: 'constructor',
                        ...entity,
                    };
                }
                if (entity instanceof TlMethod) {
                    return {
                        entity_type: 'method',
                        ...entity,
                    };
                }
            }),
        };
    }
}
