const passport = require('passport');
const naver = require('./naverStrategy'); // 네이버서버로 로그인할때
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때
const member = require('../models/member');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 소셜로그인 passport
 * 주요 기능 : 유저 정보 객체를 세션에 저장 및 세션에 저장한 객체를 가져오는기능
 * 네이버와 카카오의 strategy등록
 */
module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        member.findOne({ _id: id })
            .then(member => done(null, member))
            .catch(err => done(err));
    });

    naver(); // 네이버 전략 등록
    kakao(); // 카카오 전략 등록
};