#!/bin/bash
set -e

node_modules/.bin/sequelize db:create || echo 'Database cant be created might be exists'
npm run migrate
