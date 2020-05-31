const express = require('express');
const router = express.Router();
const Users = require('../models/users');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 기능 API
 * definitions:
 *   Signup_request:
 *     type: object
 *     required:
 *       - userid
 *       - userpw
 *       - depart
 *       - name
 *       - phonenumber
 *     properties:
 *       userid:
 *         type: string
 *         description: 아이디
 *       userpw:
 *         type: string
 *         description: 비밀번호
 *       userpwre:
 *         type: string
 *         desctiption: 비밀번호 확인
 *       depart:
 *         type: string
 *         description: 부서명
 *       name:
 *         type: string
 *         description: 이름
 *       phonenumber:
 *         type: string
 *         description: 전화번호
 *       questionType:
 *         type: string
 *         description: 질문유형
 *       questionAnswer:
 *         type: string
 *         description: 답변
 */

/**
 * @swagger
 * paths:
 *   /users/signup:
 *     post:
 *       tags:
 *         - User
 *       summary: signup api
 *       description: ''
 *       consumes:
 *         - application/json
 *       produces:
 *         - applicaiton/json
 *       parameters:
 *         - in: body
 *           name: body
 *           description: 회원가입 정보 전달
 *           required: true
 *           schema:
 *             $ref: '#/definitions/Signup_request'
 *       responses:
 *         200:
 *           description: 로그인 성공시
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               uid:
 *                 type: string
 *               name:
 *                 type: string
 *               depart:
 *                 type: string
 *               phone:
 *                 type: string
 *         500:
 *           description: 실패시
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 */

router.post('/signup', async function(req, res, next) {
  const id = req.body['userid'];
  const pw = req.body['userpw'];
  const pwre = req.body['userpwre'];
  const depart = req.body['depart'];
  const name = req.body['name'];
  const phone = req.body['phonenumber']
  const qType = req.body['questionType'];
  const qAnswer = req.body['questionAnswer'];

  if (pw == pwre) { // 앱에서 전송한 유저 정보들을 db에 저장하고, 저장결과를 받음.
    const result = await Users.create({ 
      name: name,
      userid: id,
      password: pw,
      department: depart,
      phone: phone,
      qType: qType,
      qAnswer: qAnswer
    })
    //console.log(result)
    if(result['_id']) { // mongodb가 생성한 유니크id와 입력한 이름(메인화면 표시용)을 반환함. 반환된 유니크 id와 이름은 asyncstorage로 저장할것.
        res.json({
          "code":"success",
          "uid":result['_id'],
          "name": name,
          "depart":depart,
          "phone":phone
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
      "depart":result['department'],
      "phone":result['phone']
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
