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

 // --- ここから追加する、セッション内のページビューをカウントし、3ページ目でイベントをPushするコード ---

  // sessionStorage にページビュー数を保存するためのキー名
  const storageKey = 'gtm_session_page_view_count';

  // GA4に送信するカスタムイベント名
  const ga4EventName = 'session_page_view_3plus'; // GTMで設定するカスタムイベントトリガーの名前と一致させること

  // 現在のページ閲覧数を sessionStorage から取得
  // 初回アクセス時は null になるので、その場合は 0 として扱う
  let pageViews = sessionStorage.getItem(storageKey);
  let currentCount = parseInt(pageViews, 10);

  // 有効な数値でない場合は0をセット
  if (isNaN(currentCount)) {
    currentCount = 0;
  }

  // 現在のページビューをカウントに追加（このページが読み込まれたのでカウントを1増やす）
  currentCount++;

  // 更新したカウントを sessionStorage に保存
  try {
    sessionStorage.setItem(storageKey, currentCount);
  } catch (e) {
    // sessionStorage が利用できない場合（プライベートブラウジングなど）のハンドリング
    console.error('sessionStorageの書き込みに失敗しました:', e);
  }

  // カウントがちょうど3になった場合にのみ、GA4へ送信するためのカスタムイベントをdataLayerにPushする
  // これにより、セッション中に3ページ目に到達したときに一度だけイベントが発火することを保証します。
  if (currentCount === 3) {
    console.log(`セッション中のページ閲覧数が ${currentCount} に到達しました。GA4イベント "${ga4EventName}" をdataLayerにPushします。`);

    // dataLayerにカスタムイベントをPush
    // GTMのGA4イベントタグはこのイベント名をリッスンして発火するように設定します。
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': ga4EventName,           // GTMで設定するカスタムイベント名
        'page_view_count': currentCount // （オプション）現在のページビュー数をパラメータとして送信
      });
      console.log('dataLayer push:', { event: ga4EventName, page_view_count: currentCount }); // デバッグ用
    } else {
      console.error('dataLayer が定義されていません。GA4イベントをPushできませんでした。'); // エラーログ
    }

  } else {
      console.log(`現在のセッション内ページ閲覧数: ${currentCount} (イベント発火条件にはまだ到達していません または 既に通過しています)`); // デバッグ用
  }

 
