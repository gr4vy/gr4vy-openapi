const fs = require("fs")
const yaml = require("js-yaml")

process.chdir(`${__dirname}/../reference/`)

// filter all internal endpoints
const filterEndpoints = (endpoints) => {
  Object.entries(endpoints).forEach(([verb, endpoint]) => {
    if (!endpoint?.['$ref']) { return }
    const spec = yaml.load(fs.readFileSync(endpoint['$ref']))
    if (spec['x-internal']) {
      delete endpoints[verb]
    }
  })

  if (!Object.keys(endpoints).find(verb => ['get', 'post', 'put', 'patch', 'delete', 'options'].includes(verb))) {
    return null
  }

  return endpoints
}

// filter all internal paths
const filterTag = tag => tag['x-internal'] !== true

const schema = yaml.load(fs.readFileSync(`openapi.yaml`))
schema.tags = schema.tags.filter(filterTag)

Object.entries(schema.paths).forEach(([path, endpoints]) => {
  const newEndpoints = filterEndpoints(endpoints)
  if (!newEndpoints) { delete schema.paths[path] }
  else { schema.paths[path] = newEndpoints }
})

Object.entries(schema.components.schemas).forEach(([name, component]) => {
  if (!component?.['$ref']) { return }
  const spec = yaml.load(fs.readFileSync(component['$ref']))
  if (spec['x-internal']) {
    delete schema.components.schemas[name]
  }
})

fs.writeFileSync('openapi-public.yaml', yaml.dump(schema, null, 2))
