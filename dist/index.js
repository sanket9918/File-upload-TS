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
const DB_name = 'db.json';
const Collection_name = 'images';
const upload_path = 'uploads';
const upload = multer({ dest: `${upload_path}/` });
const db = new Loki(`${upload_path}/${DB_name}`, { persistenceMethod: 'fs' }); //Can use any db for this.
const app = express();
app.use(cors());
const utils_1 = require("./utils");
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
app.listen(3000, function () {
    console.log("Listening on port 3000!");
});
//# sourceMappingURL=index.js.map