// ======================================
// INDEX 클릭 → DETAIL 페이지 이동
// ======================================

document.addEventListener("click", function (event) {
  // 슬라이드 화살표는 기존 기능 유지
  if (
    event.target.closest("#hero-prev") ||
    event.target.closest("#hero-next") ||
    event.target.closest("#coming-prev") ||
    event.target.closest("#coming-next") ||
    event.target.closest("#event-prev") ||
    event.target.closest("#event-next")
  ) {
    return;
  }

  // 실제 책을 클릭한 경우
  const book = event.target.closest("[data-book-title]");

  if (book) {
    event.preventDefault();

    const title = book.getAttribute("data-book-title");

    window.location.href = "./detail.html?title=" + title;

    return;
  }

  // 그 외 클릭 가능한 요소
  const clickable = event.target.closest(
    "a, button, .hero-slide, .quick-item, .life-book-box, .focus-banner, .editor-card, .event-card, .original-card",
  );

  if (!clickable) {
    return;
  }

  event.preventDefault();

  // 책 정보가 없는 메뉴/배너는 기본 detail 페이지
  window.location.href = "./detail.html";
});

// ======================================
// 일반 책 목록 불러오기
// ======================================

function loadBooks(keyword, elementId, count, sort = "accuracy") {
  searchBooks(keyword, count, sort)
    .then(function (data) {
      const container = document.getElementById(elementId);

      if (!container) {
        return;
      }

      container.innerHTML = "";

      // 책 개수에 따라 크기 다르게 적용
      container.className = "book-container count-" + count;

      data.documents.forEach(function (book) {
        let salePrice = book.sale_price;

        // 판매가가 없으면 정가 사용
        if (salePrice === -1) {
          salePrice = book.price;
        }

        container.innerHTML += `

        <div
  class="book-card"
  data-book-title="${encodeURIComponent(book.title)}"
>

          <div class="card-img">

            <img
              src="${book.thumbnail}"
              alt="${book.title}"
            >

          </div>


          <h3>
            ${book.title}
          </h3>


          <p class="author">
            ${book.authors.join(", ")}
          </p>


          <p class="publisher">
            ${book.publisher}
          </p>


          <p class="price">
            ${salePrice.toLocaleString()}원
          </p>

        </div>

      `;
      });
    })

    .catch(function (error) {
      console.log("책 목록 오류:", error);
    });
}

// ======================================
// 메인 HERO 슬라이드 데이터
// ======================================

const heroSlides = [
  {
    tag: "오늘의 발견",

    title: "지금 가장 주목받는<br>이야기를 만나보세요",

    description: "오늘 읽기 좋은 책을 추천해드려요.",

    books: ["프로젝트 헤일메리", "미드나잇 라이브러리", "불편한 편의점"],
  },

  {
    tag: "밀리 추천",

    title: "한 번 시작하면<br>멈출 수 없는 이야기",

    description: "독자들이 사랑한 소설을 만나보세요.",

    books: ["파친코", "아몬드", "달러구트 꿈 백화점"],
  },

  {
    tag: "오늘의 책",

    title: "나를 조금 더<br>성장시키는 시간",

    description: "지금 나에게 필요한 한 권.",

    books: ["미움받을 용기", "원씽", "역행자"],
  },

  {
    tag: "새로운 발견",

    title: "오늘 처음 만나는<br>새로운 세계",

    description: "새로운 취향을 발견해보세요.",

    books: ["데미안", "모순", "인간 실격"],
  },
];

// ======================================
// HERO 슬라이드 HTML 생성
// ======================================

