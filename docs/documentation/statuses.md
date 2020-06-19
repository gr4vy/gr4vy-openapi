---
tags: [Documentation]
---

# Status objects

The Gr4vy API is creates resources asynchronously. As a result, it returns a `status` object for most `POST`, `PUT` and `DELETE` endpoints.

## Status lifecycle

### Creating a resource

For example, to register a card you would make the following API call.

```http
POST http://{cluster}/cards
Authorization: Bearer {token}
Content-Type: application/json

{
  "number":"4111111111111111",
  "expiration_date":"11/2015",
  "security_code":"123"
}
```

This API will not return a `card` object. Instead, it will immediately queue up the creation of this card and return a `status` object.

```http
HTTP 202 Accepted
Content-Type: application/json

{
  "type": "status",
  "status": "pending",
  "resource_type": "card",
  "resource_id": "42b46d24-8cec-4699-8b84-aca31283367c"
}
```

## Querying a pending resource

The `resource_id` can be used to query the card endpoint and inspect the card's status. 

```http
GET http://{cluster}/cards/42b46d24-8cec-4699-8b84-aca31283367c
Authorization: Bearer {token}
```

If the card has not been fully created yet, the API will return a 404.

```http
HTTP 404 Not Found
Content-Type: application/json

{
  "type": "error",
  "code": "status_pending",
  "status": 404,
  "message": "The resource is still pending",
  "documentation_url": "https://developer.gr4vy.com/errors/status-pending",
  "additional_context": {
    "type": "status",
    "status": "pending",
    "resource_type": "card",
    "resource_id": "42b46d24-8cec-4699-8b84-aca31283367c"
  }
}
```

## Asynchronous creation of a resource

Once a resource is created, it will trigger a Pub/Sub message for the client to consume.

**TODO:** document pub/sub

## Querying a completed resource

Once the resource has been created, the API will return the actual resource.

```http
HTTP 200 OK
Content-Type: application/json

{
  "type": "card",
  "id": "42b46d24-8cec-4699-8b84-aca31283367c",
  "status": "created"
}
```
