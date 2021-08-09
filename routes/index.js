var express = require('express');
var router = express.Router();

const htmlspecialchars = require('htmlspecialchars');
var doctors = require('../models/doctor');
var service = require('../models/service');
var worksplace = require('../models/workplace');
var inst = require('../models/institution');
var qua = require('../models/qualification');
var time_table = require('../models/time_table');
const func = require('../public/javascripts/func');
const formidable = require('formidable');
const fs = require('fs');
var sha256 = require('js-sha256');
const session = require('express-session');
const path = require('path');
router.use(session({
  secret: 'hello world',
  resave: false,
  saveUninitialized: false
}))
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/temp', (req, res) => {
  res.render('temp');
});

router.get('/doctor_user', (req, res) => {
  var session = req.session;
  /* session.destroy((err) => {
    if(err) { res.send(err); }
  }); */
  session.cardid = '5149999004580';
  console.log(session.cardid);
  session.cookie.expire = new Date(Date.now() + 604800);
  session.cookie.maxAge = 604800;
  doctors.getCardID([session.cardid], function (err, data) {
    service.getService([session.cardid], function (err, ser) {
      worksplace.getWorkplace([session.cardid], function (err, work) {
        inst.getInstitution([session.cardid], function (err, ins) {
          qua.getQualification([session.cardid], function (err, qu) {
            time_table.getTimetable([session.cardid], function (err, timetable) {
              res.render('doctor/doctor_user', { data: data, service: ser, workplace: work, inst: ins, qua: qu, timetable: timetable, sess: session.cardid });
            })
          });
        });
      });
    })
  });
});

router.get('/doctor/:cardid', (req, res) => {
  var cardid = req.params.cardid;
  doctors.getCardID([cardid], function (err, data) {
    service.getService([cardid], function (err, ser) {
      worksplace.getWorkplace([cardid], function (err, work) {
        inst.getInstitution([cardid], function (err, ins) {
          qua.getQualification([cardid], function (err, qu) {
            time_table.getTimetable([cardid], function (err, timetable) {

              res.render('doctor/doctor_user', { data: data, service: ser, workplace: work, inst: ins, qua: qu, timetable: timetable });
            })
          });
        });
      });
    })
  });
});

router.post('/save-general-doctor', (req, res, next) => {
  var f = new formidable.IncomingForm();
  f.parse(req, (err, fields, files) => {
    var newFile = fields.img;
    if (files.file.name != "") {
      var dir = "public/images/";
      if (fields.img != "") {
        fs.unlink(dir + fields.img, (err) => {
          if (err) console.log(err);
        });
      }
      var oldFile = files.file.name.split('.');
      var newFile = fields.cardid + '.' + oldFile[oldFile.length - 1];
      var fname = dir + newFile;
      fs.renameSync(files.file.path, fname, err => { });
    }
    doctors.edit(fields, newFile, res);
  });
});

router.get('/del-service/:cardid/:num', (req, res, next) => {
  service.removeService(req.params.cardid, req.params.num, res);
});

