#!/bin/bash

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
HERE=$(pwd)
DOCKERIMAGE_NAME="aai-testcollector"


cd "$BASEDIR"
case "$1" in

    "docker")
        VERSION=$(npm run --silent version)
        echo "version=$VERSION"
        npm run build
        cd docker
        if [ -d "dist" ]; then
            rm -rf dist
        fi
        cp -r ../dist .
        cp ../package.json .
        docker build -t $DOCKERIMAGE_NAME:$VERSION -t $DOCKERIMAGE_NAME:latest .
        rm package.json
        rm -rf dist
    ;;


esac;

cd "$HERE"