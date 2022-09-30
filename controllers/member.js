const member = require('../models/member')

module.exports = {
    register : async (req, res) =>{
        try{
            const memberData = new member({
                email: req.body.email,
                name: req.body.name,
                nickname: req.body.nickname,
                profile: req.body.profile
            });
            await member.findOne({email: memberData.email}).exec(async (err, result) => {
                if(result) {
                    return res.status(201).json({data: memberData, message: memberData.nickname + "님 환영합니다."});
                } else {
                    const newMember = await memberData.save();
                    console.log(memberData.email + "님이 등록 되었습니다.");
                    return res.status(201).json({data: newMember, message: memberData.nickname + "님 환영합니다."});
                }
            })
        }catch (err){
            res.status(400).json({message:err});
        }
    }
}