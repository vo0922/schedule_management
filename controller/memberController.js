const member = require('../models/member')

module.exports = {
  /** 
   * 담당자 : 이승현
   * 함수 설명 : router에서 받은 memberId를 찾아 color를 update하는 함수입니다.
   * 주요 기능 : 사용자가 지정한 색상으로 header 색상을 변경하고 DB에 저장하여,
   *             다시 접속하였을 때도 바뀐 헤더 색상이 그대로 유지되는 기능입니다.
   */
  colorUpdate: async(color, memberId) => {
    try{
      const updateMember = await member.findOneAndUpdate({
        // 찾을 값(보내는 건 router에서)
        _id:memberId  
      }, {
        // update를 쓸때는 set(초기화)을 써준다
        $set:{headerColor:color}  
      })
      return color
    }catch(e){
      throw new Error(e)
    }
  },
  memberFind: async(text) => {
    try{
      const memberData = await member.find().or([{name: {$regex: text}},{email: {$regex: text}}])
      return memberData
    }catch(e){
      throw new Error(e)
    }
  }
}