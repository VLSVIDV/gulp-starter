# Project
Project version v2
Project based on gulp v4

## Installation

* Node version must be 12.14+ (use nvm if necessary). [nvm](https://github.com/creationix/nvm). Or just read console if you get error (mostly it'll be node-sass. Just rebuild it)
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
Remove dist folder
```bash
gulp clear
```
Clear img cache
```bash
gulp clearCache
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
___

## Структура проекта
* src/files - фавиконки, шрифты (только woff и woff2) и прочие карты сайтов. При билде тупо копирует всё в корень папки build 
* img - неожиданно, картинки. Сжимаются и копируются в build/img
* js - в папку modules добавляются модули. В main.js они подключаются. Сжимаются и копируются в build/js/main.min.js. Библиотеки подключаются в gulpfile, таска 'scripts:libs'. Потом они сжимаются в отдельный файл build/js/libs.min.js
* pug - это будущий html. Туда же кидаются одноименные sass-файлы (подключаются в sass/components)
  * components - папка для "компонентов" - переиспользуемых элементов интерфейса (формы, навигация и тп). Здесь же лежат стили для этих компонентов (подключать в sass/global/components/components.scss)
    * global - footer, header, head, тэг "scripts" внизу страницы. Те штуки, которые будут на каждой странице сайта
    * modals - папка для модалочек. Подключаются в modals.pug. Здесь же лежит навигация по сайту _pages.pug
  * pages - страницы сайта и их стили. Для каждой страницы стоит создать свою папку (index, ui, about и тп). Подключаются в папке structure
  * structure - здесь собираем страницы из всех вышеуказанных pug-файлов. Каждый файл в этой папке - отдельная страница
* sass - стили
  * global - папка для общих стилей
    * components. Здесь стили для компонентов, у которых нет отдельного компонента, например _buttons.scss. Собираются в components.scss, в него же подключаются стили из pug/components
      * _buttons.scss - здесь можно прописать стили для стандартных кнопок
      * _container.scss - стили для .container
      * modals. Здесь можно хранить файлы стилей для разных модалок. Собирать в modals.scss
    * helpers - всякое разное. Собирается в helpers.scss
      * _base.scss - самые базовые стили, своего рода фиксы стандартных стилей браузера
      * _fonts.scss - подключение шрифтов с примером. Важно - если шрифт одного семейства ("TT Norms", к примеру), то имя для всех начертаний это шрифта должно быть одинаково, различия только в параметрах ниже. 
      * _normalize.scss - стандартизируем стили разных браузеров
      * _pages.scss - стили для навигации по сайту _pages.pug
      * _typography.scss - базовые настройки шрифтов
      * _variables.scss - все переменные scss записываем сюда
      * sprite - стили для автоматического сборщика спрайтов gulp.task('svg') . Ничего трогать там не надо
      * mixins - миксины scss. Собираются в mixins.scss
        * _clearfix.scss - для хака clearfix, если придется использовать float
        * _fluid-type.scss - уменьшение шрифта при уменьшении контейнера. Подробнее: https://css-tricks.com/snippets/css/fluid-typography/
        * _font-face.scss - миксин для font_face. Подробнее: https://gist.github.com/jonathantneal/d0460e5c2d5d7f9bc5e6
        * _mediaquery.scss - очень полезный миксин для медиа-выражений. Пример можно посмотреть в sass/global/_container.scss
        * _pseudo.scss - миксин для псевдоэлементов :before и :after
    * libs - здесь стили для библиотек, которые, по каким-то причинам, нельзя подключить из node_modules. Подключаем в libs.scss, там же подключем стили из node_modules
      * _libs.scss - подключаем стили библиотек из src/sass/global/libs
  * style.scss - собираем все вместе
* svg - сюда кидаем svg, которые потом соберутся в спрайт таском gulp
* upload - папка для динамического контента, который будет на сайте в будущем (из cms, например). То есть все картинки из новостей/статей/галерей кидаются сюда, а не в img. Бэкендеры скажут спасибо (наверное)