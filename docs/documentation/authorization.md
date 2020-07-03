---
tags: [Documentation]
---

# Authorization

Authorization of the Gr4vy API is handled through a signed JWT passed as a  bearer token.

```curl
curl -X GET https://{cluster}/transactions/authorization \
     -H "Authorization: Bearer [JWT_TOKEN]         
```

## JWT Tokens

Gr4vy authentication is handled through JWT tokens. These tokens are signed using a private key registered by the API, and verified by Gr4vy using the public API.

### Registered claim

A JWT can contain the following registered claims. All are optional and we need to decide which to use.

| Claim name | Short name | Description | Example |
| -- | -- | --| -- |
| `iss` | Issuer | We could use this to differentiate between a merchant generated JWT and a Gr4vy generated one? |  `merchant` or `gr4vy` |
| `sub` | Subject | We could use this to specify the merchant ID. Not sure if we need this. Could be useful if a merchant wants to deploy 1 gravy cluser for different shops. | `12345` |
| `aud` | Audience | Indentifies the intended audience. Can be used to basically sign a JWT with someone elses public key. We don't need this | |
| `exp` | Expirattion date | We should set this to a sensible default. Especially in a client-side situation this will be important. |  `1544645174` |
| `nbf` | Not before | Allows a token only to be used after a certain date. Useful in client-side where we expect a user to take at least a few seconds to fill in a form. Not sure we need it though. | `1544645174` |
| `iat` | Issued at | Specifies when the token was issued at. Recommended and doesn't cost much to add. | `1544645174` |
| `jti` | JWT ID | A random token that is used to add more entropy to the signed JWT, and preventing replay attacks when validated. | `1FE269211...` |

### Server-side JWT

A server-side JWT would look something like this, based on the list above.

```json
{
  "iss": "merchant",
  "sub": "123456789",
  "exp": 1544645174, // set to 1 hour?
  "iat": 1544585174, 
  "jti": "1FE269211..."
}
```

### Client-side JWT

To facilitate client-side authentication, a JWT token needs to be scoped down so it can not be abused. 

There are 2 concerns at play here:

1. Prevent this JWT from being used on **APIs** that it does not need access to. For example, the frontend UI does not need the ability to list all transactions.
2. Prevent this JWT from being used to access **resources** that it does not need access to.

With that in mind we can implement these additional claims that we can validate server-side in our APIs.

| Claim name | Description | Example |
| -- | -- | --- |
| `transaction.correlation_id` | A random ID that is stored on any object created with this token. The API endpoints will disallow retrieving any resources that do not have this same ID associated to them. This can precent JWT token #1 from requesting details for a card created with JWT #2. | `1FE269211... `| 
| `transaction.amount` | The amount to restrict any authorizations or transactions to. | `1299` |
| `transaction.currency` | The currency to restrict any authorizations or transactions to. | `USD` |
| `allowed_endpoints` | A list of endpoints that this JWT token is allowed to access. This is a list of HTTP verbs and paths. Keep in mind that in combination with the `correlation_id` that even if an endpoint is allowed, the API might return an error if the `correlation_id` on the resource does not match. | `[{ "verb" : "post", "path" : "/cards" }]` |

A client-side JWT would look something like this, based on the list above.

```json
{
  "iss": "merchant",
  "sub": "123456789",
  "exp": 1544645174, // set to 5 minutes?
  "iat": 1544585174,
  "jti": "1FE269211...",
  "transaction": {
    "correlation_id": "D1223FDE...",
    "amount" 1299,
    "currency": "USD" 
  },
  "allowed_endpoints": [
    { "verb" : "post", "path" : "/cards" },
    { "verb" : "get", "path" : "/cards/{id}" }
  ]
}
```

