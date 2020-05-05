const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const record = new mongoose.Schema({
    uid:{type:Object, required: true},
    name:{type: String, required: true},
    depart:{type: String, required: true},
    type:{type: String, required: true},
    time:{type: Date, required: true}
});

record.statics.recording = async function (uid, name, depart, type) {
    // uid로 유저 이름, 부서 조회후 변수 저장, 해당 변수와 type으로 넘어오는 기록 유형(출퇴근 등), 그리고 타임스탬프 기록(save)
    const result = new this({
        uid:uid,
        name:name,
        depart:depart,
        type:type,
        time:new Date()
    })
    return result.save();
}

record.statics.loadRecord = function (uid) {
    // uid로 검색되는 모든 document 리턴
    return this.find({"uid":uid});
}

record.statics.loadRecordSel = function (uid, start, end) {
    return this.find({"uid":uid, "time":{"$gte":new Date(start + "T00:00:00.000Z"), "$lte":new Date(end + "T00:00:00.000Z")}});
}

record.statics.loadRecordAll = function (uid) {
    return this.find({"uid":uid})
}

module.exports = mongoose.model('Record', record);