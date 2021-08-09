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

const serviceSchema = new Schema({
    id: { type: Schema.ObjectId },
    cardid: { type: String, required: true },
    num: { type: Number, required: true },
    service: { type: String, required: true },
    create_date: { type: String }
});

var createService = function (newDoc, callback) {
    newDoc.save(callback);
}

function getService(cardid, callback) {
    var d = {
        cardid: cardid
    }
    service.find(d, callback).sort('num');
}

const service = module.exports = mongoose.model('service', serviceSchema);
module.exports.createService = createService;
module.exports.getService = getService;

module.exports.addNewService = function (cardid, num, newService) {
    var data = new service({
        cardid: htmlspecialchars(cardid.trim()),
        num: htmlspecialchars(num),
        service: htmlspecialchars(newService.trim()),
        create_date: func.getDate(Date.now())
    });
    createService(data, function (err, callback) {
        if (err) { console.log(err); }
    })
}

module.exports.removeService = function (cardid, num, res) {
    service.findOneAndDelete({ cardid: { $eq: cardid }, num: { $eq: num } })
        .exec((err, docs) => {
            if (docs) { res.send("1"); }
            else { res.send("0"); }
        });
}

module.exports.edit = function (data, res) {
    if (data.serv != "") {
        service.findOneAndUpdate({ cardid: { $eq: data.cardid }, num: { $eq: data.num } }, {
            service: data.serv
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