const member = require('../models/member')

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
  }
}