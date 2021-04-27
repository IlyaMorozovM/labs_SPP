//предоставить веб-страницам доступ к ресурсам другого домена
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const Car = require('./model/car');
const db = 'mongodb+srv://admin:admin@cluster0.8p7at.mongodb.net/Cars?retryWrites=true&w=majority';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connected'))
    .catch((error) => console.log(error));

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('photo');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init app
const app = express();

// Public Folder
app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get('/cars', (req, res) => {
    Car.find()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            res.send(err)
        });
});

app.post('/cars', (req, res) => {
    upload(req, res, async(err) => {
        const { name, color, price } = req.body;
        console.log(req.body, req.file);
        const car = new Car({
            photo: "uploads/" + req.file.filename,
            name: name,
            color: color,
            price: price
        });
        console.log(req.body);
        console.log(req.file);
        car.save();
        res.status(200).json(car);
    });
});

const portID = 3000;
app.listen(portID, () => console.log(`Server started on port ${portID}`));