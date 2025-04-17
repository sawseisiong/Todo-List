//登入頁面
//綁 email，密碼，按鈕 的 Dom Tree
const emailTxtDom = document.querySelector(".email-login");
const pwdTxtDom = document.querySelector(".pwd-login");
const loginBtnDom = document.querySelector(".login-btn");
const redFontDom = document.querySelector(".red-font");

//輸入 email 和 密碼，傳輸個資物件給後端

emailTxtDom.addEventListener("input", function () {
  redFontDom.classList.add("hidden");
  if (emailTxtDom.value.length == 0) {
    redFontDom.classList.remove("hidden");
  }
});

loginBtnDom.addEventListener("click", function (e) {
  let isError = false;
  emailTxtDom.classList.remove("red-border");
  const gmailRight = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRight.test(emailTxtDom.value) || emailTxtDom.value == "") {
    alert("信箱格式錯誤！");
    emailTxtDom.classList.add("red-border");
    isError = true;
  }
  if (pwdTxtDom.value.length < 6 || pwdTxtDom.value == "") {
    alert("密碼數必須大於6");
    pwdTxtDom.classList.add("red-border");
    isError = true;
  }

  if (isError == true) {
    return;
  }
  axios
    .post("https://todoo.5xcamp.us/users/sign_in", {
      user: {
        email: emailTxtDom.value,
        password: pwdTxtDom.value,
      },
    })
    .then(function (response) {
      const token = response.headers.authorization;

      localStorage.setItem("token", token);
      window.location.href = "todo.html";
    })
    .catch(function (error) {
      alert("帳號或密碼錯誤！");
    });
});
