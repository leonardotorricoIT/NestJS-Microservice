#!/bin/bash

PROTO_DIR=./proto

# Gateway
OUT_DIR_GATEWAY=./gateway/src/proto
mkdir -p $OUT_DIR_GATEWAY
npx protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=$OUT_DIR_GATEWAY \
  --ts_proto_opt=nestJs=true,addGrpcMetadata=true,outputServices=grpc-js \
  -I $PROTO_DIR \
  $PROTO_DIR/*.proto

# User Service
OUT_DIR_USER=./user-service/src/proto
mkdir -p $OUT_DIR_USER
npx protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=$OUT_DIR_USER \
  --ts_proto_opt=nestJs=true,addGrpcMetadata=true,outputServices=grpc-js \
  -I $PROTO_DIR \
  $PROTO_DIR/*.proto

# Task Service
OUT_DIR_TASK=./task-service/src/proto
mkdir -p $OUT_DIR_TASK
npx protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=$OUT_DIR_TASK \
  --ts_proto_opt=nestJs=true,addGrpcMetadata=true,outputServices=grpc-js \
  -I $PROTO_DIR \
  $PROTO_DIR/*.proto
