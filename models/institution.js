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

const institutionSchema = new Schema({
    id: { type: Schema.ObjectId },
    cardid: { type: String, required: true },
    num: { type: Number, required: true }, 
    institution: { type: String, required: true },
    create_date: { type: String }
});

var createInstitution = function(newDoc, callback) {
    newDoc.save(callback);
}

function getInstitution(cardid, callback) {
    var d = {
        cardid: cardid
    }
    institution.find(d, callback).sort('num');
}

const institution = module.exports = mongoose.model('institution', institutionSchema);
module.exports.createInstitution = createInstitution;
module.exports.getInstitution = getInstitution;

module.exports.addNewInstitution = function(cardid, num, inst) {
    var data = new institution({
        cardid: htmlspecialchars(cardid.trim()), 
        num: htmlspecialchars(num),
        institution: htmlspecialchars(inst.trim()),
        create_date: func.getDate(Date.now())
    });
    createInstitution(data, function(err, callback) {
        if(err) { console.log(err); }
    })
}

module.exports.removeInstitution = function (cardid, num, res) {
    institution.findOneAndDelete({ cardid: { $eq: cardid }, num: { $eq: num } })
        .exec((err, docs) => {
            if (docs) { res.send(true); }
            else { res.send(false); }
        });
}

module.exports.editInstitution = function (data, res) {
    if (data.inst != "") {
        institution.findOneAndUpdate({ cardid: { $eq: data.cardid }, num: { $eq: data.num } }, {
            institution: data.inst
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