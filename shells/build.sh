#!/bin/bash
rm -r -f 'dist'
export NODE_ENV=production
npx webpack --progress --display minimal
