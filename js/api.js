// ======================================
// API KEY
// ======================================

const API_KEY = "dce5a0304a54362d38efe06cfa2ad9e4";

// ======================================
// 카카오 책 검색 공통 함수
// ======================================

function searchBooks(keyword, size = 10, sort = "accuracy", target = "") {
  let url =
    "https://dapi.kakao.com/v3/search/book?query=" +
    encodeURIComponent(keyword) +
    "&size=" +
    size +
    "&sort=" +
    sort;

  // 제목으로만 검색하고 싶을 때
  if (target) {
    url += "&target=" + target;
  }

  return fetch(url, {
    method: "GET",

    headers: {
      Authorization: "KakaoAK " + API_KEY,
    },
  }).then(function (response) {
    return response.json();
  });
}
