const express = require('express');
const router = express.Router();

const multer = require("multer");
var FTPStorage = require('multer-ftp')
const Blog = require('../../models/Blog');
const path = require('path');

const FTP = require('ftp');
const ftpClient = new FTP();
const ftp = {
    host: 'ftp.sharek-it.tn',
    user: 'sharek',
    password: 'GEfs23tQ6'
}


const storage = new FTPStorage({
    ftp: {
        host: 'ftp.sharek-it.tn',
        user: 'sharek',
        password: 'GEfs23tQ6',
        keepalive: 9999999
    },
    connection: ftpClient,
    basepath: '/public_html/assets/img/Blog/',
    destination: function (req, file, options, callback) {
        ftpClient.connect(ftp)
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds()
        let id = year + "" + month + "" + day + "" + "" + hour + "" + minutes + "" + seconds;
        file.originalname = id + file.originalname.replace(/^.*\./, '.');
        callback(null, path.join(options.basepath, file.originalname).replace(/\\/g, "/"))

    },
});
// STORAGE MULTER CONFIG
/* let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/Blogs");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file"); */

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

//=================================
//             Blog
//=================================

// fieldname: 'file',
// originalname: 'React.png',
// encoding: '7bit',
// mimetype: 'image/png',
// destination: 'uploads/',
// filename: '1573656172282_React.png',
// path: 'uploads/1573656172282_React.png',
// size: 24031 

/* router.post("/uploadfiles", (req, res) => {
    upload(req, res, err => {


        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
});
 */

router.post('/uploadfiles', upload.single('file'), (req, res, next) => {
    const file = req.file;
    const paths = "assets/img/Blog/" + file.originalname
    if (!file) {
        const error = new Error('please upload a file ')
        error.httpStatusCode = 400
        return next(error)
    }
    return res.json({ success: true, url: paths, fileName: file.originalname });
    ftpClient.end()
});

router.post("/createPost", (req, res) => {
    console.log(req.body)
    const blog = new Blog({ content: req.body.content, writer: req.body.writer, title: req.body.title });

    blog.save((err, postInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, postInfo })
    })

    //생각 해보니  세이브 할떄 populate 할필요가 없다.   가져올떄 하면 되니깐...
    // blog.save((err, response) => {
    //     if (err) return res.json({ success: false, err });
    //     Blog.find({ _id: response._id })
    //         .populate('writer')
    //         .exec((err, result) => {
    //             let postInfo = result[0]
    //             if (err) return res.json({ success: false, err });
    //             return res.status(200).json({ success: true,  postInfo });
    //         })
    // });
});


router.get("/getBlogs", (req, res) => {
    Blog.find({}).select("-content").populate('writer')
        .exec((err, result) => {

            if (err) return res.json({ success: false, err });
            return res.status(200).json({ success: true, result });
        })
});
router.get("/getBlogsByN/:id", (req, res) => {
    Blog.find({ "_id": { "$lt": req.params.id } })
        .sort({ "_id": -1 })
        .limit(3)
        .then(blogs => {

            res.status(200).json({ success: true, blogs });
        }).catch(err => res.status(400).send(err));
});
router.get("/getFirstBlog", (req, res) => {
    Blog
        .findOne().sort({ field: 'asc', _id: -1 }).limit(1)
        .then(blogs => {

            res.status(200).json({ success: true, blogs });
        }).catch(err => res.status(400).send(err));
});

router.get("/getPost/:id", (req, res) => {
    console.log(req.params)
    Blog.findOne({ _id: req.params.id })
        .then(post => {

            console.log(post)

            res.status(200).json({ success: true, post })
        }).catch(err => res.status(400).send(err))
});
router.delete("/deletePost/:id", (req, res) => {
    Blog.findOne({ _id: req.params.id })
        .remove({ _id: req.params.id })
        .then((don) => res.json(don))
        .catch((err) => console.log(err));
});


module.exports = router;
