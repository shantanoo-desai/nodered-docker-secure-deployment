# nodered-docker-secure-deployment

A better strategy to deploy a node-RED Docker Container with Environment Variables with Docker Secrets

## Standard Practice

User credentials can be passed to `settings.js` file via Environment Variables to a Docker container for Node-RED.

The Credentials can still be observed when conducting inspections:

```bash
docker inspect -f "{{ .Config.Env }}" <container hash / container name>
```
Depending on situations may not be desirable.

## Using Environment Variables with Docker Secrets in Standalone Deployments

Pass the Environment Variables to the `docker-compose.yml` file using `secrets` specification from Docker Compose.

This method mounts the respective Docker Secrets into `/run/secrets/<secret-name>` at runtime, and mitigates the 
values to be displayed even upon performing `docker config`.

## How it Adds up!

### Admin User Credentials Generation

use `htpasswd` to generate the credentials on the terminal

```bash
htpasswd -nb -B -C 8 admin testpassword
```

Add the generated credentials in the `.env` as:

```
NODERED_ADMIN_CREDS='<bcrypt_password_for_admin_from_htpasswd>` # DO NOT FORGET TO ENCLOSE CREDS IN SINGLE QUOTES
```

### Read Only User Credentials Generation

Perform the same operation with `htpasswd` again for a read-only user

```bash
htpasswd -nb -B -C 8 ro_user testpasswordreadonly
```
Add the generated credentials in the `.env` as:

```
NODERED_READONLY_CREDS='<bcrypt_password_for_rouser_from_htpasswd>` # DO NOT FORGET TO ENCLOSE CREDS IN SINGLE QUOTES
```

### `settings.js` Changes

Adapt the following block to let the node-RED read credentials from the `/run/secrets` mount:

```javascript

adminAuth: {
    type: "credentials",
    users: [
        {
            username: require("fs").readFileSync('/run/secrets/nodered-admin-creds').toString().split(':')[0],
            password: require("fs").readFileSync('/run/secrets/nodered-admin-creds').toString().split(':')[1].replace('$2y$','$2b$'),
            permissions: "*"
        },
        {
            username: require("fs").readFileSync('/run/secrets/nodered-readonly-creds').toString().split(':')[0],
            password: require("fs").readFileSync('/run/secrets/nodered-readonly-creds').toString().split(':')[1].replace('$2y$','$2b$'),
            permissions: "read"
        }
    ]
},
```

### `docker-compose.yml` Specs

Within the `docker-compose.yml` add the `secrets` block as follows:

```yaml

secrets:
  nodered-admin-creds:
    environment: NODERED_ADMIN_CREDS
  nodered-readonly-creds:
    environment: NODERED_READONLY_CREDS
```
And pass the secrets to the `nodered` service as follows:

```yaml
services:
  nodered:
    # SNIP
    secrets:
      - nodered-admin-creds
      - nodered-readonly-creds
```

## Results

Bring the Stack up:

```bash
docker compose up -d
```

Login into node-red Editor using `http://localhost:1880`

Check if you can see the passwords via as environment variables via:

```bash
docker inspect -f "{{ .Config.Env }}" nodered-docker-secure-deployment-nodered-1
```
which you wouldn't because of Docker Secrets.

## Related Research

- [Repo on docker-compose-secrets-envvars](https://github.com/shantanoo-desai/docker-compose-secrets-envvars)
- [Docker Compose V2 feature on Docker Blog](https://www.docker.com/blog/new-docker-compose-v2-and-v1-deprecation/)
- [using `htpasswd` with Node-RED](https://shantanoo-desai.github.io/posts/technology/htpasswd-node-red-docker/)

## LICENSE

Issued und the __MIT License__
