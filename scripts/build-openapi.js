const fs = require("fs")
const yaml = require("js-yaml")
const jp = require("jsonpath")

process.chdir(`${__dirname}/../reference/`)
const schema = yaml.load(fs.readFileSync(`openapi.yaml`))

const dereference = (object) => {
  if (object["$ref"]) {
    return yaml.load(fs.readFileSync(object["$ref"]))
  }
  return object
}

const MATCH = '../openapi.yaml'
const bundleReferences = (ref) => {
  if (ref.startsWith(MATCH)) {
    return ref.replace(MATCH, '')
  }
  return ref
}

const bundleMarkdown = (string) => {
  if (string["$ref"]) {
    return String(fs.readFileSync(string["$ref"]))
  }
  return string
}

// Dereference all paths
jp.apply(schema, '$.paths[*][*]', dereference)
// Dereference all parameters
jp.apply(schema, '$..parameters[*]', dereference)
// Dereference all components
jp.apply(schema, '$.components.schemas[*]', dereference)
// Import all markdown
jp.apply(schema, '$..description', bundleMarkdown)
// Flatten all local references
jp.apply(schema, '$..["$ref"]', bundleReferences)

if (!fs.existsSync('../build')) { fs.mkdirSync('../build') }
fs.writeFileSync('../build/openapi.v1.json', JSON.stringify(schema, null, 2))