router.post('/add-service', (req, res, next) => {
  if (req.body.serv != "") {
    service.addNewService(req.body.cardid, req.body.num, req.body.serv);
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post('/edit-service', (req, res, next) => {
  service.edit(req.body, res);
});

router.post('/add-workplace', (req, res, next) => {
  if (req.body.workplace != "") {
    worksplace.addNewWorkplace(req.body.cardid, req.body.num, req.body.workplace);
    res.send(true);
  } else {
    res.send(false);
  }
});

router.get('/del-workplace/:cardid/:num', (req, res, next) => {
  var data = [req.params.cardid, req.params.num];
  worksplace.removeWorkplace(req.params.cardid, req.params.num, res);
  console.log(data);
});

router.post('/edit-workplace', (req, res, next) => {
  worksplace.editWorkplace(req.body, res);
});

router.post('/add-institution', (req, res, next) => {
  if (req.body.inst != "") {
    inst.addNewInstitution(req.body.cardid, req.body.num, req.body.inst);
    res.send(true)
  } else {
    res.send(false);
  }
});

router.get('/del-institution/:cardid/:num', (req, res, next) => {
  //var data = [req.params.cardid, req.params.num];
  inst.removeInstitution(req.params.cardid, req.params.num, res);
});

router.post('/edit-institution', (req, res, next) => {
  inst.editInstitution(req.body, res);
});

router.post('/add-qualification', (req, res, next) => {
  if (req.body.qua != "") {
    qua.addNewQualification(req.body.cardid, req.body.num, req.body.qua);
    res.send(true)
  } else {
    res.send(false);
  }
});

router.get('/del-qualification/:cardid/:num', (req, res, next) => {
  qua.removeQualification(req.params.cardid, req.params.num, res);
});

router.get('/doc_register', (req, res) => {
  res.render('doctor/register_doctor');
});

router.post('/edit-qualification', (req, res, next) => {
  qua.editQualification(req.body, res);
})

router.get('/register', (req, res) => {
  res.render('patient/register');
});

router.get('/doctor_login', (req, res) => {
  res.render('doctor/doctor_login');
});

router.get('/patient_login', (req, res) => {
  res.render('patient/patient_login');
});

router.get('/doctor_list', (req, res) => {
  res.render('doctor/doctor_list');
});

router.get('/wait_appove', (req, res) => {
  res.render('appointment/wait_appove');
});

router.get('/patient_list', (req, res) => {
  res.render('patient/patient_list');
});

router.get('/confirm_app', (req, res) => {
  res.render('appointment/confirm_app');
});

router.get('/appove_app', (req, res) => {
  res.render('appointment/appove_app');
});

router.get('/appointment_table', (req, res) => {
  res.render('appointment/appointment_table');
});

router.get('/no_come', (req, res) => {
  res.render('appointment/no_come');
});

router.post('/save_register', (req, res, next) => {
  var f = new formidable.IncomingForm();
  f.parse(req, (err, fields, files) => {
    doctors.getCardID([fields.cardid], function (err, data) {
      if (err) throw err;
      if (data.length > 0) {
        res.send("1");
      } else {
        if (fields.cardid.length < 13) {
          res.send("err_card");
        } else if (fields.pwd != fields.pwd2) {
          res.send("err_pwd");
        } else if (fields.pwd.length < 6) {
          res.send("err_pwd_len");
        } else {
          var newFile = "";
          var dir = "public/images/";
          if (files.file.name != "") {
            var oldFile = files.file.name.split('.');
            var newFile = fields.cardid + '.' + oldFile[oldFile.length - 1];
            var fname = dir + newFile;
            fs.renameSync(files.file.path, fname, err => { });
          }
          res.send(doctors.addNewDoctor(fields, newFile));
        }
      }
    });
  });
});

router.post('/add-service', (req, res, next) => {
  var s = req.body.serv.toString().split(',');
  for (var i = 0; i < s.length; i++) {
    if (s[i] != "") {
      service.addNewService(req.body.cardid, i + 1, s[i]);
    }
  }
  res.send("1");
});

router.post('/add-place', (req, res, next) => {
  var s = req.body.pl.toString().split(',');
  for (var i = 0; i < s.length; i++) {
    if (s[i] != "") {
      worksplace.addNewWorkplace(req.body.cardid, i + 1, s[i])
    }
  }
  res.send("1");
});

router.post('/add-institution', (req, res, next) => {
  var s = req.body.institution.toString().split(',');
  for (var i = 0; i < s.length; i++) {
    if (s[i] != "") {
      inst.addNewInstitution(req.body.cardid, i + 1, s[i])
    }
  }
  res.send("1");
});

router.post('/add-qualification', (req, res, next) => {
  var s = req.body.qua.toString().split(',');
  for (var i = 0; i < s.length; i++) {
    if (s[i] != "") {
      qua.addNewQualification(req.body.cardid, i + 1, s[i])
    }
  }
  res.send("1");
});

router.post('/add-time-table', (req, res, next) => {
  time_table.addNewTimeTable(req.body.cardid, '1', "จันทร์", req.body.tstartmon, req.body.tendmon);
  time_table.addNewTimeTable(req.body.cardid, '2', "อังคาร", req.body.tstarttu, req.body.tendtu);
  time_table.addNewTimeTable(req.body.cardid, '3', "พุธ", req.body.tstartwe, req.body.tendwe);
  time_table.addNewTimeTable(req.body.cardid, '4', "พฤหัสบดี", req.body.tstartth, req.body.tendth);
  time_table.addNewTimeTable(req.body.cardid, '5', "ศุกร์", req.body.tstartfr, req.body.tendfr);
  time_table.addNewTimeTable(req.body.cardid, '6', "เสาร์", req.body.tstartst, req.body.tendst);
  time_table.addNewTimeTable(req.body.cardid, '7', "อาทิตย์", req.body.tstartsun, req.body.tendsun2);
  req.session.cardid = req.body.cardid;
  res.send('1');
});

module.exports = router;
