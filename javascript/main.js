// navigation menu

(() => {
  const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

  hamburgerBtn.addEventListener("click", showNavMenu);
  closeNavBtn.addEventListener("click", hideNavMenu);

  function showNavMenu() {
    navMenu.classList.add("open");
    bodyScrollignToggle();
  }
  function hideNavMenu() {
    navMenu.classList.remove("open");
    fadeOutEffect();
    bodyScrollignToggle();
  }
  function fadeOutEffect() {
    document.querySelector(".fade-out-effect").classList.add("active");
    setTimeout(() => {
      document.querySelector(".fade-out-effect").classList.remove("active");
    }, 300);
  }

  // attach an event handler to document
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("link-item")) {
      // make sure event.target.hash has a value before overridding default dehavior

      if (event.target.hash !== "") {
        // prevent default anchor click behavior

        event.preventDefault();
        const hash = event.target.hash;

        // deactivate existing active section

        document.querySelector(".section.active").classList.add("hide");
        document.querySelector(".section.active").classList.remove("active");

        // activate new section

        document.querySelector(hash).classList.add("active");
        document.querySelector(hash).classList.remove("hide");

        // deactivate existing navigation menu

        navMenu
          .querySelector(".active")
          .classList.add("hover-in-shadow", "outer-shadow");
        navMenu
          .querySelector(".active")
          .classList.remove("inner-shadow", "active");

        // if clicked linkitem is contained within the navigation menu

        if (navMenu.classList.contains("open")) {
          // activate new navigation menu

          event.target.classList.add("active", "inner-shadow");
          event.target.classList.remove("outer-shadow", "hover-in-shadow");

          // hide navigation menu
          hideNavMenu();
        } else {
          let navItems = navMenu.querySelectorAll(".link-item");
          navItems.forEach((item) => {
            if (hash === item.hash) {
              // activate new navigation menu

              item.classList.add("active", "inner-shadow");
              item.classList.remove("outer-shadow", "hover-in-shadow");
            }
          });
          fadeOutEffect();
        }
        // add hash (#) to url

        window.location.hash = hash;
      }
    }
  });
})();

// about section tabs

(() => {
  const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

  tabsContainer.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("tab-item") &&
      !event.target.classList.contains("active")
    ) {
      const target = event.target.getAttribute("data-target");

      tabsContainer
        .querySelector(".active")
        .classList.remove("outer-shadow", "active");

      event.target.classList.add("active", "outer-shadow");

      aboutSection
        .querySelector(".tab-content.active")
        .classList.remove("active");

      aboutSection.querySelector(target).classList.add("active");
    }
  });
})();

function bodyScrollignToggle() {
  document.body.classList.toggle("hidden-scrolling");
}

// portfolio filter and popup

(() => {
  const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
  let itemIndex, slideIndex, screenshots;

  // filter portfolio items

  filterContainer.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("filter-item") &&
      !event.target.classList.contains("active")
    ) {
      filterContainer
        .querySelector(".active")
        .classList.remove("outer-shadow", "active");
      event.target.classList.add("active", "outer-shadow");
      const target = event.target.getAttribute("data-target");
      portfolioItems.forEach((item) => {
        if (target === item.getAttribute("data-category") || target === "all") {
          item.classList.remove("hide");
          item.classList.add("show");
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });
    }
  });

  portfolioItemsContainer.addEventListener("click", (event) => {
    let portfolioItem;
    if (event.target.closest(".portfolio-item-inner")) {
      portfolioItem = event.target.closest(
        ".portfolio-item-inner"
      ).parentElement;
    }
    console.dir(portfolioItems);
    itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(
      portfolioItem
    );
    screenshots = portfolioItems[itemIndex]
      .querySelector(".portfolio-item-img img")
      .getAttribute("data-screenshots");
    // convert screenshot in array

    screenshots = screenshots.split(",");
    if (screenshots.length === 1) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      prevBtn.style.display = "block";
      nextBtn.style.display = "block";
    }
    slideIndex = 0;
    popupToggle();
    popupSlideshow();
    popupDetails();
  });

  closeBtn.addEventListener("click", () => {
    popupToggle();
    if (projectDetailsContainer.classList.contains("active")) {
      popupDetailsToggle();
    }
  });

  function popupToggle() {
    popup.classList.toggle("open");
    bodyScrollignToggle();
  }
  function popupSlideshow() {
    const imgsrc = screenshots[slideIndex];
    const popupImg = popup.querySelector(".pp-img");
    //  loader setting
    popup.querySelector(".pp-loader").classList.add("active");
    popupImg.src = imgsrc;
    popupImg.onload = () => {
      // deactive loader after pop img

      popup.querySelector(".pp-loader").classList.remove("active");
    };

    popup.querySelector(".pp-counter").innerHTML =
      slideIndex + 1 + " of " + screenshots.length;
  }

  // next slide
  nextBtn.addEventListener("click", () => {
    if (slideIndex === screenshots.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    popupSlideshow();
    // console.log("slideIndex:" + slideIndex);
  });

  // prev slide

  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = screenshots.length - 1;
    } else {
      slideIndex--;
    }
    popupSlideshow();
    // console.log("slideIndex:" + slideIndex);
  });

  projectDetailsBtn.addEventListener("click", () => {
    popupDetailsToggle();
  });

  function popupDetails() {
    // if portfolio-item-details not exists

    if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
      projectDetailsBtn.style.display = "none";
      return;
      // end function execution
    }
    projectDetailsBtn.style.display = "block";
    // get the project details
    const details = portfolioItems[itemIndex].querySelector(
      ".portfolio-item-details"
    ).innerHTML;
    // set project details
    popup.querySelector(".pp-project-details").innerHTML = details;
    // get project title
    const title = portfolioItems[itemIndex].querySelector(
      ".portfolio-item-title"
    ).innerHTML;
    // set project title
    popup.querySelector(".pp-title h2").innerHTML = title;
    // get project category
    const category = portfolioItems[itemIndex].getAttribute("data-category");
    // set project category
    popup.querySelector(".pp-project-category").innerHTML = category
      .split("-")
      .join("");
  }

  function popupDetailsToggle() {
    if (projectDetailsContainer.classList.contains("active")) {
      projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
      projectDetailsBtn.querySelector("i").classList.add("fa-plus");
      projectDetailsContainer.classList.remove("active");
      projectDetailsContainer.style.maxHeight = 0 + "px";
    } else {
      projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
      projectDetailsBtn.querySelector("i").classList.add("fa-minus");
      projectDetailsContainer.classList.add("active");
      projectDetailsContainer.style.maxHeight =
        projectDetailsContainer.scrollHeight + "px";
      popup.scrollTo(0, projectDetailsContainer.offsetTop);
    }
  }
})();

