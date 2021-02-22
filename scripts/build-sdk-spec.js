const fs = require("fs")
const jp = require("jsonpath")

const OPENAPI = './public/openapi.v1.json'

const spec = JSON.parse(fs.readFileSync(OPENAPI))

const merge = (schema) => ({
  '$ref': `#/components/schemas/${schema['x-model-name']}`
})

const removeUriFormat = (schema) => {
  delete schema['format']
  return schema
}

jp.apply(spec, '$..*[?(@.oneOf)]', merge)
jp.apply(spec, '$..*[?(@.format=="uri")]', removeUriFormat)

fs.writeFileSync('./sdks/openapi.v1.json', JSON.stringify(spec, null, 2))
