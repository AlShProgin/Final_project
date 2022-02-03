// создаём объект, где будут храниться данные для бонусной программы
/*
var person = {
    firstname: "Михаил",
    lastname: "Максимов",
    phone: "+79201234567",
    city: "Москва",
    age: 37,
    bonus: 2000,
    prev: ["Кроссовки", "Турник", "Зимняя куртка"]
};
// выводим содержимое объекта
console.log('Имя: ' + person.firstname);
console.log('Фамилия: ' + person.lastname);
console.log('Телефон: ' + person.phone);
console.log('Город: ' + person.city);
console.log('Возраст: ' + person.age);
console.log('Бонусы: ' + person.bonus);
console.log('Предыдущие покупки: ' + person.prev[0] + ' ' + person.prev[1] + ' ' + person.prev[2]);
// переводим объект в JSON-формат
var jsonData
jsonData = JSON.stringify(person);
// смотрим, что получилось
console.log(jsonData);
// переводим обратно в объект
person = JSON.parse(jsonData);*/

//Страница будет принимать изображение либо через передачу ссылки, либо через input file
var input_selection = document.getElementById('image_uploads_selection');
var input_text = document.getElementById('image_uploads_text');
var input_text_btn = document.getElementById("img_text_btn");
var preview = document.getElementById('preview');
var isUrlBugged = false;
var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
]

//Функция отправки запроса на отображение картинок на странице через promise
function get(url) {
    return new Promise(function(succeed, fail) {
        let request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.addEventListener("load", function() {
            if (request.status < 400)
                succeed(request.response);
            else
                fail(new Error("Request failed: " + request.statusText));
        });
        request.addEventListener("error", function() {
            fail(new Error("Network error, code " + request.status));
        });
        request.send();
    });
}
var imagesFromServer = [];
get("http://168.138.30.130/json/package.json").then(function(response) {
    console.log("Received GET response: ");
    console.log(response);
    imagesFromServer = JSON.parse(response);
    console.log("Parsed response: ");
    console.log(imagesFromServer);
    console.log("Received server's data. Size: ");
    console.log(imagesFromServer.length);
    uploadFromServer();
});

input_selection.style.opacity = 0;
input_selection.addEventListener('change', updateImageDisplay);
input_text_btn.addEventListener('click', updateImageDisplay);

_bugged = document.getElementById("bugged");
_bugged.onerror = function () {
    _bugged.src = '..\\media\\Crus.png';
    _bugged.height = 128;
    document.getElementById("test_bugged").textContent = "received bugged image - setting default one";
};

function updateImageDisplay() {
    while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    //alert(this.id);
    if(this.id === "image_uploads_selection"){
        uploadSelection();
    }
    if(this.id === "img_text_btn"){
        uploadURL();
    }
}

function uploadSelection(){
    let curFiles = input_selection.files;
    if(curFiles.length === 0) {
        alert("no files selected");
        let para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    }
    else {
        let list = document.createElement('ol');
        preview.appendChild(list);

        let images_valid = [];

        for(let i = 0; i < curFiles.length; i++) {
            let listItem = document.createElement('li');
            let para = document.createElement('p');
            if(validFileType(curFiles[i])) {
                console.log("reviewing: ");
                console.log(curFiles[i].name);
                console.log(returnFileSize(curFiles[i].size));
                para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                let image = document.createElement('img');
                image.src = window.URL.createObjectURL(curFiles[i]);

                console.log("Found a valid image file, pushing: " + curFiles[i].name + ", " + returnFileSize(curFiles[i].size));
                images_valid.push(curFiles[i]);

                listItem.appendChild(image);
                listItem.appendChild(para);
            }
            else {
                alert("invalid type");
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
            }
            list.appendChild(listItem);
        }
        console.log("Pushing an array of valid images: ");
        console.log(images_valid);
        imgToJSON("file", images_valid);
    }
}
function uploadURL(){
    let _url = input_text.value;
    alert(_url);
    //window.open(_url);
    let list = document.createElement('ol');
    preview.appendChild(list);

    let listItem = document.createElement('li');
    let para = document.createElement('p');

    console.log(_url);

    para.textContent = 'URL: ' + _url;
    let image = document.createElement('img');
    if(_url === ""){
        para.textContent = 'Invalid URL - posting a placeholder image';
        image.src = '..\\media\\Crus.png';
        isUrlBugged = true;
    }
    else{
        image.src = _url;
        isUrlBugged = false;
        image.onerror = function () {
            para.textContent = 'Invalid URL - posting a placeholder image';
            image.src = '..\\media\\Crus.png';
            isUrlBugged = true;
        }
    }
    listItem.appendChild(image);
    listItem.appendChild(para);
    list.appendChild(listItem);
    if(!isUrlBugged){
        imgToJSON("url", _url);
    }
}
function uploadFromServer(){
    if(imagesFromServer.length === 0) {
        console.log("no files on the server");
        let para = document.createElement('p');
        para.textContent = 'No files on the server';
        preview.appendChild(para);
    }
    else {
        console.log("proceeding with reading json");
        let list = document.createElement('ol');
        preview.appendChild(list);

        let i;
        for(i = 0; i < imagesFromServer.length; i++) {
            console.log("reviewing: ");
            console.log(imagesFromServer[i].name);

            let listItem = document.createElement('li');
            let para = document.createElement('p');
            para.textContent = 'File name: ' + imagesFromServer[i].name + ", storage method: " + imagesFromServer[i].type;
            let image = document.createElement('img');
            switch(imagesFromServer[i].type) {
                case 'url':
                    image.src = imagesFromServer[i].url;
                    break;
                case 'base64':
                    image.src = atob(imagesFromServer[i].url);
                    break;
                case 'path':
                    image.src = imagesFromServer[i].url;
                    break;
                default:
                    console.log("invalid image type");
                    let para = document.createElement('p');
                    para.textContent = 'Invalid image type';
                    preview.appendChild(para);
                    continue;
            }
            console.log("Received a valid image from the server, pushing: " + imagesFromServer[i].name);

            listItem.appendChild(image);
            listItem.appendChild(para);
            list.appendChild(listItem);
        }
        console.log("Done reading server's json");
    }
}

//Текущая структура страницы такова:
//есть контейнер review, который, при передаче файлов, генерирует список ol
//каждый элемент которого - пара картинка-описание
function imgToJSON(_type, info){
    if(_type === "file"){
        console.log("got to files.json");
        if(info.length === 0){
            console.log("No valid images through selection, cannot stringify");
            return;
        }
        else{
            console.log("The array is not empty");
            let arr=[];
            function Image_files(_name, _size) {
                this.name = _name;
                this.size = returnFileSize(_size);
            }
            for(let i = 0; i < info.length; i++){
                arr.push(new Image_files(info[i].name, info[i].size));
            }
            let imagesJSON = JSON.stringify(arr);
            console.log(imagesJSON);
            return imagesJSON;
        }
    }
    if(_type === "url"){
        let Image_url = {
            type: "url",
            url: info
        }
        let imageJSON = JSON.stringify(Image_url);
        console.log(imageJSON);
        return imageJSON;
    }

}

function validFileType(file) {
    for(var i = 0; i < fileTypes.length; i++) {
        if(file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}
function returnFileSize(number) {
    if(number < 1024) {
        return number + 'bytes';
    } else if(number > 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + 'KB';
    } else if(number > 1048576) {
        return (number/1048576).toFixed(1) + 'MB';
    }
}



