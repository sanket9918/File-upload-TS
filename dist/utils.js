"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFilter = exports.cleanFolder = exports.loadCollection = void 0;
const del = require("del");
const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        });
    });
};
exports.loadCollection = loadCollection;
// To restrict ourshelves to a particular file type for upload
// Image here  - for example
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
        console.log(file.originalname);
        return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;
// To clean the folder of any content in it
const cleanFolder = function (folderPath) {
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
};
exports.cleanFolder = cleanFolder;
//# sourceMappingURL=utils.js.map