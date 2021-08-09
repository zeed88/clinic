var getDate = function(date) {
    var d = new Date(date);
    var date2 = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    
    if(month.toString().length < 2) month = '0' + month;
    if(date2.toString().length < 2) date2 = '0' + date2;
    return `${year}-${month}-${date2} ${h}:${m}:${s}`;
}

module.exports.getDate = getDate;