document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("section, header, footer");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
// ボタンがクリックされたときに実行する関数 (例)
function trackButtonClick(buttonId, buttonText) {
  dataLayer.push({
    'event': 'custom_button_click', // GTMでトリガーとして使用するイベント名
    'buttonId': buttonId,           // ボタンのIDなどの識別子
    'buttonText': buttonText,       // ボタンのテキストなど
    // 必要に応じて他の情報も追加できます
    // 'productId': 'SKU123',
    // 'buttonLocation': 'header',
  });
}
  
elements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";
    observer.observe(el);
  });
});
