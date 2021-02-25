module.exports = (original, _, __, inventory) => {
  if (!original['x-model-name']) {
    return [
      {
        message: 'A oneOf relation needs to have a x-model-name attribute to refer to the SDK model to use.',
      },
    ]
  }

  const spec = inventory.documentInventory.resolved
  const modelName = original['x-model-name']
  if (modelName && !spec.components.schemas[modelName]) {
    console.dir(modelName)
    return [
      {
        message: `x-model-name must refer to an actual model (${modelName})`,
      },
    ]
  }
}