function createHeroSlides() {
  const track = document.getElementById("hero-track");

  if (!track) {
    return;
  }

  track.innerHTML = "";

  heroSlides.forEach(function (slide, index) {
    track.innerHTML += `

      <div class="hero-slide">

        <div class="hero-left">

          <span class="hero-tag">
            ${slide.tag}
          </span>

          <h1>
            ${slide.title}
          </h1>

          <p>
            ${slide.description}
          </p>

          <button class="hero-btn">
            지금 읽어보기
          </button>

        </div>


        <div
          class="hero-books"
          id="hero-books-${index}"
        >
        </div>

      </div>

    `;
  });

  // ======================================
  // HERO 슬라이드 이동
  // ======================================

  let heroIndex = 0;
  let heroTimer;

  function showHeroSlide(index) {
    const track = document.getElementById("hero-track");

    const currentSlide = document.getElementById("current-slide");

    const totalSlide = document.getElementById("total-slide");

    if (!track) {
      return;
    }

    // 슬라이드 이동
    track.style.transform = `translateX(-${index * 100}%)`;

    // 현재 페이지
    if (currentSlide) {
      currentSlide.textContent = index + 1;
    }

    // 전체 페이지
    if (totalSlide) {
      totalSlide.textContent = heroSlides.length;
    }
  }

  // ======================================
  // 다음 슬라이드
  // ======================================

  function nextHeroSlide() {
    heroIndex++;

    if (heroIndex >= heroSlides.length) {
      heroIndex = 0;
    }

    showHeroSlide(heroIndex);
  }

  // ======================================
  // 이전 슬라이드
  // ======================================

  function prevHeroSlide() {
    heroIndex--;

    if (heroIndex < 0) {
      heroIndex = heroSlides.length - 1;
    }

    showHeroSlide(heroIndex);
  }

  // ======================================
  // 자동 슬라이드
  // ======================================

  const heroNextButton = document.getElementById("hero-next");

  let heroAutoTimer;

  function startHeroAuto() {
    // 기존 타이머가 있으면 제거
    clearInterval(heroAutoTimer);

    // 4초마다 다음 버튼 클릭
    heroAutoTimer = setInterval(function () {
      if (heroNextButton) {
        heroNextButton.click();
      }
    }, 4000);
  }

  // 자동 슬라이드 시작
  startHeroAuto();

  // ======================================
  // HERO 버튼
  // ======================================

  const heroPrev = document.getElementById("hero-prev");

  const heroNext = document.getElementById("hero-next");

  if (heroPrev) {
    heroPrev.addEventListener("click", function () {
      prevHeroSlide();

      // 수동 클릭 후 자동 타이머 다시 시작
      startHeroAuto();
    });
  }

  if (heroNext) {
    heroNext.addEventListener("click", function () {
      nextHeroSlide();

      startHeroAuto();
    });
  }

  // 각 슬라이드 책 불러오기
  heroSlides.forEach(function (slide, index) {
    loadSlideBooks(slide.books, index);
  });
}

// ======================================
// HERO 슬라이드 책 API
// ======================================

function loadSlideBooks(titles, slideIndex) {
  const container = document.getElementById("hero-books-" + slideIndex);

  if (!container) {
    return;
  }

  titles.forEach(function (title) {
    searchBooks(title, 1, "accuracy", "title")
      .then(function (data) {
        if (data.documents.length === 0) {
          return;
        }

        const book = data.documents[0];

        container.innerHTML += `

        <div class="hero-book">

          <img
            src="${book.thumbnail}"
            alt="${book.title}"
          >

        </div>

      `;
      })

      .catch(function (error) {
        console.log("배너 책 오류:", error);
      });
  });
}

// ======================================
// 오늘의 인생책
// ======================================

function loadLifeBook(title) {
  searchBooks(title, 1, "accuracy", "title")
    .then(function (data) {
      if (data.documents.length === 0) {
        return;
      }

      const book = data.documents[0];

      const container = document.getElementById("life-book-content");

      if (!container) {
        return;
      }

      container.innerHTML = `

      <div class="life-cover-box">

        <img
          src="${book.thumbnail}"
          alt="${book.title}"
        >

      </div>


      <div class="life-review">

        <div class="life-profile">

          <h3>
            밀리 회원의 인생책
          </h3>

          <span>
            ${book.title}
            ·
            ${book.authors.join(", ")}
          </span>

        </div>


        <div class="life-quote-mark">
          “
        </div>


        <p class="life-description">

          ${book.contents || "이 책에 대한 소개가 준비되어 있지 않습니다."}

        </p>


        <hr>


        <div class="life-points">

          <p>
            <span>✓</span>
            오래 기억하고 싶은 한 권
          </p>

          <p>
            <span>✓</span>
            새로운 생각을 발견하는 시간
          </p>

        </div>

      </div>

    `;
    })

    .catch(function (error) {
      console.log("인생책 오류:", error);
    });
}

// ======================================
// 밀리가 주목한 책
// ======================================

