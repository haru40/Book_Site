// ======================================
// URL에서 책 제목 가져오기
// ======================================

const params = new URLSearchParams(window.location.search);

const bookTitle = params.get("title") || "투명한 나선";

// ======================================
// 상세 책 API
// ======================================

function loadBookDetail() {
  searchBooks(bookTitle, 1, "accuracy", "title")
    .then(function (data) {
      // 검색 결과 없으면 종료
      if (data.documents.length === 0) {
        return;
      }

      // ======================================
      // 책 데이터
      // ======================================

      const book = data.documents[0];

      const date = book.datetime ? book.datetime.substring(0, 10) : "";

      const formattedDate = date.replaceAll("-", ".");

      // ======================================
      // 작가 배너 표지
      // ======================================

      const authorBannerCover = document.getElementById("author-banner-cover");

      if (authorBannerCover) {
        authorBannerCover.src = book.thumbnail;
      }

      // ======================================
      // 상단 책 정보
      // ======================================

      const detailCover = document.getElementById("detail-cover");

      if (detailCover) {
        detailCover.src = book.thumbnail;
      }

      const detailTitle = document.getElementById("detail-title");

      if (detailTitle) {
        detailTitle.textContent = book.title;
      }

      const detailAuthor = document.getElementById("detail-author");

      if (detailAuthor) {
        detailAuthor.textContent = book.authors.join(", ") + " 지음";
      }

      const detailDate = document.getElementById("detail-date");

      if (detailDate) {
        detailDate.textContent = formattedDate;
      }

      // ======================================
      // 책 소개
      // ======================================

      const description = document.getElementById("detail-description");

      if (description) {
        description.textContent = book.contents || "등록된 책 소개가 없습니다.";
      }

      // ======================================
      // 책 정보
      // ======================================

      const publisher = document.getElementById("info-publisher");

      if (publisher) {
        publisher.textContent = book.publisher || "-";
      }

      const publishDate = document.getElementById("info-publish-date");

      if (publishDate) {
        publishDate.textContent = formattedDate || "-";
      }

      const ebookDate = document.getElementById("info-ebook-date");

      if (ebookDate) {
        ebookDate.textContent = formattedDate || "-";
      }

      const isbn = document.getElementById("info-isbn");

      if (isbn) {
        isbn.textContent = book.isbn || "-";
      }

      // ======================================
      // 스크롤용 오른쪽 책 정보
      // ======================================

      const stickyTitle = document.getElementById("sticky-title");

      if (stickyTitle) {
        stickyTitle.textContent = book.title;
      }

      const stickyAuthor = document.getElementById("sticky-author");

      if (stickyAuthor) {
        stickyAuthor.textContent = book.authors.join(", ") + " 지음";
      }

      const stickyDate = document.getElementById("sticky-date");

      if (stickyDate) {
        stickyDate.textContent = formattedDate;
      }
    })

    .catch(function (error) {
      console.log("상세페이지 오류:", error);
    });
}

// ======================================
// 소설 분야 BEST
// ======================================

function loadGenreBestBooks() {
  fetch(
    "https://dapi.kakao.com/v3/search/book?query=" +
      encodeURIComponent("소설") +
      "&sort=accuracy&size=12",
    {
      method: "GET",

      headers: {
        Authorization: "KakaoAK dce5a0304a54362d38efe06cfa2ad9e4",
      },
    },
  )
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      const container = document.getElementById("genre-best-list");

      if (!container) {
        return;
      }

      container.innerHTML = "";

      const books = data.documents.filter(function (book) {
        return book.thumbnail !== "";
      });

      books.slice(0, 10).forEach(function (book) {
        container.innerHTML += `

          <article class="genre-best-card">

            <div class="genre-best-cover">

              <img
                src="${book.thumbnail}"
                alt="${book.title}"
              >

            </div>

            <h3>
              ${book.title}
            </h3>

            <p>
              ${book.authors.join(", ")}
            </p>

          </article>

        `;
      });
    })

    .catch(function (error) {
      console.log("소설 BEST 오류:", error);
    });
}

// ======================================
// 스크롤 시 오른쪽 책 정보 표시
// ======================================

const stickyBookCard = document.querySelector(".sticky-book-card");

const detailContent = document.querySelector(".detail-content-layout");

function checkStickyBook() {
  if (!stickyBookCard || !detailContent) {
    return;
  }

  const showPosition = detailContent.offsetTop - 120;

  if (window.scrollY >= showPosition) {
    stickyBookCard.classList.add("show");
  } else {
    stickyBookCard.classList.remove("show");
  }
}

window.addEventListener("scroll", checkStickyBook);

// ======================================
// 리뷰 더미 데이터
// ======================================

const reviewData = [
  {
    user: "fillow_0622_301",

    date: "2026.07.29",

    text: "작가님, 그동안 감사했습니다. 못 읽은 작품들 읽으면서 잊지 않을게요. 삼가 명복을 빕니다",

    like: 101,
  },

  {
    user: "지나당",

    date: "2026.07.30",

    text: "꼭 읽겠습니다 작가님 책보면 행복했습니다. 그곳에선 평안하십시오. 삼가고인의명복을빕니다",

    like: 46,
  },

  {
    user: "우유마카롱",

    date: "2026.07.29",

    text: "작가님 좋은 곳으로 가시기를 바랍니다",

    like: 39,
  },
];

// ======================================
// 리뷰 목록 출력
// ======================================

function loadReviews() {
  const reviewList = document.getElementById("review-list");

  if (!reviewList) {
    return;
  }

  reviewList.innerHTML = "";

  reviewData.forEach(function (review) {
    reviewList.innerHTML += `

        <article class="review-card">

          <div class="review-user-row">

            <div class="review-user-left">

              <div class="review-avatar">
                👤
              </div>

              <span class="review-user-name">
                ${review.user}
              </span>

            </div>


            <button class="review-dots">
              ⋮
            </button>

          </div>


          <div class="review-meta">

            <div class="review-stars-small">
              ★★★★★
            </div>

            <span class="review-date">
              ${review.date}
            </span>

          </div>


          <p class="review-text">
            ${review.text}
          </p>


          <div class="review-like">
            ♡ 좋아요 ${review.like}
          </div>

        </article>

      `;
  });
}

// ======================================
// 상세페이지 탭 스크롤 이동
// ======================================

const detailTabs = document.querySelectorAll(".detail-tab");

detailTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    // 버튼에 적어둔 이동할 곳 가져오기
    const targetId = tab.getAttribute("data-target");

    // 해당 id를 가진 영역 찾기
    const targetSection = document.getElementById(targetId);

    if (!targetSection) {
      return;
    }

    // 부드럽게 이동
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // 현재 선택된 탭 표시
    detailTabs.forEach(function (button) {
      button.classList.remove("active");
    });

    tab.classList.add("active");
  });
});

// ======================================
// 실행
// ======================================

loadBookDetail();

loadReviews();
loadGenreBestBooks();

checkStickyBook();
