---
tags: [Documentation]
---

# Hosted UI

This document outlines a basic flow diagram for a Hosted UI.

## What is a Hosted UI?

A **Hosted UI** is a piece of frontend HTML, CSS, and JS that is loaded into a merchant's page through a piece of JS. Because this UI is seperate from the customer's frontend code, and ideally more secure, this UI can handle a customer filling in their credit card securily. This UI is often loaded by some JS, and either handles the entire transaction, or handles just the tokenization of the card.

## Hosted UI tokenization flow

These are a few proposals on how a Hosted UI could work with the Gr4vy API.

### 1a. Hosted tokenization + submission of form

This form tokenizes a card in a Hosted UI, and then passes the card ID back to the page that loaded the Hosted UI. This card ID is then submitted to the merchant server, where the merchant can then process the card and create and capture an authorization. 

![Proposal 1a](https://youthful-mirzakhani-e4ae8f.netlify.app/hosted-ui-1a-mermaid.png)

### 1b. Simplified hosted tokenization for React

The following flow is a slightly simplified example of the Hosted UI that assumes a customer uses something like React in their front-end, and treats their own server as an API.

![Proposal 1b](https://youthful-mirzakhani-e4ae8f.netlify.app/hosted-ui-1b-mermaid.png)

### 2. Hosted tokenization, authorization, and capture

The following flow is an example where the UI handles both the tokenization, authorization,  and capture. This example requires the least effort on the side of the customer. 

![Proposal 2](https://youthful-mirzakhani-e4ae8f.netlify.app/hosted-ui-2-mermaid.png)

In this flow, all the merchant has to do is:

1. Create a JWT token (server-side SDK)
2. Initialize the Hosted UI with the JWT and a redirect URL (frontend SDK)
3. Listen to Pub/Sub messages for completed transactions (server-side SDK)
4. Create a page to redirec to after the transaction is complete 



