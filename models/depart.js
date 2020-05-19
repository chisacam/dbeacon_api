const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const depart = new mongoose.Schema({
    name:{type:String, required:true, unique:true}
})

depart.statics.addDepart = function (data) {
    const depart = new this(data);
    return depart.save();
}

depart.statics.getDepartList = function () {
    return this.find({},{name:1});
}

module.exports = mongoose.model('Depart', depart);