function loadFocusBooks(keyword, elementId) {
  searchBooks(keyword, 10, "accuracy")
    .then(function (data) {
      const container = document.getElementById(elementId);

      if (!container) {
        return;
      }

      container.innerHTML = "";

      // 표지가 있는 책만 골라냄
      const books = data.documents.filter(function (book) {
        return book.thumbnail !== "";
      });

      // 딱 2권만 출력
      books.slice(0, 2).forEach(function (book) {
        container.innerHTML += `

        <div
  class="mini-book"
  data-book-title="${encodeURIComponent(book.title)}"
>

          <img
            src="${book.thumbnail}"
            alt="${book.title}"
          >


          <div class="mini-info">

            <h4>
              ${book.title}
            </h4>

            <p>
              ${book.authors.join(", ")}
            </p>

          </div>


          <button class="mini-add">
            ＋ 담기
          </button>

        </div>

      `;
      });
    })

    .catch(function (error) {
      console.log("주목한 책 오류:", error);
    });
}

// ======================================
// 밀리 랭킹
// ======================================

function loadRankingBooks(keyword) {
  searchBooks(keyword, 30, "accuracy")
    .then(function (data) {
      const rankingList = document.getElementById("ranking-list");

      if (!rankingList) {
        return;
      }

      rankingList.innerHTML = "";

      // 표지가 있는 책만 사용
      const books = data.documents.filter(function (book) {
        return book.thumbnail !== "";
      });

      // 12권만 출력
      books.slice(0, 12).forEach(function (book, index) {
        rankingList.innerHTML += `

          <div
  class="ranking-book"
  data-book-title="${encodeURIComponent(book.title)}"
>

            <div class="ranking-number">
              ${index + 1}
            </div>


            <div class="ranking-cover">

              <img
                src="${book.thumbnail}"
                alt="${book.title}"
              >

            </div>


            <div class="ranking-book-info">

              <h3>
                ${book.title}
              </h3>

              <p>
                ${book.authors.join(", ")}
              </p>

            </div>

          </div>

        `;
      });
    })

    .catch(function (error) {
      console.log("랭킹 오류:", error);
    });
}

// ======================================
// 밀리 랭킹 카테고리 버튼
// ======================================

const rankingTabs = document.querySelectorAll(".ranking-tab");

rankingTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    rankingTabs.forEach(function (button) {
      button.classList.remove("active");
    });

    tab.classList.add("active");

    const keyword = tab.getAttribute("data-query");

    loadRankingBooks(keyword);
  });
});

// ======================================
// 랭킹 날짜
// ======================================

const rankingDate = document.getElementById("ranking-date");

if (rankingDate) {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  rankingDate.textContent = year + "." + month + "." + day;
}

// ======================================
// 요즘 책 뭐 봄? 데이터
// ======================================

const editorBooks = [
  {
    category: "에디터의 선택",

    title: "에디터는 다시 태어난 것만 같아요 이 책을 만나고부터",

    bookTitle: "아몬드",
  },

  {
    category: "밀리로그",

    title: "이런 일인줄 몰랐어요! 요즘 가장 눈에 들어온 한 권",

    bookTitle: "불편한 편의점",
  },

  {
    category: "지금 읽을 책",

    title: "한 번 시작하면 빠져드는 이야기, 이번 주 추천책",

    bookTitle: "프로젝트 헤일메리",
  },

  {
    category: "밀리레터",

    title: "아무것도 하지 않아도 괜찮은 하루를 위한 책",

    bookTitle: "모순",
  },

  {
    category: "지금 읽을 책",

    title: "하루 15분씩 읽으며 내 마음을 알아보는 법",

    bookTitle: "미움받을 용기",
  },
];

// ======================================
// 요즘 책 뭐 봄? 불러오기
// ======================================

function loadEditorBooks() {
  const container = document.getElementById("editor-container");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  editorBooks.forEach(function (item, index) {
    searchBooks(item.bookTitle, 1, "accuracy", "title").then(function (data) {
      if (data.documents.length === 0) {
        return;
      }

      const book = data.documents[0];

      container.innerHTML += `

        <article class="editor-card">

          <div
            class="
              editor-image
              editor-color-${index + 1}
            "
          >

            <img
              src="${book.thumbnail}"
              alt="${book.title}"
            >

          </div>


          <span class="editor-category">
            ${item.category}
          </span>


          <h3>
            ${item.title}
          </h3>

        </article>

      `;
    });
  });
}

