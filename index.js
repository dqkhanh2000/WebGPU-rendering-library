const iframe = document.querySelector("iframe");
const button = document.querySelector(".src");
const samples = document.querySelectorAll(".sample");
for (let sample of samples) {
  sample.addEventListener("click", () => {
    window.location.hash = sample.target;
    iframe.src = `./examples/${ sample.target }.html`;
    button.href = `https://github.com/Orillusion/orillusion-webgpu-samples/tree/main/src/${ sample.target }.ts`;
    document.querySelector(".active").classList.remove("active");
    sample.classList.add("active");
  });
}
if (window.location.hash) {
  document.querySelector(`[target=${window.location.hash.slice(1)}]`).click();
}
else {
  document.querySelector(".sample.active").click();
}
