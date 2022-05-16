#!/bin/sh

echo "Xcode version:"
xcodebuild -version
echo "Brew version:"
brew --version
echo "PATH:"
echo $PATH

# Install CocoaPods and npm using Homebrew.
echo "Install CocoaPods"
brew install cocoapods

echo "Install npm"
brew install node@12
#
brew link --overwrite node@12
brew link --overwrite cocoapods
brew link --overwrite npm

echo "Pod version:"
pod --version
echo "Node version:"
node --version
echo "NPM version:"
npm --version
echo "PATH:"
echo $PATH
#
# Setting Environment Variables
cd ../..

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

# Install dependencies
echo "Running npm install"
npm install
echo "Running pod install"
cd ios
pod install
