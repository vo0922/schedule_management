const member = require('../models/member')

/**
 * 담당자 : 박신욱
 * 함수 설명 : 유저 모델을 컨트롤 하는 함수
 */
module.exports = {
  colorUpdate: async(color, memberId) => {
    try{
      const updateMember = await member.findOneAndUpdate({
        _id:memberId  // 찾을 값(보내는 건 router에서)
      }, {
        $set:{headerColor:color}  // update를 쓸때는 set을 써준다?
      })
      return color
    }catch(e){
      throw new Error(e)
    }
  },
  /**
   * 담당자 : 박신욱
   * 함수 설명 : 공유할 유저를 검색 하는 함수
   * 주요 기능 : 유저를 이름 및 이메일로 검색한 데이터를 반환하는 기능
   */
  memberFind: async(text) => {
    try{
      const memberData = await member.find().or([{name: {$regex: text}},{email: {$regex: text}}])
      return memberData
    }catch(e){
      throw new Error(e)
    }
  }
}