{{flutter_js}}
{{flutter_build_config}}

_flutter.loader.load({
  onEntrypointLoaded: async function(engineInitializer) {
    try {
      // Flutterエンジンを初期化
      const appRunner = await engineInitializer.initializeEngine();

      // Flutterアプリを実行
      await appRunner.runApp();

      // アプリの初期化が完了したらローディング画面をフェードアウト
      if (window.loadingController) {
        window.loadingController.hide();
      }
    } catch (error) {
      // エラーが発生した場合もローディング画面を非表示にする
      if (window.loadingController) {
        window.loadingController.onError(error);
      }
      throw error;
    }
  }
});
