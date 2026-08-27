function loadComponent(elementId, filePath) {
  fetch(filePath)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(filePath + " 파일을 찾을 수 없습니다.");
      }

      return response.text();
    })

    .then(function (html) {
      const element = document.getElementById(elementId);

      if (!element) {
        return;
      }

      element.innerHTML = html;
      function loadComponent(elementId, filePath) {
        fetch(filePath)
          .then(function (response) {
            return response.text();
          })

          .then(function (html) {
            const element = document.getElementById(elementId);

            if (!element) {
              return;
            }

            element.innerHTML = html;

            // detail 페이지에서는 두 번째 메뉴 제거
            if (
              elementId === "header" &&
              window.location.pathname.includes("detail.html")
            ) {
              const subHeader = element.querySelector(".sub-header");

              if (subHeader) {
                subHeader.remove();
              }
            }
          })

          .catch(function (error) {
            console.log("컴포넌트 로딩 오류:", error);
          });
      }

      loadComponent("header", "./components/header.html");

      loadComponent("footer", "./components/footer.html");
    })

    .catch(function (error) {
      console.log("컴포넌트 로딩 오류:", error);
    });
}

loadComponent("header", "./components/header.html");

loadComponent("footer", "./components/footer.html");
