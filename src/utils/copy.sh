#!/bin/sh

cd /Users/qiantingting/work/02-study/05-node/03-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log