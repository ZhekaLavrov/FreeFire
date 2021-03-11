const express = require("express");
const formidable = require('formidable');
const jsonParser = express.json()
const fs = require("fs");

const app = express();

app.use(express.static(__dirname + "/www"));

app.use("/point", function(request, response){
	response.sendFile(__dirname + "/www/index.html");
	console.log("use")

	let form = new formidable.IncomingForm();
	form.parse(request, function (err, fields, files) {
		if (files.label.name != '' && fields.point_x != '0' && fields.point_y != '0' && fields.typePoint != '' && fields.mapPoint != ''){
			let oldpath = files.label.path;
			let newpath = "C:\\Users\\Admin\\AppData\\Local\\Temp\\" + files.label.name;
			fs.renameSync(oldpath, newpath);

			fields.file_path = newpath
			console.log(fields)
			// Перемещение файла
			fs.renameSync(fields.file_path, __dirname + "\\www\\imgs\\" + files.label.name);
			// Загрузка файла и парсинг json
			let points = JSON.parse(fs.readFileSync("points.json", "utf8"));
			// Создание новой точки
			let newPoint = {}
			newPoint.type = fields.typePoint
			newPoint.x = fields.point_x
			newPoint.y = fields.point_y
			newPoint.img = "imgs/" + files.label.name
			newPoint.map_id = fields.mapPoint
			// Добавление новой точки
			points.push(newPoint)
			// Перевод в строку
			let points_str = JSON.stringify(points,null,'\t'); // Перевод в текст
			// Сохранение измененного файла
			fs.writeFileSync("points.json", points_str) // Сохранение обнавленного файла
			// Сохранение js файла
			fs.writeFileSync(__dirname + "\\www\\points.js", 'let points = ' + points_str) // Сохранение обнавленного файла
		}
	});
});
app.use("/", function(request, response){
	response.sendFile(__dirname + "/www/index.html");
});

app.post('/point', jsonParser, function (request, response) {
	console.log("post")

	response.send("Сохранено") // отправляем пришедший ответ обратно
})

app.listen(3000);