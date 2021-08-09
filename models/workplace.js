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

const workplaceSchema = new Schema({
    id: { type: Schema.ObjectId },
    cardid: { type: String, required: true },
    num: { type: Number, required: true }, 
    workplace: { type: String, required: true },
    create_date: { type: String }
});

var createWorkplace = function(newDoc, callback) {
    newDoc.save(callback);
}

function getWorkplace(cardid, callback) {
    var d = {
        cardid: cardid
    }
    workplace.find(d, callback);
}

const workplace = module.exports = mongoose.model('workplace', workplaceSchema);
module.exports.createWorkplace = createWorkplace;
module.exports.getWorkplace = getWorkplace;

module.exports.addNewWorkplace = function(cardid, num, workplacex) {
    var data = new workplace({
        cardid: htmlspecialchars(cardid.trim()), 
        num: htmlspecialchars(num),
        workplace: htmlspecialchars(workplacex.trim()),
        create_date: func.getDate(Date.now())
    });
    createWorkplace(data, function(err, callback) {
        if(err) { console.log(err); }
    })
}

module.exports.removeWorkplace = function (cardid, num, res) {
    workplace.findOneAndDelete({ cardid: { $eq: cardid }, num: { $eq: num } })
        .exec((err, docs) => {
            if (docs) { res.send("1"); }
            else { res.send("0"); }
        });
}

module.exports.editWorkplace = function (data, res) {
    if (data.workplace != "") {
        workplace.findOneAndUpdate({ cardid: { $eq: data.cardid }, num: { $eq: data.num } }, {
            workplace: data.workplace
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