//註冊頁面
//綁 email，暱稱，密碼，再次輸入密碼，btn 的 Dom Tree
const emailTxtDom = document.querySelector(".email-signUp");
const nameTxtDom = document.querySelector(".name-signUp");
const pwdTxtDom = document.querySelector(".pwd-signUp");
const pwd2TxtDom = document.querySelector(".pwd-signUp2");
const signUpBtnDom = document.querySelector(".signup-btn");

signUpBtnDom.addEventListener("click", function (e) {
  emailTxtDom.classList.remove("red-border");
  pwdTxtDom.classList.remove("red-border");
  pwd2TxtDom.classList.remove("red-border");

  let isError = false;
  const gmailRight = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (pwdTxtDom.value !== pwd2TxtDom.value) {
    alert("密碼不一致");
    pwdTxtDom.classList.add("red-border");
    pwd2TxtDom.classList.add("red-border");
    isError = true;
  }

  if (!gmailRight.test(emailTxtDom.value) || emailTxtDom.value == "") {
    alert("信箱格式錯誤！");
    emailTxtDom.classList.add("red-border");
    isError = true;
  }

  if (pwdTxtDom.value.length < 6 || pwdTxtDom.value == "") {
    alert("密碼數必須大於6");
    pwdTxtDom.classList.add("red-border");
    pwd2TxtDom.classList.add("red-border");
    isError = true;
  }

  if (isError == true) {
    return;
  }

  axios
    .post("https://todoo.5xcamp.us/users", {
      user: {
        email: emailTxtDom.value,
        nickname: nameTxtDom.value,
        password: pwdTxtDom.value,
      },
    })
    .then(function (response) {
      const token = response.headers.authorization;

      localStorage.setItem("token", token);
      window.location.href = "index.html";
      emailTxtDom.value = "";
      nameTxtDom.value = "";
      pwdTxtDom.value = "";
      pwd2TxtDom.value = "";
    })
    .catch(function (error) {
      alert(error.response.data.error);
    });
});
