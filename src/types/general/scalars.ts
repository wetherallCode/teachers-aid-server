import { scalarType, decorateType } from '@nexus/schema'
import { GraphQLJSON } from 'graphql-type-json'

export const DateScalar = scalarType({
  name: 'Date',
  serialize: (value) => value,
  parseValue: (value) => new Date(value).toLocaleDateString(),
  parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
  asNexusMethod: 'date',
  rootTyping: 'Date',
})
export const TimeScalar = scalarType({
  name: 'Time',
  serialize: (value) => value,
  parseValue: (value) => new Date(value).toLocaleTimeString(),
  parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
  asNexusMethod: 'time',
  rootTyping: 'Time',
})
export const DateTime = scalarType({
  name: 'DateTime',
  serialize: (value) => value,
  parseValue: (value) => new Date(value).toLocaleString(),
  parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
  asNexusMethod: 'dateTime',
  rootTyping: 'DateTime',
})
export const JSONScalar = decorateType(GraphQLJSON, {
  asNexusMethod: 'JSON',
  rootTyping: 'JSON',
})
// import { GraphQLDate } from 'graphql-iso-date'
// import { decorateType } from '@nexus/schema'

// export const GQLDate = decorateType(GraphQLDate, {
//   rootTyping: 'Date',
//   asNexusMethod: 'date',
// })
