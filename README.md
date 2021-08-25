# Itrial-API

Monolith backend api for web client and mobile app.

1. Install and setup MongoDB: https://docs.mongodb.com/manual/installation/
2. Create a folder in the root directory (if not already present) called "config", and in it, create these files: .env.defaults .env.prod .env.test .env.dev and .env.schema

3. The contents of these files are:

```bash
# .env.defaults
MONGO_URL=mongodb://localhost:27017/itral
PORT=8000
CLIENT_ORIGIN_URL=http://localhost:3000
AUTH0_AUDIENCE=http://itrial.com/api
AUTH0_DOMAIN=dev-4gryrryb.us.auth0.com
```

```bash
# .env.prod
MONGO_URL=mongodb+srv://itrials:itrialsiscool@cluster0.56vq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
PORT=8000
CLIENT_ORIGIN_URL=http://localhost:3000
AUTH0_AUDIENCE=http://itrial.com/api
AUTH0_DOMAIN=dev-4gryrryb.us.auth0.com
```

```bash
# .env.test
MONGO_URL=mongodb://localhost:27017/itraltest
PORT=8000
CLIENT_ORIGIN_URL=http://localhost:3000
AUTH0_AUDIENCE=http://itrial.com/api
AUTH0_DOMAIN=dev-4gryrryb.us.auth0.com
```

```bash
# .env.dev
MONGO_URL=mongodb+srv://itrials:itrialsiscool@cluster0.56vq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
PORT=8000
CLIENT_ORIGIN_URL=http://localhost:3000
AUTH0_AUDIENCE=http://itrial.com/api
AUTH0_DOMAIN=dev-4gryrryb.us.auth0.com
```

```bash
# .env.schema (this outlines all of the env vars for the whole app)
MONGO_URL=
PORT=
CLIENT_ORIGIN_URL=
AUTH0_AUDIENCE=
AUTH0_DOMAIN=
```

4. You will probably only run 4 commands: **yarn install**, **yarn local**, **yarn dev (or devWindows if you're on windows)**, and **yarn test**. The first installs all the dependencies, the second is for local development, the third is for local dev but using the hosted DB (it should have some good fake data), and the last is for running all unit tests (I would do this every now and then).
