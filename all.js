const token = localStorage.getItem("token");

axios.defaults.headers.common["Authorization"] = token;

const todoDom = document.querySelector(".todo");
const emptyTxTDom = document.querySelector(".empty-text");
const emptyImgDom = document.querySelector(".empty-img");

function emptyAdd() {
  console.log("111");
  emptyTxTDom.classList.add("hidden");
  emptyImgDom.classList.add("hidden");
}

function emptyRemove() {
  emptyTxTDom.classList.remove("hidden");
  emptyImgDom.classList.remove("hidden");
}

function emptyTodo() {
  axios
    .get("https://todoo.5xcamp.us/todos", {})
    .then(function (res) {
      let todoList = res.data.todos;
      if (todoList.length >= 1) {
        emptyAdd();
      } else if (todoList.length == 0) {
        todoDom.classList.add("hidden");
        emptyRemove();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
emptyTodo();

//渲染代辦事項到網頁上
const listDom = document.querySelector(".todo-list");
function randerAll() {
  axios
    .get("https://todoo.5xcamp.us/todos", {})
    .then(function (res) {
      let todos = res.data.todos;

      let str = "";
      listDom.innerHTML = "";
      todos.forEach(function (item) {
        str = `<li class="todo-box">
              <div class="todo-item">
                <input data-id='${item.id}' ${
          item.completed_at ? "checked" : ""
        } type="checkbox" class="check" />
                <div class="content">${item.content}</div>
              </div>
              <div data-id='${item.id}' class="delete"></div>
            </li>`;
        listDom.innerHTML += str;
        todoCount();
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

randerAll();

//後端回傳格式
// "todos": [
//   {
//     "id": "81261d189d5004b7b4b97c4a9ca6c0b3",
//     "content": "11111",
//     "completed_at": null
//   }

//如果尚無代辦 則隱藏代辦欄位

//輸入代辦事項
const textDom = document.querySelector(".text");
const addDom = document.querySelector(".add");

addDom.addEventListener("click", function (e) {
  if (textDom.value == "") {
    return;
  }
  todoDom.classList.remove("hidden");
  emptyAdd();

  axios
    .post("https://todoo.5xcamp.us/todos", {
      todo: {
        content: textDom.value,
      },
    })
    .then(function (response) {
      randerAll();
      todoCount();
      textDom.value = "";
    })
    .catch(function (error) {
      alert(error.response.data.error);
    });
});

//刪除代辦
const deleteDom = document.querySelectorAll(".delete");
const todoListDom = document.querySelector(".todo-list");
todoListDom.addEventListener("click", function (e) {
  if (e.target.getAttribute("class") == "delete") {
    const todoId = e.target.dataset.id;
    axios
      .delete(`https://todoo.5xcamp.us/todos/${todoId}`, {})
      .then(function (res) {
        randerAll();
        console.log("刪除成功", res.data);
      })
      .catch(function (error) {
        console.log("刪除失敗", error.response);
      });

    todoCount();
  }
});

//打勾代辦，把 completed_at 新增進去
document.addEventListener("change", function (e) {
  if (e.target.classList.contains("check")) {
    const todoId = e.target.dataset.id;
    axios
      .patch(`https://todoo.5xcamp.us/todos/${todoId}/toggle`, {})
      .then(function (res) {
        todoCount();
      })
      .catch(function (error) {
        console.log("更新失敗:", error.response);
      });
  }
});

//判斷陣列裡 completed_at 有值則刪除
const deleteAllDom = document.querySelector(".todo-clear");
deleteAllDom.addEventListener("click", function (e) {
  axios
    .get("https://todoo.5xcamp.us/todos", {})
    .then(function (res) {
      let todoList = res.data.todos;
      if (todoList.length == 0) {
        todoDom.classList.add("hidden");
        emptyRemove();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  axios
    .get("https://todoo.5xcamp.us/todos", {})
    .then(function (res) {
      console.log(res);
      let todoArr = res.data.todos;
      let todoIds = todoArr.filter(function (item) {
        return item.completed_at !== null;
      });
      todoIds.forEach(function (item) {
        axios
          .delete(`https://todoo.5xcamp.us/todos/${item.id}`, {})
          .then(function (res) {
            randerAll();
            console.log("刪除成功", res.data);
          })
          .catch(function (error) {
            console.log("刪除失敗", error.response);
          });

        todoCount();
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

//新增 i 待完成事項 //`${i} 個待完成項目`
function todoCount() {
  axios
    .get("https://todoo.5xcamp.us/todos", {})
    .then(function (res) {
      const todos = res.data.todos;
      let noDoneList = todos.filter(function (item) {
        return item.completed_at == null;
      });

      const todoCountDom = document.querySelector(".todo-count");
      todoCountDom.innerHTML = `${noDoneList.length} 個待完成項目`;
    })
    .catch(function (error) {
      console.log(error);
    });
}

//「待完成」function
function randerNoDone() {
  axios
    .get("https://todoo.5xcamp.us/todos", {})
    .then(function (res) {
      let todos = res.data.todos;
      let todosNoDone = todos.filter(function (item) {
        return item.completed_at == null;
      });
      let str = "";
      listDom.innerHTML = "";
      todosNoDone.forEach(function (item) {
        str = `<li class="todo-box">
              <div class="todo-item">
                <input data-id='${item.id}' ${
          item.completed_at ? "checked" : ""
        } type="checkbox" class="check" />
                <div class="content">${item.content}</div>
              </div>
              <div data-id='${item.id}' class="delete"></div>
            </li>`;
        listDom.innerHTML += str;
        todoCount();
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

//「已完成」function
function randerisDone() {
  axios
    .get("https://todoo.5xcamp.us/todos", {})
    .then(function (res) {
      let todos = res.data.todos;
      let todosNoDone = todos.filter(function (item) {
        return item.completed_at !== null;
      });
      let str = "";
      listDom.innerHTML = "";
      todosNoDone.forEach(function (item) {
        str = `<li class="todo-box">
              <div class="todo-item">
                <input data-id='${item.id}' ${
          item.completed_at ? "checked" : ""
        } type="checkbox" class="check" />
                <div class="content">${item.content}</div>
              </div>
              <div data-id='${item.id}' class="delete"></div>
            </li>`;
        listDom.innerHTML += str;
        todoCount();
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

//切換「全部」，「待完成」，「已完成」
const tabManu = document.querySelector(".tab-manu");
const tabAllDom = document.querySelector(".tab-all");
const tabNoDoneDom = document.querySelector(".tab-nodone");
const tabIsDoneDom = document.querySelector(".tab-isdone");

tabManu.addEventListener("click", function (e) {
  //「全部」
  if (e.target.matches(".tab-all")) {
    tabNoDoneDom.classList.remove("active");
    tabIsDoneDom.classList.remove("active");
    tabAllDom.classList.add("active");
    listDom.innerHTML = "";
    randerAll();
  }
  //「待完成」
  if (e.target.matches(".tab-nodone")) {
    tabAllDom.classList.remove("active");
    tabIsDoneDom.classList.remove("active");
    tabNoDoneDom.classList.add("active");
    listDom.innerHTML = "";
    randerNoDone();
  }
  //「已完成」
  if (e.target.matches(".tab-isdone")) {
    tabAllDom.classList.remove("active");
    tabNoDoneDom.classList.remove("active");
    tabIsDoneDom.classList.add("active");
    listDom.innerHTML = "";
    randerisDone();
  }
});

//更新 header 用戶名字
const userNameDom = document.querySelector(".user-name");
function addName() {
  axios
    .post("https://todoo.5xcamp.us/users/sign_in", {})
    .then(function (res) {
      const userNmae = res.data.nickname;
      userNameDom.innerHTML = `${userNmae} 的代辦`;
    })
    .catch(function (error) {
      console.log(error);
    });
}
addName();

//登出 功能
const logOutDom = document.querySelector(".logout");
logOutDom.addEventListener("click", function () {
  axios
    .delete("https://todoo.5xcamp.us/users/sign_out", {})
    .then(function (res) {
      window.location.href = "login.html";
    })
    .catch(function (error) {
      console.log(error);
    });
});