// ======================================
// 에디터 카드 옆으로 이동
// ======================================

const editorNext = document.getElementById("editor-next");

if (editorNext) {
  editorNext.addEventListener("click", function () {
    const container = document.getElementById("editor-container");

    container.scrollBy({
      left: 580,
      behavior: "smooth",
    });
  });
}
// ======================================
// 새로 들어온 책
// ======================================

function loadNewBooks(keyword) {
  searchBooks(keyword, 15, "accuracy", "title")
    .then(function (data) {
      const container = document.getElementById("newbook-list");

      if (!container) {
        return;
      }

      container.innerHTML = "";

      // 표지 있는 책만
      const books = data.documents.filter(function (book) {
        return book.thumbnail !== "";
      });

      if (books.length === 0) {
        return;
      }

      // ==================================
      // 첫 번째 책 크게
      // ==================================

      const firstBook = books[0];

      container.innerHTML += `

     <div
  class="newbook-feature"
  data-book-title="${encodeURIComponent(firstBook.title)}"
>

        <div class="newbook-feature-top">

          <img
            src="${firstBook.thumbnail}"
            alt="${firstBook.title}"
          >


          <div class="newbook-feature-info">

            <h3>
              ${firstBook.title}
            </h3>

            <p>
              ${firstBook.authors.join(", ")}
            </p>

          </div>

        </div>


        <div class="newbook-feature-bottom">

          <h4>
            새롭게 만나는 오늘의 책
          </h4>

          <p>
            지금 막 도착한 신간을 만나보세요.
          </p>

        </div>

      </div>

    `;

      // ==================================
      // 나머지 책
      // ==================================

      books.slice(1, 8).forEach(function (book) {
        container.innerHTML += `

        <div class="newbook-card">

          <div class="newbook-cover">

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

        </div>

      `;
      });
    })

    .catch(function (error) {
      console.log("새로 들어온 책 오류:", error);
    });
}
// ======================================
// 새로 들어온 책 카테고리
// ======================================

const newbookTabs = document.querySelectorAll(".newbook-tab");

newbookTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    newbookTabs.forEach(function (button) {
      button.classList.remove("active");
    });

    tab.classList.add("active");

    const keyword = tab.getAttribute("data-query");

    loadNewBooks(keyword);
  });
});
// ======================================
// 커밍순 책 데이터
// ======================================

const comingBooks = [
  {
    bookTitle: "프로젝트 헤일메리",
    date: "9.4 공개",
    description: "드디어 만나는 화제의 작품, 가장 먼저 만나보세요.",
  },

  {
    bookTitle: "아몬드",
    date: "9.6 공개",
    description: "오랫동안 사랑받은 이야기의 감동을 다시 만나보세요.",
  },

  {
    bookTitle: "파친코",
    date: "9.8 공개",
    description: "기다려온 이야기, 이제 밀리에서 만나보세요.",
  },

  {
    bookTitle: "모순",
    date: "9.10 공개",
    description: "마음을 오래 머물게 하는 이야기.",
  },

  {
    bookTitle: "불편한 편의점",
    date: "9.12 공개",
    description: "일상의 따뜻함을 발견하게 되는 특별한 한 권.",
  },

  {
    bookTitle: "데미안",
    date: "9.15 공개",
    description: "오랫동안 사랑받아온 고전을 새롭게 만나보세요.",
  },

  {
    bookTitle: "미움받을 용기",
    date: "9.18 공개",
    description: "내 삶을 바라보는 새로운 시선을 만나보세요.",
  },

  {
    bookTitle: "인간 실격",
    date: "9.20 공개",
    description: "지금 다시 읽어도 강렬한 고전의 이야기.",
  },
];
// ======================================
// 커밍순 책 불러오기
// ======================================

