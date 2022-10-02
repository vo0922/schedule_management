const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
require('dotenv').config();
const member = require('../models/member');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 소셜로그인 카카오 Strategy
 * 주요 기능 : 카카오로그인 성공후 사용자 데이터 저장및 업데이트
 */
module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID, // 카카오 로그인에서 발급받은 REST API 키
                callbackURL: '/login/kakao/callback', // 카카오 로그인 Redirect URI 경로
                session:true,
            },
            /*
             * clientID에 카카오 앱 아이디 추가
             * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
             * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
             * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
             */
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exMember = await member.findOne({
                        // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
                        snsId: profile.id,
                        provider: 'kakao',
                    });
                    // 이미 가입된 카카오 프로필이면 성공
                    if (exMember) {
                        const updateMember = await member.findOneAndUpdate({snsId:profile.id},{
                            $set:{
                                email: profile._json.kakao_account.email,
                                name: profile.username,
                                nickname: profile._json.properties.nickname,
                                profile: profile._json.properties.profile_image,
                            }
                        }).exec();
                        done(null, updateMember); // 로그인 인증 완료
                    } else {
                        // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                        const newMember = await member.create({
                            email: profile._json.kakao_account.email,
                            nickname: profile._json.properties.nickname,
                            snsId: profile.id,
                            profile: profile._json.properties.profile_image,
                            name: profile.displayName,
                            provider: 'kakao',
                        });
                        done(null, newMember); // 회원가입하고 로그인 인증 완료
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            },
        ),
    );
};