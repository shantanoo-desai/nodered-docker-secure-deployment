# nodered-docker-secure-deployment

A better strategy to deploy a node-RED Docker Container with Environment Variables with Docker Secrets

## Standard Practice

User credentials can be passed to `settings.js` file via Environment Variables to a Docker container for Node-RED.

The Credentials can still be observed when conducting inspections:

```bash
docker inspect -f "{{ .Config.Env }} <container hash / container name>
```
Depending on situations may not be desirable.

## Using Environment Variables with Docker Secrets in Standalone Deployments

Pass the Environment Variables to the `docker-compose.yml` file using `secrets` specification from Docker Compose.

This method mounts the respective Docker Secrets into `/run/secrets/<secret-name>` at runtime, and mitigates the 
values to be displayed even upon performing `docker config`.

## Related Research

- [Repo on docker-compose-secrets-envvars](https://github.com/shantanoo-desai/docker-compose-secrets-envvars)
- [Docker Compose V2 feature on Docker Blog](https://www.docker.com/blog/new-docker-compose-v2-and-v1-deprecation/)

## LICENSE

Issued und the __MIT License__

