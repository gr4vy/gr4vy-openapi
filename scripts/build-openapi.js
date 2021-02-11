const fs = require("fs")
const yaml = require("js-yaml")
const jp = require("jsonpath")

const source = process.argv[2] ?? 'reference'
const destination = process.argv[3] ?? 'reference'

process.chdir(`${__dirname}/../${source}`)
const schema = yaml.load(fs.readFileSync(`openapi.yaml`))

const OPENAPI = '../openapi.yaml'

const dereference = (object) => {
  if (object["$ref"] && !object["$ref"].startsWith(OPENAPI)) {
    const ref = object['$ref'].replace('../', './')
    return yaml.load(fs.readFileSync(ref))
  }
  return object
}

const bundleReferences = (ref) => {
  if (ref.startsWith(OPENAPI)) {
    return ref.replace(OPENAPI, '')
  }
  return ref
}

// Dereference all paths
jp.apply(schema, '$..paths[*][*]', dereference)
// Dereference all components
jp.apply(schema, '$.components.schemas[*]', dereference)
// Dereference all parameters
jp.apply(schema, '$..parameters[*]', dereference)
// Dereference all properties
jp.apply(schema, '$..properties[*]', dereference)
// Flatten all local references
jp.apply(schema, '$..["$ref"]', bundleReferences)

if (!fs.existsSync(`../${destination}`)) { fs.mkdirSync(`../${destination}`) }
fs.writeFileSync(`../${destination}/openapi.v1.json`, JSON.stringify(schema, null, 2))