function loadComingBooks() {
  const track = document.getElementById("coming-track");

  if (!track) {
    return;
  }

  track.innerHTML = "";

  comingBooks.forEach(function (item) {
    searchBooks(item.bookTitle, 1, "accuracy", "title").then(function (data) {
      if (data.documents.length === 0) {
        return;
      }

      const book = data.documents[0];

      track.innerHTML += `

        <div
  class="coming-card"
  data-book-title="${encodeURIComponent(book.title)}"
>

          <div class="coming-book-top">

            <div class="coming-cover">

              <img
                src="${book.thumbnail}"
                alt="${book.title}"
              >

            </div>


            <div class="coming-info">

              <h3>
                ${book.title}
              </h3>

              <p>
                ${book.authors.join(", ")}
              </p>

              <span class="coming-date">
                ${item.date}
              </span>

            </div>

          </div>


          <div class="coming-bottom">

            <p class="coming-description">
              ${item.description}
            </p>

            <button class="coming-notice">
              ♧ 알림 받기
            </button>

          </div>

        </div>

      `;
    });
  });
}
// ======================================
// 커밍순 슬라이더
// ======================================

let comingPosition = 0;

const comingPrev = document.getElementById("coming-prev");

const comingNext = document.getElementById("coming-next");

function moveComingSlider() {
  const track = document.getElementById("coming-track");

  const cardWidth = 289;

  track.style.transform = "translateX(-" + comingPosition * cardWidth + "px)";
}

// 다음

if (comingNext) {
  comingNext.addEventListener("click", function () {
    // 8개 중 약 4~5개가 화면에 보임
    const maxPosition = Math.max(0, comingBooks.length - 4);

    if (comingPosition < maxPosition) {
      comingPosition++;
    } else {
      // 마지막이면 처음으로
      comingPosition = 0;
    }

    moveComingSlider();
  });
}

// 이전

if (comingPrev) {
  comingPrev.addEventListener("click", function () {
    const maxPosition = Math.max(0, comingBooks.length - 4);

    if (comingPosition > 0) {
      comingPosition--;
    } else {
      comingPosition = maxPosition;
    }

    moveComingSlider();
  });
}

// ======================================
// AI와 함께 읽기 데이터
// ======================================

const aiBooks = [
  {
    question: "내가 원하는 삶을 위해 가장 먼저 바꿔야 할 것은?",

    bookTitle: "미움받을 용기",
  },

  {
    question: "지금보다 더 성장하려면 무엇에 집중해야 할까?",

    bookTitle: "원씽",
  },

  {
    question: "작은 습관이 어떻게 인생을 바꿀 수 있을까?",

    bookTitle: "아주 작은 습관의 힘",
  },

  {
    question: "돈을 잘 다루는 사람은 무엇이 다를까?",

    bookTitle: "돈의 심리학",
  },

  {
    question: "지금의 나를 넘어서는 방법은 무엇일까?",

    bookTitle: "역행자",
  },
];

// ======================================
// AI 책 불러오기
// ======================================

function loadAiBooks() {
  const track = document.getElementById("ai-track");

  if (!track) {
    return;
  }

  track.innerHTML = "";

  // 먼저 카드 자리부터 순서대로 생성
  aiBooks.forEach(function (item, index) {
    track.innerHTML += `

      <article
        class="
          ai-card
          ai-color-${index + 1}
        "
      >

        <div class="ai-label">
          ✦ 이 책의 질문
        </div>


        <h3 class="ai-question">
          ${item.question}
        </h3>


        <div
          class="ai-cover"
          id="ai-cover-${index}"
        >
        </div>


        <button class="ai-read-btn">
          ✦ AI와 함께 읽기
        </button>

      </article>

    `;
  });

  // 각 카드에 API 표지 넣기
  aiBooks.forEach(function (item, index) {
    searchBooks(item.bookTitle, 1, "accuracy", "title")
      .then(function (data) {
        if (data.documents.length === 0) {
          return;
        }

        const book = data.documents[0];

        const cover = document.getElementById("ai-cover-" + index);

        if (!cover) {
          return;
        }

        cover.innerHTML = `

        <img
          src="${book.thumbnail}"
          alt="${book.title}"
        >

      `;
      })

      .catch(function (error) {
        console.log("AI 책 오류:", error);
      });
  });
}

// ======================================
// AI 슬라이더
// ======================================

let aiPosition = 0;

const aiNext = document.getElementById("ai-next");

if (aiNext) {
  aiNext.addEventListener("click", function () {
    const track = document.getElementById("ai-track");

    // 카드 280 + gap 14
    const moveWidth = 294;

    aiPosition++;

    // 마지막까지 갔으면 처음으로
    if (aiPosition >= aiBooks.length) {
      aiPosition = 0;
    }

    track.style.transform = "translateX(-" + aiPosition * moveWidth + "px)";
  });
}

