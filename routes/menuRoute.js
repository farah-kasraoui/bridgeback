
const express = require('express');
const router = express.Router();
const multer = require('multer');

const menuController = require('../controllers/menuController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname); // set the filename for uploaded files
    }
});

const fileFilter = function (req, file, cb) {
    // set the file filter for uploaded files
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// router.post('/', menuController.createMenuItem);
router.post('/',upload.single('image'),(req,res,next)=>{
    const image = req.file.path;
   
    menuController.createMenuItem(req.body.name,req.body.price,image)
        .then((item)=>res.status(200).json({
            item:item,
            msg:'Item created successfully'
        }))
        .catch((err)=>res.status(400).json({error:err}));
})

router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.put('/:id', upload.single('image'),menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);
router.post('/:id/upload', menuController.uploadImage);


module.exports = router;