import * as express from 'express'
import * as multer from 'multer'
import * as cors from 'cors'
import * as Loki from 'lokijs'
import * as fs from 'fs'

const DB_name = 'db.json'
const Collection_name = 'images'
const upload_path = 'uploads'
const upload = multer({ dest: `${upload_path}/` });
const db = new Loki(`${upload_path}/${DB_name}`, { persistenceMethod: 'fs' }) //Can use any db for this.

const app = express()
app.use(cors())


import {
    loadCollection
} from './utils'
app.post('/profile', upload.single('avatar'), async (req, res) => {
    try {
        const col = await loadCollection(Collection_name, db)
        const data = col.insert(req.file)

        db.saveDatabase()
        res.send({ id: data.$loki, OriginalName: data.originalname, Filename: data.filename, status: "File uploaded successfully", statusNum: 1, });
    } catch (error) {
        res.send({ status: "File upload not successful", statusNum: 0, errorMsg: error });
    }
})


app.listen(3000, function () {
    console.log("Listening on port 3000!")
})


