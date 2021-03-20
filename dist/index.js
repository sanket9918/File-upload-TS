"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Loki = require("lokijs");
const fs = require("fs");
const path = require("path");
const utils_1 = require("./utils");
const DB_name = 'db.json';
const Collection_name = 'images';
const upload_path = 'uploads';
const upload = multer({ dest: `${upload_path}/`, fileFilter: utils_1.imageFilter });
const db = new Loki(`${upload_path}/${DB_name}`, { persistenceMethod: 'fs' }); //Can use any db for this.
const app = express();
app.use(cors());
app.post('/profile', upload.single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(Collection_name, db);
        const data = col.insert(req.file);
        db.saveDatabase();
        res.send({ id: data.$loki, OriginalName: data.originalname, Filename: data.filename, status: "File uploaded successfully", statusNum: 1, });
    }
    catch (error) {
        res.send({ status: "File upload not successful", statusNum: 0, errorMsg: error });
    }
}));
// Photo only upload mechanism
app.post('/photo/upload', upload.single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(Collection_name, db);
        const data = col.insert(req.file);
        db.saveDatabase();
        res.send({ id: data.$loki, OriginalName: data.originalname, Filename: data.filename, status: "File uploaded successfully", statusNum: 1, });
    }
    catch (error) {
        res.send({ status: "File upload not successful", statusNum: 0, errorMsg: error });
    }
}));
// Upload an array of photos
app.post('/photos/upload', upload.array('photos', 1), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(Collection_name, db);
        let data = [].concat(col.insert(req.files));
        db.saveDatabase();
        res.send(data.map(x => ({ filename: x.filename, originalname: x.originalname })));
    }
    catch (error) {
        res.send({ status: "File upload not successful", statusNum: 0, errorMsg: error });
    }
}));
// get the images
app.get('/images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(Collection_name, db);
        res.send(col.data);
    }
    catch (error) {
        res.send({ error: error });
    }
}));
// get a particular image
app.get('/images/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(Collection_name, db);
        const result = col.get(req.params.id);
        if (!result) {
            res.send({ error: "Invalid input data" });
            return;
        }
        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(path.join(upload_path, result.filename)).pipe(res);
    }
    catch (error) {
        res.sendStatus(400);
    }
}));
app.listen(3000, function () {
    console.log("Listening on port 3000!");
});
//# sourceMappingURL=index.js.map