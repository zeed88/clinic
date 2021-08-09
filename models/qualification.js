const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/clinic';
const htmlspecialchars = require('htmlspecialchars');
const db2 = require('monk')('localhost/clinic')
const func = require('../public/javascripts/func');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
const Schema = mongoose.Schema;

const qualificationSchema = new Schema({
    id: { type: Schema.ObjectId },
    cardid: { type: String, required: true },
    num: { type: Number, required: true },
    qualification: { type: String, required: true },
    create_date: { type: String }
});

var createQualification = function (newDoc, callback) {
    newDoc.save(callback);
}

function getQualification(cardid, callback) {
    var d = {
        cardid: cardid
    }
    qualification.find(d, callback);
}

const qualification = module.exports = mongoose.model('qualification', qualificationSchema);
module.exports.createQualification = createQualification;
module.exports.getQualification = getQualification;

module.exports.addNewQualification = function (cardid, num, newQualification) {
    var data = new qualification({
        cardid: htmlspecialchars(cardid.trim()),
        num: htmlspecialchars(num),
        qualification: htmlspecialchars(newQualification.trim()),
        create_date: func.getDate(Date.now())
    });
    createQualification(data, function (err, callback) {
        if (err) { console.log(err); }
    })
}

module.exports.removeQualification = function (cardid, num, res) {
    qualification.findOneAndDelete({ cardid: { $eq: cardid }, num: { $eq: num } })
        .exec((err, docs) => {
            if (docs) { res.send(true); }
            else { res.send(false); }
        });
}

module.exports.editQualification = function (data, res) {
    if (data.qua != "") {
        qualification.findOneAndUpdate({ cardid: { $eq: data.cardid }, num: { $eq: data.num } }, {
            qualification: data.qua
        })
            .exec((err, docs) => {
                if (err) res.send(err);
                else {
                    if (docs) res.send(true);
                    else res.send(false);
                }
            });
    } else {
        res.send(false);
    }
}