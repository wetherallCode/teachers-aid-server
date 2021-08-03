"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONScalar = exports.DateTime = exports.TimeScalar = exports.DateScalar = void 0;
const schema_1 = require("@nexus/schema");
const graphql_type_json_1 = require("graphql-type-json");
exports.DateScalar = schema_1.scalarType({
    name: 'Date',
    serialize: (value) => value,
    parseValue: (value) => new Date(value).toLocaleDateString(),
    parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
    asNexusMethod: 'date',
    rootTyping: 'Date',
});
exports.TimeScalar = schema_1.scalarType({
    name: 'Time',
    serialize: (value) => value,
    parseValue: (value) => new Date(value).toLocaleTimeString(),
    parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
    asNexusMethod: 'time',
    rootTyping: 'Time',
});
exports.DateTime = schema_1.scalarType({
    name: 'DateTime',
    serialize: (value) => value,
    parseValue: (value) => new Date(value).toLocaleString(),
    parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
    asNexusMethod: 'dateTime',
    rootTyping: 'DateTime',
});
exports.JSONScalar = schema_1.decorateType(graphql_type_json_1.GraphQLJSON, {
    asNexusMethod: 'JSON',
    rootTyping: 'JSON',
});
//# sourceMappingURL=scalars.js.map