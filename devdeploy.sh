#!/bin/sh
palm-install -r ryan.gahl.1plus1calculator.tp
./package.sh
VERSION=`cat appinfo.json | egrep -o '"version":\s"([^"]*)"' | sed -r 's/"version":\s"([^"]*)"/\1/'`
PACKAGE_NAME="ryan.gahl.1plus1calculator.tp_"$VERSION"_all.ipk"
palm-install packages/$PACKAGE_NAME
palm-launch ryan.gahl.1plus1calculator.tp
