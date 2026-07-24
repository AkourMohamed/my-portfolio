function initContactFab() {
  var fab = document.querySelector(".contact-fab");
  if (!fab) return;

  var toggle = fab.querySelector(".fab-main");
  if (!toggle) return;

  function close() {
    fab.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function toggleOpen() {
    var isOpen = fab.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleOpen();
  });

  document.addEventListener("click", function (e) {
    if (!fab.contains(e.target)) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactFab);
} else {
  initContactFab();
}
