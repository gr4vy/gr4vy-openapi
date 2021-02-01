module.exports = targetVal => {
  if (!targetVal.startsWith('Returns') && !targetVal.startsWith('Redirect')) {
    return [
      {
        message: 'Response description must start with `Returns`.',
      },
    ]
  }
}
