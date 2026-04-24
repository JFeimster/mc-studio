#!/bin/bash
# Install local dependencies
npm install

# Install Wix CLI globally for Jules to use
npm install -g @wix/cli

# Sync types for Velo autocomplete
npm run postinstall
