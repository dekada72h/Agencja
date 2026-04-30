# Partner panel credentials

`partners.json` is the source of truth for `/panel` login. It is mounted into
the production Docker container as a read-only file:

```yaml
# deploy/docker-compose.next.yml
volumes:
  - ./data/partners.json:/app/data/partners.json:ro
```

To add or rotate a partner:

```bash
# 1. generate a bcrypt hash for the new password
node -e "console.log(require('bcryptjs').hashSync('the-real-password', 10))"

# 2. edit web/data/partners.json on your laptop, commit
# 3. rsync to the VPS, no rebuild needed:
rsync -av web/data/partners.json dekada-vps:/srv/sites/dekada72h.com/data/partners.json
# loadPartners() re-reads the file every 5 seconds, so the change is live
```

## Fields

- `email` — login (case-insensitive)
- `password_hash` — bcrypt(password, 10)
- `name` — shown in the panel header
- `role` — `owner` or `partner` (currently informational; future authorization)

## ⚠️ Initial credentials shipped in repo

Both partners currently share **`panel-startowe-haslo-2026`**. Rotate before
giving access to anyone. The hash in `partners.json` should be replaced for
each partner with their own password.
