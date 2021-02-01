module.exports = targetVal => {
  if (!targetVal.trim().endsWith('.')) {
    return [
      {
        message: 'Value must end in full-stop.',
      },
    ]
  }
}
