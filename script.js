// HUNTER COACHING — shared behaviour

(function () {
  "use strict";

  /* ---------- land at the top of a freshly opened page ---------- */
  if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }
  if (!location.hash) { window.scrollTo(0, 0); }
  window.addEventListener("pageshow", function (e) {
    if (!location.hash) { window.scrollTo(0, 0); }
  });

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  var menuClose = document.querySelector(".mm-close");

  function openMenu() {
    if (!menu) return;
    menu.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (toggle) toggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menu) {
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- mark current nav link ---------- */
  var here = (document.body.getAttribute("data-page") || "").trim();
  if (here) {
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === here) a.classList.add("active");
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- FAQ accordion: only one open at a time per group ---------- */
  document.querySelectorAll(".faq-list").forEach(function (list) {
    var items = list.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  });

  /* ---------- contact form: build a prefilled mailto (no backend) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");

      var required = form.querySelectorAll("[required]");
      var ok = true;
      required.forEach(function (field) {
        var invalid =
          field.type === "checkbox" ? !field.checked : !field.value.trim();
        field.style.borderColor = invalid ? "#c98b8b" : "";
        if (invalid) ok = false;
      });
      if (!ok) {
        if (status) {
          status.textContent = "Bitte fülle alle Pflichtfelder aus, bevor du deine Anfrage sendest.";
          status.classList.add("show");
        }
        return;
      }

      var data = new FormData(form);
      var lines = [
        "Name: " + data.get("name"),
        "Telefon: " + data.get("phone"),
        "E-Mail: " + data.get("email"),
        "",
        "Ziel: " + data.get("goal"),
        "Aktueller Trainingsstand: " + data.get("level"),
        "Aufmerksam geworden durch: " + data.get("source"),
        "Warum jetzt starten: " + data.get("why"),
        "Bereit für konsequente Mitarbeit: " + data.get("ready"),
        "",
        "Bestätigt: Ich bin bereit, meinen Teil beizutragen, meinen Trainings- und Ernährungsplan konsequent umzusetzen und aktiv an meinem Fortschritt zu arbeiten."
      ];
      var subject = encodeURIComponent("Coaching-Anfrage — " + data.get("name"));
      var body = encodeURIComponent(lines.join("\n"));
      var mailto = "mailto:steven007w@outlook.com?subject=" + subject + "&body=" + body;

      if (status) {
        status.textContent = "Dein E-Mail-Programm öffnet sich mit deiner ausgefüllten Anfrage — einfach senden.";
        status.classList.add("show");
      }
      window.location.href = mailto;
    });
  }
})();
