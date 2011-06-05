#!/bin/sh
palm-install -r ryan.gahl.1plus1calculator.tp
./package.sh
palm-install packages/ryan.gahl.1plus1calculator.tp_1.0.0_all.ipk
palm-launch ryan.gahl.1plus1calculator.tp
