/*=============== 공유 옵션 checkbox 클릭 후 + 버튼 눌렀을 시, 사용자 목록 모달창 띄우기 ===============*/
// var count = 0;
// function share_user_list() {
//   // plus 클릭횟수가 홀수면 내부 클래스를 ㅇㅇㅇ로 변경
//   // plus 클릭횟수가 짝수면 내부 클래스를 ㅇㅇㅇ로 변경
  
//   // plus btn 누를 때마다 위의 변수에 +1을 해 주자
//     // count = count + 1
//     // count += 1
//     count++
//     console.log(count);
//     if(count % 2 != 0){ // 클릭 횟수 홀수일 때 = 보이는 상태
//       document.getElementById('category-modal-content').classList.add = 'show_category-modal-content'
//       document.getElementById('category_modal_section').classList.add = 'category_modal_section_div'
  
  
      
//     }else { // 클릭 횟수 짝수일 때 = 안 보이는 상태 
//       document.getElementById('category-modal-content').classList.remove = 'show_category-modal-content'
//       document.getElementById('category-modal-content').classList.add = 'category-modal-content'
      
//       document.getElementById('category_modal_section').classList.remove = 'category_modal_section_div'
  
//     }

// }
// document.getElementById('category_share_user_list_add').addEventListener('click', function() {
//   document.getElementById('category_modal_section2').style.display = "block"
// })
document.getElementById('category_share_user_list_add').addEventListener('click', function() {
  
  document.getElementsByClassName('category-modal-content')[0].className = "show_category-modal-content"
  document.getElementsByClassName('category_modal_section')[0].className = "category_modal_section_div"
  document.getElementById('category_modal_section2').style.display = "block"
  // document.getElementsByClassName('category_modal_section')[1].className = 'category_modal_section_border'
})