// testimonial slider

(() => {
  const sliderContainer = document.querySelector(".testi-slider-container"),
    slides = sliderContainer.querySelectorAll(".testi-item"),
    slideWidth = sliderContainer.offsetWidth,
    prevBtn = document.querySelector(".testi-slider-nav .prev"),
    nextBtn = document.querySelector(".testi-slider-nav .next"),
    activeSlide = sliderContainer.querySelector(".testi-item.active");
  let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(
    activeSlide
  );
  // set width of all slides

  slides.forEach((slide) => {
    slide.style.width = slideWidth + "px";
  });

  // set width of slidercontainer
  sliderContainer.style.width = slideWidth * slides.length + "px";

  nextBtn.addEventListener("click", () => {
    if (slideIndex === slides.length - 1) {
      slideIndex = 0;
    } else {
      slideIndex++;
    }
    slider();
  });
  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = slides.length - 1;
    } else {
      slideIndex--;
    }
    slider();
  });

  function slider() {
    // deactivate existing active slides
    sliderContainer
      .querySelector(".testi-item.active")
      .classList.remove("active");
    // activate new slide
    slides[slideIndex].classList.add("active");
    sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + "px";
  }
  slider();
})();

// hide all sections expect active

(() => {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    if (!section.classList.contains("active")) {
      section.classList.add("hide");
    }
  });
})();

// preloader settings

window.addEventListener("load", () => {
  // preloader

  document.querySelector(".preloader").classList.add("fade-out");
  setTimeout(() => {
    document.querySelector(".preloader").style.display = "none";
  }, 600);
});

// micro animation

const hand = document.querySelector("#hand"),
  coin = document.querySelector("#coin"),
  btn = document.querySelector("#donation-btn"),
  heart = document.querySelector("#heart"),
  heartIcon = document.querySelector("#heart-icon"),
  heartProgress = document.querySelector("#heart-progress"),
  wallet = document.querySelector("#wallet"),
  slider = document.querySelector(".slider"),
  checkedBox = document.querySelector("#checked-box");
let isAnimationInAction = false;
let tl = new TimelineMax();
let hoverState = true;
btn.addEventListener("click", () => {
  if (isAnimationInAction) {
    return false;
  }
  isAnimationInAction = true;
  hoverOut();
  hoverState = false;
  startAnimation();
  heartFill();
});
let startAnimation = () => {
  tl.to(coin, 0.2, { scaleX: 0, transformOrigin: "center center" }, 0.4)
    .to(hand, 0.6, { x: -800 })
    .to(heart, 0.6, { scale: 2, transformOrigin: "center 0" }, "<")
    .to(slider, 0.6, { y: -60 }, ">")
    .to(heartIcon, 0.4, { fill: "#ececec" }, 0.2);
};
let heartFill = () => {
  tl.to(heartProgress, 2.5, {
    attr: { y: 59.2 },
    transformOrigin: "center 0",
  })
    .to(wallet, 1, { ease: Power1.easeOut, y: -400 })
    .to(
      heart,
      0.4,
      {
        ease: Power1.easeOut,
        scale: 0.5,
        y: -200,
        transformOrigin: "center center",
      },
      "<"
    )
    .to(slider, 0.6, { ease: Power1.easeOut, y: -120 }, "<")
    .to(heart, 0.8, { y: 0, scale: 0 })
    .fromTo(
      checkedBox,
      0.4,
      { scaleX: 0, scaleY: 0, transformOrigin: "center center" },
      {
        scaleX: 1,
        scaleY: 1,
        transformOrigin: "center center",
        onComplete: () => {
          setTimeout(() => {
            received();
          }, 2500);
        },
      }
    );
};
let received = () => {
  tl.to(hand, 0.8, { x: 0 })
    .to(wallet, 0.4, { y: 0, transformOrigin: "center center" }, "<")
    .to(slider, 0.6, { ease: Power1.easeOut, y: -180 }, ">")
    .set(heart, { clearProps: "all" })
    .set(heartProgress, { attr: { y: 298 } })
    .set(slider, { y: 0 })
    .to(coin, 0.2, {
      scaleX: 1,
      transformOrigin: "center center",
      onComplete: function () {
        isAnimationInAction = false;
        hoverState = true;
        tl.clear();
      },
    });
};
function hoverIn() {
  btn.classList.add("dropped");
}
function hoverOut() {
  btn.classList.remove("dropped");
}
btn.addEventListener("mouseenter", function () {
  if (hoverState) {
    hoverIn();
  }
});
btn.addEventListener("mouseleave", hoverOut);
