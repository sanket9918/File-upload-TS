import * as express from 'express'
import * as multer from 'multer'
import * as cors from 'cors'
import * as Loki from 'lokijs'
import * as fs from 'fs'
import * as path from 'path'

import {
    imageFilter,
    loadCollection
} from './utils'

const DB_name = 'db.json'
const Collection_name = 'images'
const upload_path = 'uploads'
const upload = multer({ dest: `${upload_path}/`, fileFilter: imageFilter });
const db = new Loki(`${upload_path}/${DB_name}`, { persistenceMethod: 'fs' }) //Can use any db for this.

const app = express()
app.use(cors())


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

// Photo only upload mechanism

app.post('/photo/upload', upload.single('avatar'), async (req, res) => {
    try {
        const col = await loadCollection(Collection_name, db);
        const data = col.insert(req.file)

        db.saveDatabase()
        res.send({ id: data.$loki, OriginalName: data.originalname, Filename: data.filename, status: "File uploaded successfully", statusNum: 1, });

    } catch (error) {
        res.send({ status: "File upload not successful", statusNum: 0, errorMsg: error });

    }
})

// Upload an array of photos
app.post('/photos/upload', upload.array('photos', 1), async (req, res) => {
    try {
        const col = await loadCollection(Collection_name, db)
        let data = [].concat(col.insert(req.files))
        db.saveDatabase()
        res.send(data.map(x => ({ filename: x.filename, originalname: x.originalname })))
    } catch (error) {
        res.send({ status: "File upload not successful", statusNum: 0, errorMsg: error });

    }
})

// get the images
app.get('/images', async (req, res) => {
    try {
        const col = await loadCollection(Collection_name, db)
        res.send(col.data)
    } catch (error) {
        res.send({ error: error })
    }
})

// get a particular image
app.get('/images/:id', async (req, res) => {

    try {
        const col = await loadCollection(Collection_name, db)
        const result = col.get(req.params.id)

        if (!result) {
            res.send({ error: "Invalid input data" })
            return
        }
        res.setHeader('Content-Type', result.mimetype)
        fs.createReadStream(path.join(upload_path, result.filename)).pipe(res)
    } catch (error) {
        res.sendStatus(400)
    }


})

app.listen(3000, function () {
    console.log("Listening on port 3000!")
})


