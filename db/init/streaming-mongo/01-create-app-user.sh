#!/bin/sh
set -eu

: "${MONGO_INITDB_ROOT_USERNAME:?missing}"
: "${MONGO_INITDB_ROOT_PASSWORD:?missing}"
: "${STREAMING_MONGO_DB:?missing}"
: "${STREAMING_MONGO_APP_USER:?missing}"
: "${STREAMING_MONGO_APP_PASSWORD:?missing}"

mongosh admin \
  -u "$MONGO_INITDB_ROOT_USERNAME" \
  -p "$MONGO_INITDB_ROOT_PASSWORD" <<'EOJS'
const databaseName = process.env.STREAMING_MONGO_DB;
const appUser = process.env.STREAMING_MONGO_APP_USER;
const appPassword = process.env.STREAMING_MONGO_APP_PASSWORD;

if (!databaseName || !appUser || !appPassword) {
  throw new Error("Streaming Mongo app user environment is incomplete.");
}

const database = db.getSiblingDB(databaseName);
if (!database.getUser(appUser)) {
  database.createUser({
    user: appUser,
    pwd: appPassword,
    roles: [{ role: "readWrite", db: databaseName }],
  });
}
EOJS
