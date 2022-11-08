const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
require('dotenv').config();
const member = require('../models/member');

/**
 * 담당자 : 박신욱
 * 함수 설명 : 소셜로그인 네이버 Strategy
 * 주요 기능 : 네이버로그인 성공후 사용자 데이터 저장및 업데이트
 */
module.exports = () => {
    passport.use('naver',
        new NaverStrategy(
            {
                clientID: process.env.NAVER_ID,
                clientSecret: process.env.NAVER_SECRET,
                callbackURL: '/login/naver/callback',
                session:true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exMember = await member.findOne({
                        // 네이버 플랫폼에서 로그인 했고 & snsId필드에 네이버 아이디가 일치할경우
                        snsId: profile.id,
                        provider: 'naver'
                    });
                    // 이미 가입된 네이버 프로필이면 프로필 업데이트 후 성공
                    if (exMember) {
                        const updateMember = await member.findOneAndUpdate({snsId:profile.id},{
                            $set:{
                                email: profile._json.email,
                                name: profile.displayName,
                                nickname: profile._json.nickname,
                                profile: profile._json.profile_image,
                            }
                        }).exec();
                        done(null, updateMember);
                    } else {
                        // 가입되지 않는 유저면 유저 등록 후 성공
                        const newMember = await member.create({
                            email: profile._json.email,
                            nickname: profile._json.nickname,
                            snsId: profile.id,
                            profile: profile._json.profile_image,
                            name: profile.displayName,
                            provider: 'naver',
                        });
                        done(null, newMember);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            },
        ),
    );
};