import * as del from 'del'
import * as Loki from 'lokijs'

const loadCollection = function (colName, db: Loki): Promise<Collection<any>> {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName)
            resolve(_collection)
        })
    })
}

// To restrict ourshelves to a particular file type for upload

// Image here  - for example
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
        console.log(file.originalname)
        return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true)
}

// To clean the folder of any content in it
const cleanFolder = function (folderPath) {
    del.sync([`${folderPath}/**`, `!${folderPath}`])
}

export { loadCollection, cleanFolder, imageFilter }
