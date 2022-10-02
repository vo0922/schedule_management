/**
 * 담당자 : 박신욱
 * 함수 설명 : 회원인증 미들웨어
 * 주요 기능 : 세션값을 통해 로그인 유지
 */
const authUtil = {
    checkUser: (req, res, next) => {
        if(req.session.passport){
            return next();
        }else {
            return res.redirect('/login');
        }
    }
}

module.exports = authUtil;