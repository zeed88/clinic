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

const timeTableSchema = new Schema({
    id: { type: Schema.ObjectId },
    cardid: { type: String, required: true },
    num: { type: Number, required: true }, 
    day: { type: String, required: true },
    starttime: { type: String },
    endtime: { type: String },
    create_date: { type: String }
});

var createTimeTable = function (newDoc, callback) {
    newDoc.save(callback);
}

function getTimetable(cardid, callback) {
    var d = {
        cardid: cardid
    }
    timetable.find(d, callback).sort('num');
}

const timetable = module.exports = mongoose.model('timetable', timeTableSchema);
module.exports.createTimeTable = createTimeTable;
module.exports.getTimetable = getTimetable;

module.exports.addNewTimeTable = function (cardid, num, day, starttime, endtime) {
    var data = new timetable({
        cardid: htmlspecialchars(cardid.trim()),
        num: htmlspecialchars(num.trim()),
        day: htmlspecialchars(day.trim()),
        starttime: starttime,
        endtime: endtime,
        create_date: func.getDate(Date.now())
    });
    createTimeTable(data, function (err, callback) {
        if (err) { console.log(err); return false; }
        else return true;
    })
}