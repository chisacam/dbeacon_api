const express = require('express');
const router = express.Router();
const Records = require('../models/record');

router.post('/insert', async function(req, res) {
    // 1. uid 받아서 db조회(이름, 부서)
    // 2. 조회된 이름, 부서와 앱에서 넘어온 출퇴근 타입, 그리고 현재시간 타임스탬프 db모델로 넘기기
    // 3. record 컬렉션에 도큐먼트로 기록
    const uid = req.body['uid'];
    const type = req.body['type'];
    const depart = req.body['depart'];
    const name = req.body['name'];
    const result = await Records.recording(uid, name, depart, type);
    res.json(result);
});

router.post('/read', async function(req, res) {
    // 넘겨받은 uid로 db조회한 결과 바로 리턴
    const uid = req.body['uid'];
    const start = req.body['startTime'];
    const end = req.body['endTime'];
    const result = await Records.loadRecordSel(uid, start, end);
    res.json(result);
});

module.exports = router;
