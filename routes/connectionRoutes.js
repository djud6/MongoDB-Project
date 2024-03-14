const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost, isNotHost} = require('../middlewares/auth');
const{isInValid} = require('../middlewares/auth');

const router = express.Router();

// Setting up multer
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images/'); // Define the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Rename the uploaded file with a unique name (timestamp)
  },
});

const upload = multer({ storage });

// Get /connections: send all connections to the user
router.get('/', controller.connections);

// Get /connections/new: send HTML form for creating a new connection
router.get('/new',isLoggedIn, controller.new);

router.get('/about', controller.about);

router.get('/contact', controller.contact);

// POST /connections: create a new connection with image upload
router.post('/', isLoggedIn, upload.single('image'), controller.create);

// GET /connections/:id: send details of connection identified by id
router.get('/:id', isInValid, controller.show);

// GET /connections/:id/edit: send HTML form for editing an existing connection
router.get('/:id/edit', isLoggedIn, isHost,controller.edit);

// PUT /connections/:id: update connection with id
router.put('/:id', isLoggedIn, isHost, controller.update);

// Delete /connections/:id: delete connection identified by id
router.delete('/:id', isLoggedIn, isHost, controller.delete);

router.post('/:id/rsvp', isInValid, isLoggedIn, isNotHost, controller.editRsvp);

router.delete('/:id/rsvp', isInValid, isLoggedIn, isNotHost, controller.deleteRsvp);


module.exports = router;
