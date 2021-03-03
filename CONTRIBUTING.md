# Contributing

All contributions are welcome to this project. When contributing, please make
sure all linting and  tests pass before making a contribution.

## Deployment

When pushing to the `main` branch, GitHub actions will run the
linter and tests and will push the compiled OpenAPI spec to the `openapi-3.0` and
`swagger-2.0`, `docs`, and `sdk` branches respectively.

The pushing of these compiled branches will kick-off a rebuild of the developer
documentation site.
