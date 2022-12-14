const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light mode";
  } else {
    modeText.innerText = "Dark mode";
  }
});

function ShowAlert(url, title, message, method = "GET", icon1 = "question", icon2 = "success") {
  Swal.fire({
    title: `${message}`,
    icon: `${icon1}`,
    reverseButtons: true,
    showCancelButton: true,
    confirmButtonColor: "#",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "yes",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Done!", `${title}.`, `${icon2}`);
      setTimeout(() => {
        let form = document.createElement("form");
        form.action = `${url}`;
        form.method = `${method}`;
        document.body.append(form);
        form.submit();
      }, 2000);
    }
  });
}

function DeleteConfirm(id, item, title, successMessage) {
  Swal.fire({
    title: `${title}?`,
    text: "Once it has been deleted it cannot be recovered.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Delete",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", `${successMessage}.`, "success");

      setTimeout(() => {
        let form = document.createElement("form");
        form.action = `/delete-${item}/${id}`;
        form.method = "GET";
        document.body.append(form);
        form.submit();
      }, 2000);
    }
  });
}

function TDate() {
  var UserDate = document.getElementById("userdate").value;
  var ToDate = new Date();
  console.log(ToDate.toISOString());
  if (new Date(UserDate).toISOString() <= ToDate.toISOString()) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You must choose a date and time greater than the current one",
    });
    return false;
  }
  return true;
}

function Alert(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });
}

function Alert2(path, icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });
  setTimeout(() => {
    let form = document.createElement("form");
    form.action = path;
    form.method = "GET";
    document.body.append(form);
    form.submit();
  }, 2000);
}
