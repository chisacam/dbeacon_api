const express = require('express');
const router = express.Router();
const Users = require('../models/users');


router.post('/signup', async function(req, res, next) {
  const id = req.body['userid'];
  const pw = req.body['userpw'];
  const pwre = req.body['userpwre'];
  const depart = req.body['depart'];
  const name = req.body['name'];
  const qType = req.body['questionType'];
  const qAnswer = req.body['questionAnswer'];
  // const phone = req.body['phone'];
  if (pw == pwre) { // 앱에서 전송한 유저 정보들을 db에 저장하고, 저장결과를 받음.
    const result = await Users.create({ 
      name: name,
      userid: id,
      password: pw,
      department: depart,
      qType: qType,
      qAnswer: qAnswer
    })
    //console.log(result)
    if(result['_id']) { // mongodb가 생성한 유니크id와 입력한 이름(메인화면 표시용)을 반환함. 반환된 유니크 id와 이름은 asyncstorage로 저장할것.
        res.json({
          "code":"success",
          "uid":result['_id'],
          "name": name,
          "depart":depart
        });
    }
    else {
      res.json({
        "code":"error",
        "reason":"id is not uniq"
      })
    }
  } else {
    res.json({
      "code":"error",
      "reason":"password is not correct"
    })
  }
})

router.post('/login', async function(req, res, next) {
  const id = req.body['userid'];
  const pw = req.body['userpw'];
  const result = await Users.findUser(id, pw);
  console.log(result);
  if(result) { // mongodb가 생성한 유니크id와 입력한 이름(메인화면 표시용)을 반환함. 반환된 유니크 id와 이름은 asyncstorage로 저장할것.
    res.json({
      "code":"success",
      "uid":result['_id'],
      "name":result['name'],
      "depart":result['department']
    });
  }
  else {
    res.json({
      "code":"error",
      "reason":result
    })
  }
})

router.post('/delete', async function(req, res, next) {
  const uid = req.body['uid'];
  const result = await Users.deleteUser(uid);
  if(result) { // 탈퇴 요청시 uid로 검색된 유저정보를 제거하고 결과를 반환함.
    res.json({
      "code":"success",
      "result":result
    });
  }
  else {
      res.json({
        "code":"error",
        "reason":result
      })
  }
})

router.post('/passcheck', async function(req,res,next) {
  const uid = req.body['uid'];
  const pass = req.body['password'];
  const result = await Users.checkPass(uid, pass);
  if(result){
    res.json({
      "code":"success"
    })
  } else {
    res.json({
      "code":"error"
    })
  }
})

router.post('/passchange', async function(req,res,next) {
  const email = req.body['email'];
  const pass = req.body['password'];
  const result = await Users.changePass(email, pass);
  if(result){
    res.json({
      "code":"success"
    })
  } else {
    res.json({
      "code":"error"
    })
  }
})

router.post('/edit', async function(req,res, next) {
  const uid = req.body['uid'];
  const pass = req.body['password'];
  const result = await Users.changeInfo(uid, pass);
  if(result){
    res.json({
      "code":"success"
    })
  } else {
    res.json({
      "code":"error"
    })
  }
})

router.post('/lostpass', async function(req, res, next) {
  const email = req.body['email'];
  const qType = req.body['questionType'];
  const qAnswer = req.body['questionAnswer'];
  const result = await Users.checkInfo(email,qType,qAnswer);
  if(result){
    res.json({
      "code":"success"
    })
  } else {
    res.json({
      "code":"error"
    })
  }
})

module.exports = router;
