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

___

## Структура проекта
* src/files - фавиконки, шрифты (только woff и woff2) и прочие карты сайтов. При билде тупо копирует всё в корень папки build 
* img - неожиданно, картинки. Сжимаются и копируются в build/img
* js - в папку modules добавляются модули. В main.js они подключаются. Сжимаются и копируются в build/js/main.min.js. Библиотеки подключаются в gulpfile, таска 'scripts:libs'. Потом они сжимаются в отдельный файл build/js/libs.min.js
* pug - это будущий html. Туда же кидаются одноименные sass-файлы
** components - папка для "компонентов" - переиспользуемых элементов интерфейса (формы, навигация и тп)
** - global - footer, header, head, тэг "scripts" внизу страницы. Те штуки, которые будут на каждой странице сайта
** - modals - папка для модалочек. Подключаются в modals.pug. Здесь же лежит навигация по сайту _pages.pug
** pages - страницы сайта и их стили. Для каждой страницы стоит создать свою папку (index, ui, about и тп). Подключаются в папке structure
** structure - здесь собираем страницы из всех вышеуказанных pug-файлов. Каждый файл в этой папке - отдельная страница
* sass - стили. Подключаются в style.scss. Стили библиотек подключаются отдельно, в _libs.scss
** global - общие стили
*** _base.scss - самые базовые стили, своего рода фиксы стандартных стилей браузера
*** _container.scss - стили для .container
*** _fonts.scss - подключение шрифтов с примером. Важно - если шрифт одного семейства ("TT Norms", к примеру), то имя для всех начертаний это шрифта должно быть одинаково, различия только в параметрах ниже. 

