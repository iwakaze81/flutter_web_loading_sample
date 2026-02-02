/**
 * ローディング画面を制御するクラス
 */
class LoadingController {
  constructor() {
    this.loadingElement = document.getElementById('loading');
    this.timeout = 30000; // 30秒のタイムアウト
    this.timeoutId = null;
    this.isHidden = false;
  }

  /**
   * タイムアウト処理を開始
   * Flutter初期化が失敗した場合でもローディングを消す
   */
  startTimeout() {
    this.timeoutId = setTimeout(() => {
      console.warn('Flutter initialization timeout. Hiding loading screen.');
      this.hide();
    }, this.timeout);
  }

  /**
   * タイムアウトをキャンセル
   */
  cancelTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * ローディング画面をフェードアウト
   */
  hide() {
    if (this.isHidden || !this.loadingElement) {
      return;
    }

    this.isHidden = true;
    this.cancelTimeout();

    this.loadingElement.classList.add('fade-out');

    // アニメーション完了後に要素を削除
    setTimeout(() => {
      if (this.loadingElement && this.loadingElement.parentNode) {
        this.loadingElement.parentNode.removeChild(this.loadingElement);
      }
    }, 500); // CSSのtransition時間と合わせる
  }

  /**
   * エラー時の処理
   */
  onError(error) {
    console.error('Flutter loading error:', error);
    this.hide();
  }
}

// グローバルインスタンスを作成
window.loadingController = new LoadingController();

// ページロード時にタイムアウトを開始
window.addEventListener('DOMContentLoaded', () => {
  window.loadingController.startTimeout();
});
