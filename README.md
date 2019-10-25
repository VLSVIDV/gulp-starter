# Project
Project version v1.1
Project based on gulp v4

## Installation

* Node version must be 11.11+ (use nvm if necessary). [nvm](https://github.com/creationix/nvm)
* Install all packages
```bash
npm -i
```

## Usage

Main gulp commands:
Start project
```bash
gulp
```
Build project
```bash
gulp build
```
Remove build folder
```bash
gulp del
```
Clear img cache
```bash
gulp clear
```
Convert fonts - fontgen (need to install fontgen on computer, maybe wont work on Windows/Mac)
```bash
gulp fontgen
```
Send to ftp (need to install rsync 'npm i rsync')
```bash
gulp deploy
```
___

Libraries are added by npm command. For example:
```bash
npm i #library-name
```
Further required to add style files in **_libs.scss** or js files in **gulpfile.js**

css-sprite mixin made css class with svg in base64 background