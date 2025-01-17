export class Space {
    constructor() {
        this.eolCount = 0;
    }
}

export class TlConstructor {
    constructor() {
        this.id = 0;
        this.predicate = '';
        /** @type {import("./types.js").Parameter[]} */
        this.params = [];
        this.type = '';
    }
}

export class TlMethod {
    constructor() {
        this.id = 0;
        this.method = '';
        /** @type {import("./types.js").Parameter[]} */
        this.params = [];
        this.type = '';
    }
}

export class Comment {
    constructor() {
        this.value = '';
    }
}

export class Parser {
    /**
     * @param {string} raw
     */
    constructor(raw) {
        this.lines = raw.toString().split('\n');

        this.mode = 'constructors';

        /** @type {import("./types.js").Entity[]} */
        this.entities = [];

        this.currentSpaceEntity = null;
    }

    parse() {
        const { lines } = this;

        lines.forEach((line) => {
            line = line.replace(';', '').trim();

            if (line === '') {
                if (!this.currentSpaceEntity) {
                    this.currentSpaceEntity = new Space();
                }
                this.currentSpaceEntity.eolCount++;

                return;
            }

            if (this.currentSpaceEntity) {
                this.entities.push(this.currentSpaceEntity);
                this.currentSpaceEntity = null;
            }

            if (line.startsWith('//')) {
                const comment = new Comment();
                comment.value = line.substring(2).trim();
                this.entities.push(comment);

                return;
            }

            const entity = this.parseLine(line);
            if (!entity) {
                return;
            }

            this.entities.push(entity);
        });
    }

    /**
     * @param {string} line 
     * @returns 
     */
    parseLine(line) {
        if (line === '---types---') {
            this.mode = 'constructors';

            return;
        }
        if (line === '---functions---') {
            this.mode = 'methods';

            return;
        }

        if (this.mode === 'constructors') {
            return this.parseConstructor(line);
        }

        if (this.mode === 'methods') {
            return this.parseMethod(line);
        }

        throw Error(`Mode ${this.mode} is not support`);
    }

    /**
     * @param {string} line
     */
    parseConstructor(line) {
        const splittedLine = line.split('=');

        const body = splittedLine[0].trim();
        const type = splittedLine[1].trim();

        const [predicateWithId, ...paramsAsArray] = body.split(' ');

        const [predicate, idAsString] = predicateWithId.split('#');
        const id = parseInt(idAsString, 16);

        const isVector = predicate === 'vector';

        const params = isVector
            ? []
            : paramsAsArray.map((param) => {
                  const [paramName, paramType] = param.split(':');

                  return {
                      name: paramName,
                      type: paramType || '',
                  };
              });

        const tlConstructor = new TlConstructor();
        tlConstructor.id = id;
        tlConstructor.predicate = predicate;
        tlConstructor.params = params;
        tlConstructor.type = type;

        return tlConstructor;
    }

    /**
     * @param {string} line
     */
    parseMethod(line) {
        const splittedLine = line.split('=');

        const body = splittedLine[0].trim();
        const type = splittedLine[1].trim();

        const [predicateWithId, ...paramsAsArray] = body.split(' ');

        const [method, idAsString] = predicateWithId.split('#');
        const id = parseInt(idAsString, 16);

        const params = paramsAsArray
            .filter((param) => {
                if (param[0] === '{' && param[param.length - 1] === '}') {
                    return false;
                }

                return true;
            })
            .map((param) => {
                const [paramName, paramType] = param.split(':');

                return {
                    name: paramName,
                    type: paramType,
                };
            });

        const tlMethod = new TlMethod();
        tlMethod.id = id;
        tlMethod.method = method;
        tlMethod.params = params;
        tlMethod.type = type;

        return tlMethod;
    }
}
