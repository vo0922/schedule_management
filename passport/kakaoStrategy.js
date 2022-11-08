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
                clientID: process.env.KAKAO_ID,
                callbackURL: '/login/kakao/callback',
                session:true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exMember = await member.findOne({
                        // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
                        snsId: profile.id,
                        provider: 'kakao',
                    });
                    // 이미 가입된 카카오 프로필이면 프로필 업데이트 후 성공
                    if (exMember) {
                        // 카카오는 이메일을 필수항목으로 둘 수 없기에 이메일이 없을경우 유저 이름으로 대체
                        const updateMember = await member.findOneAndUpdate({snsId:profile.id},{
                            $set:{
                                email: profile._json.kakao_account.email ? profile._json.kakao_account.email : profile.username,
                                name: profile.username,
                                nickname: profile._json.properties.nickname,
                                profile: profile._json.properties.profile_image,
                            }
                        }).exec();
                        done(null, updateMember); // 로그인 인증 완료
                    } else {
                        // 가입되지 않는 유저면 유저 등록 후 성공
                        const newMember = await member.create({
                            email: profile._json.kakao_account.email ? profile._json.kakao_account.email : profile.username,
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