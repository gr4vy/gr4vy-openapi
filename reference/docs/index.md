Welcome to the Gr4vy developer documentation. Our API is still very much a work
in product and subject to change.

# Authentication

The Gr4vy API uses a JWT bearer token for authentication, passed into the
`authorization`-header as follows.

```sh
curl -i -X GET "https://{cluster}/transactions" \
     -H "authorization: bearer [JWT]"
```
<!-- ReDoc-Inject: <security-definitions> -->
