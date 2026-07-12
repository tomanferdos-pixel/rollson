# Rollson

Secure CD-key mail query site: enter a key, open the linked inbox, copy verification codes.

Rebranded from the popcorn / Mar One storefront UI: external store/social links removed, brand set to **Rollson**.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

Demo key (returns sample codes):

```
DEMO-ROLLSON-00000-00000
```

## Configure real keys

Edit `data/keys.json` or set `KEYS_JSON` env:

```json
{
  "YOUR-CD-KEY": {
    "email": "mailbox@outlook.com",
    "enabled": true,
    "expiresAt": "2027-01-01T00:00:00.000Z",
    "refreshToken": "ms-refresh-token",
    "demo": false
  }
}
```

Optional Microsoft Graph:

- `MS_CLIENT_ID`
- `MS_CLIENT_SECRET`
- `MS_TENANT_ID` (default `common`)

## Deploy on Render

```bash
render login
render blueprints validate
# create / deploy via blueprint or dashboard, then:
render deploys create --wait
```

Or connect the Git repo in Render Dashboard with build `npm install && npm run build` and start `npm run start`.
