
function onMenuHoverEffect() {
  const parents = document.querySelectorAll(".submenu-parent");

  parents.forEach((parent) => {
    const subMenu = parent.querySelector(".submenu");
    parent.addEventListener("mouseenter", (e) => {
      subMenu.classList.add("activate-submenu");
    });

    parent.addEventListener("mouseleave", (e) => {
      subMenu.classList.remove("activate-submenu");
    });

    parent.addEventListener("click", () => {
      subMenu.classList.add("activate-submenu");
    });
  });
}

export {onMenuHoverEffect};