// ======================================
// 이벤트 슬라이더
// 배너 6개 / 한 화면 2개 / 총 3페이지
// 자동 슬라이드 + 좌우 버튼 + 점 클릭
// ======================================

const eventTrack = document.getElementById("event-track");

const eventPrev = document.getElementById("event-prev");

const eventNext = document.getElementById("event-next");

const eventDots = document.getElementById("event-dots");

// 현재 페이지
let eventPage = 0;

// 한 화면에 보이는 카드 수
const cardsPerPage = 2;

// 실제 HTML에 있는 이벤트 카드 개수
const totalEventCards = document.querySelectorAll(".event-card").length;

// 총 페이지 수
// 카드 6개 ÷ 한 페이지 2개 = 3페이지
const eventTotalPages = Math.ceil(totalEventCards / cardsPerPage);

// ======================================
// 아래 점 만들기
// ======================================

function createEventDots() {
  if (!eventDots) {
    return;
  }

  eventDots.innerHTML = "";

  for (let i = 0; i < eventTotalPages; i++) {
    eventDots.innerHTML += `

      <button
        class="event-dot ${i === 0 ? "active" : ""}"
        data-page="${i}"
      >
      </button>

    `;
  }

  // 점 클릭 기능
  const dots = document.querySelectorAll(".event-dot");

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      eventPage = Number(dot.getAttribute("data-page"));

      moveEventSlider();

      restartEventAuto();
    });
  });
}

// ======================================
// 슬라이드 이동
// ======================================

function moveEventSlider() {
  if (!eventTrack) {
    return;
  }

  const firstCard = eventTrack.querySelector(".event-card");

  if (!firstCard) {
    return;
  }

  // CSS의 카드 사이 gap
  const gap = 16;

  // 카드 2개 + 사이 간격만큼 한 번에 이동
  const pageWidth = (firstCard.offsetWidth + gap) * cardsPerPage;

  eventTrack.style.transform = "translateX(-" + eventPage * pageWidth + "px)";

  // 현재 페이지 점 변경
  const dots = document.querySelectorAll(".event-dot");

  dots.forEach(function (dot, index) {
    dot.classList.toggle("active", index === eventPage);
  });
}

// ======================================
// 다음 버튼
// ======================================

if (eventNext) {
  eventNext.addEventListener("click", function () {
    eventPage++;

    // 마지막 페이지 다음은 다시 첫 페이지
    if (eventPage >= eventTotalPages) {
      eventPage = 0;
    }

    moveEventSlider();

    // 수동으로 눌렀으니 자동 타이머 다시 시작
    restartEventAuto();
  });
}

// ======================================
// 이전 버튼
// ======================================

if (eventPrev) {
  eventPrev.addEventListener("click", function () {
    eventPage--;

    // 첫 페이지에서 이전 누르면 마지막 페이지
    if (eventPage < 0) {
      eventPage = eventTotalPages - 1;
    }

    moveEventSlider();

    restartEventAuto();
  });
}

// ======================================
// 자동 슬라이드
// ======================================

let eventAuto;

function startEventAuto() {
  eventAuto = setInterval(function () {
    eventPage++;

    if (eventPage >= eventTotalPages) {
      eventPage = 0;
    }

    moveEventSlider();
  }, 4000);
}

// ======================================
// 수동 조작 후 자동 슬라이드 다시 시작
// ======================================

function restartEventAuto() {
  clearInterval(eventAuto);

  startEventAuto();
}

// ======================================
// 실행
// ======================================

createEventDots();

moveEventSlider();

startEventAuto();

// ======================================
// 사이트 실행
// ======================================

// HERO
createHeroSlides();

// 오늘의 인생책
loadLifeBook("모네, 빛의 순간들");

// 밀리가 주목한 책
loadFocusBooks("추리소설", "focus-books-1");

loadFocusBooks("신간소설", "focus-books-2");

loadFocusBooks("미스터리", "focus-books-3");

loadFocusBooks("자기계발", "focus-books-4");

loadFocusBooks("고전소설", "focus-books-5");

// 밀리 랭킹
loadRankingBooks("소설");

// 일반 책 섹션

loadEditorBooks();
loadNewBooks("소설");
loadComingBooks();
loadAiBooks();
