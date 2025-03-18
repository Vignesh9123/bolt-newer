#!/bin/bash

cd /tmp/bolty-worker

# rm -rf /tmp/bolty-worker

git clone https://github.com/code100x/base-react-native-expo.git .


exec code-server --bind-addr 0.0.0.0:8080 --auth none --disable-telemetry /tmp/bolty-worker 
