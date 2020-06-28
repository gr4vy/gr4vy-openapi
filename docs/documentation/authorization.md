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

### Example JWT claim

```json
{
  "iss": "?",  // issuer  (optional)
  "sub": " ?", // subject (optional)
  "aud":   "?", // audience  (optional)
  "exp": 1544645174, // claim expiration date  (optional, recommended)
  "nbf": 1544605174, // not to be used before  (optional)
  "iat": 1544605174, // issued at (optional, recommended),
  // JWT ID used to add randomness to claim (optional, recommended)
  "jti": "1FE269211ED9FC05E4FC3BE4AFEC0B804746359547C8B224E574BD5F7AFE8D2B"
}
```

### Client-side JWT

To facilitate client-side authentication, a JWT token can be scoped to only be used for usage in a browser, mainly for usage with our Hosted UI.

Client-side JWT tokens are scoped to be shorter lived, and only allow access to a subset of the API. The key differences are:

* `exp` - A shorter expiration time 
* `??[apis]??` - A list of API endpoints that this JWT token is restricted to.
* `??[amount/currency]??` - For a Hosted UI that handles auth/capture as well as the tokenization, this claim will restrict the JWT to be used only for a certain amount and a certain currency.

### Server-side JWT

[TBD]


