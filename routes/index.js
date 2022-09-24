var express = require('express');
var router = express.Router();
const multer = require('multer');
const jimp = require('jimp');
var fn = 'test.jpeg';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    fn = counter + '_' + uniqueSuffix + '-' + file.originalname;
    cb(null, fn);
  }
})

const upload = multer({ storage: storage })

var steps = [];
var counter = 0;
var gray = 0;
var filename = "placeholder.jpg"

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { filename });
});

router.post('/photo', upload.single('avatar'), function (req, res, next) {
  // res.render('index', {filename: req.file.filename});
  filename = req.file.filename;
  steps = [];
  gray= 0;
  steps.push(filename);
  console.log(steps);
  res.redirect('back');   
})

// jimp stuff

router.get('/invert', async function (req, res, next) {
  // jimp.read(`./public/images/uploads/test.jpeg`)
  // .then(image => {
  //   image
  //     .invert()
  //     .write('./public/images/uploads/edited.jpeg');
  // })
  // .catch(err => {
  //   console.log(err)
  // });

  image = await jimp.read(`./public/images/uploads/${filename}`);
  counter++
  var new_name = `${counter}_${filename.split('_')[1]}`;
  await image.invert().write(`./public/images/uploads/${new_name}`);

  filename = new_name;
  steps.push(filename);
  console.log(steps);
  res.json({ img: filename })
})

router.get('/gray', async function (req, res, next) {
  if (gray === 0) {
    image = await jimp.read(`./public/images/uploads/${filename}`);
    counter++
    var new_name = `${counter}_${filename.split('_')[1]}`;
    await image.greyscale().write(`./public/images/uploads/${new_name}`);

    filename = new_name;
    steps.push(filename);
    gray = 1;
  }
  console.log(steps);
  res.json({ img: filename })

})

router.get('/mirror', async function (req, res, next) {
  image = await jimp.read(`./public/images/uploads/${filename}`);
  counter++
  var new_name = `${counter}_${filename.split('_')[1]}`;
  await image.mirror(true, false).write(`./public/images/uploads/${new_name}`);

  filename = new_name;
  steps.push(filename);

  console.log(steps);
  res.json({ img: filename })  

})

router.get('/cover', async function (req, res, next) {
  image = await jimp.read(`./public/images/uploads/${filename}`);
  counter++
  var new_name = `${counter}_${filename.split('_')[1]}`;
  await image.cover(1000, 1000).write(`./public/images/uploads/${new_name}`);

  filename = new_name;
  steps.push(filename);

  console.log(steps);
  res.json({ img: filename }) 
 
})

module.exports = router;          
 