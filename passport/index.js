const passport = require('passport');
const naver = require('./naverStrategy'); // 네이버서버로 로그인할때
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때
const member = require('../models/member');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 소셜로그인 passport index
 * 주요 기능 : 소셜로그인 Strategy와 성공, 실패 처리
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