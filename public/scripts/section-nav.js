function initSectionNav() {
  var nav = document.querySelector(".section-nav");
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll("a[data-target]"));
  var indicator = nav.querySelector(".indicator");
  var sections = links
    .map(function (link) {
      return document.getElementById(link.dataset.target || "");
    })
    .filter(Boolean);

  function setActive(link) {
    links.forEach(function (l) {
      l.classList.remove("active", "peek");
    });
    link.classList.add("active");

    var index = links.indexOf(link);
    if (index > 0) links[index - 1].classList.add("peek");
    if (index < links.length - 1) links[index + 1].classList.add("peek");

    if (indicator) {
      indicator.style.transform = "translateY(" + link.offsetTop + "px)";
      indicator.style.height = link.offsetHeight + "px";
    }
  }

  // A short trailing section (e.g. Contact) can be pinned above the
  // IntersectionObserver's trigger band once the page hits max scroll, so
  // it never crosses into it on its own. Both the observer callback and the
  // scroll listener below funnel through this same check before deciding
  // what's active, so whichever one fires last still agrees on the answer
  // instead of racing to overwrite each other.
  function isAtBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  }

  if (links.length) setActive(links[0]);

  var observer = new IntersectionObserver(
    function (entries) {
      if (isAtBottom()) {
        setActive(links[links.length - 1]);
        return;
      }
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var link = links.find(function (l) {
            return l.dataset.target === entry.target.id;
          });
          if (link) setActive(link);
        }
      });
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0 },
  );
  sections.forEach(function (s) {
    observer.observe(s);
  });

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById(link.dataset.target || "");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var ticking = false;
  function checkBottom() {
    ticking = false;
    if (isAtBottom() && links.length) setActive(links[links.length - 1]);
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(checkBottom);
      }
    },
    { passive: true },
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSectionNav);
} else {
  initSectionNav();
}
