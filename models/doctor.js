const mongoose = require('mongoose');
const mongo = require('mongodb');
const dbUrl = 'mongodb://localhost:27017/clinic';
const htmlspecialchars = require('htmlspecialchars');
var sha256 = require('js-sha256');
const db2 = require('monk')('localhost/clinic')
const func = require('../public/javascripts/func');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
const Schema = mongoose.Schema;

const docSchema = new Schema({
    id: { type: Schema.ObjectId },
    cardid: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, require: true },
    clinic: { type: String, require: true },
    addr: { type: String },
    tel: { type: String },
    email: { type: String },
    IDLine: { type: String },
    fac: { type: String },
    spec: { type: String },
    pwd: { type: String },
    pic: { type: String },
    appove: { type: String },
    create_date: { type: Date }
});

var createDoctor = function (newDoc, callback) {
    newDoc.save(callback);
}

const doctor = module.exports = mongoose.model("doctor", docSchema);
module.exports.createDoctor = createDoctor;

function getCardID(cardid, callback) {
    var d = {
        cardid: cardid
    }
    doctor.find(d, callback);
}

module.exports.getCardID = getCardID;

module.exports.addNewDoctor = function (form, img) {
    var data = new doctor({
        cardid: htmlspecialchars(form.cardid.trim()),
        title: htmlspecialchars(form.title.trim()),
        name: htmlspecialchars(form.name.trim()),
        lastname: htmlspecialchars(form.lastname.trim()),
        clinic: htmlspecialchars(form.clinic.trim()),
        addr: htmlspecialchars(form.addr.trim()),
        tel: htmlspecialchars(form.tel.trim()),
        email: htmlspecialchars(form.email.trim()),
        IDLine: htmlspecialchars(form.lineid.trim()),
        fac: htmlspecialchars(form.fac.trim()),
        spec: htmlspecialchars(form.spec.trim()),
        pwd: sha256(htmlspecialchars(form.pwd.trim())),
        pic: img,
        appove: 'no',
        create_date: func.getDate(Date.now())
    });
    createDoctor(data, function (err, callback) {
        if (err) { console.log(err); }
    });
}

module.exports.edit = function (form, img, res) {
    var doc = db2.get('doctors');
    doc.update({ _id: form.id }, {
        $set: {
            title: htmlspecialchars(form.title.trim()),
            name: htmlspecialchars(form.name.trim()),
            lastname: htmlspecialchars(form.lastname.trim()),
            clinic: htmlspecialchars(form.clinic.trim()),
            addr: htmlspecialchars(form.addr.trim()),
            tel: htmlspecialchars(form.tel.trim()),
            email: htmlspecialchars(form.email.trim()),
            IDLine: htmlspecialchars(form.lineid.trim()),
            fac: htmlspecialchars(form.fac.trim()),
            spec: htmlspecialchars(form.spec.trim()),
            pic: img,
        }
    }, function(err, docs) {
        if(err) res.send(err);
        else {
            res.redirect('/doctor_user');
        }
    });
}