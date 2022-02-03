# Final_project  
Содержит итоговый проект по предмету "Сетевые и интернет технологии" (по сути - компиляция лабораторных работ)  
**Примечание: репозиторий содержит лиль кодовые файлы для быстрой проверки.  
Рабочий проект можно скачать по [ссылке](https://disk.yandex.ru/d/6-OANloULZK-2A)**  
## Процесс установки  
1. Скопируйте файлы проекта по [ссылке](https://disk.yandex.ru/d/6-OANloULZK-2A);
    + Если в качестве IDE будет использоваться не WebStorm, то удалите папку .idea.
2. Убедитесь, что у вас установлен NodeJS. Скачать можно с [официального сайта](https://nodejs.org/ru/) (в проекте использована версия 16.13);
3. С корня проекта перейдите в папку app (команда `cd app` в консоли);
4. Установите зависимостите проекта, введя в консоль команду `npm install`;
5. В появившейся папке node modules перейдите в папке requirejs - перенесите файлы require.js и bin/r.js в app;
6. Для сборки проекта в консоли введите команду `node r.js -o build-app.js` (скрипт работать не захотел);
7. Оптизированный и рабочий проект будет располагаться в созданной папке built, на одном уровне с app;
8. Для навигации по сайту откройте файл index.html в built и используйте меню в левом верхнем углу 
   
*Известные проблемы:*
1. Оптимизатор обрабатывает и дублирует медиа файлы (изображения и видео). Решение - вынести указанные файлы на уровень выше, обновив ссылки нан их (среда делает автоматически);  
2. В проекте использованы возможности файлы core.min.js библиотеки lodash, но хранится и дубрируется вся библиотека. Всё ради строки `_ = require(lodash);` при сдачи лабораторной;
3. Сайт является пространством, передающим какую-то идею, его содержимое выглядит несвязно - сайт представляет из себя архив лабораторны работ за 5 семестр без дополнительного оформления.
