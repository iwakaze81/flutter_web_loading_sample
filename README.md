# Flutter Web ローディングサンプル

Flutter Web アプリケーションのローディング画面とスプラッシュアニメーションの実装サンプルです。

## 概要

このプロジェクトは、Flutter Web アプリケーションの初期化中に表示されるローディング画面を実装したサンプルです。`flutter_bootstrap.js` の `onEntrypointLoaded` を使用して、Flutter エンジンの初期化完了時にローディング画面をスムーズにフェードアウトさせます。

## 主な機能

- **美しいローディングアニメーション**: グラデーション背景と回転するスピナー
- **スムーズなフェードアウト**: Flutter アプリの初期化完了時に自動的にフェードアウト
- **タイムアウト処理**: 初期化が失敗した場合でも30秒後に自動的にローディングを非表示
- **エラーハンドリング**: 初期化エラー時も適切にローディングを終了
- **再利用可能な設計**: スタイルとロジックを分離し、保守性を向上

## プロジェクト構成

```
web/
├── index.html                  # HTML 構造のみ
├── styles/
│   └── loading.css            # ローディング画面のスタイル定義
├── scripts/
│   └── loading.js             # ローディング制御ロジック（LoadingController クラス）
└── flutter_bootstrap.js       # Flutter 初期化処理

.vscode/
├── launch.json                # デバッグ設定
├── settings.json              # Dart/Flutter の推奨設定
└── extensions.json            # 推奨拡張機能

.fvm/
└── fvm_config.json            # Flutter バージョン管理（stable 固定）
```

## セットアップ

### 1. FVM のインストール（推奨）

このプロジェクトは FVM (Flutter Version Management) を使用して Flutter のバージョンを管理しています。

```bash
# FVM で Flutter stable をインストール
fvm install stable

# プロジェクトで使用
fvm use stable
```

### 2. 依存関係のインストール

```bash
fvm flutter pub get
```

## 実行方法

### 開発モード

```bash
# Chrome で実行
fvm flutter run -d chrome

# または VS Code で F5 キーを押してデバッグ実行
```

### ビルド

```bash
# 本番用ビルド
fvm flutter build web

# ビルド結果は build/web/ に出力されます
```

## 実装の詳細

### ローディング制御の仕組み

#### 1. **LoadingController クラス** (scripts/loading.js)

ローディング画面の表示/非表示を管理するクラスです。

主な機能：
- `startTimeout()`: 30秒のタイムアウトを開始
- `hide()`: ローディング画面をフェードアウト
- `onError()`: エラー発生時の処理

#### 2. **Flutter Bootstrap** (flutter_bootstrap.js)

`onEntrypointLoaded` コールバックで Flutter の初期化を制御します。

```javascript
_flutter.loader.load({
  onEntrypointLoaded: async function(engineInitializer) {
    try {
      const appRunner = await engineInitializer.initializeEngine();
      await appRunner.runApp();

      // 初期化完了後、ローディングを非表示
      window.loadingController.hide();
    } catch (error) {
      // エラー時もローディングを非表示
      window.loadingController.onError(error);
      throw error;
    }
  }
});
```

#### 3. **動作フロー**

1. ページロード時に `LoadingController` が初期化され、タイムアウトが開始
2. Flutter エンジンの初期化が完了したら `hide()` を呼び出し
3. エラーが発生した場合は `onError()` を呼び出し
4. 30秒経ってもローディングが消えない場合は強制的に非表示

### リロード時の挙動

このサンプルでは、以下の対策によりリロード時の問題を回避しています：

- **タイムアウト処理**: 初期化が失敗してもローディングが永遠に表示されることを防止
- **エラーハンドリング**: 初期化エラー時も適切にローディングを終了
- **ページロード時の初期化**: `DOMContentLoaded` イベントで確実にタイムアウトを開始

## カスタマイズ

### スタイルの変更

`web/styles/loading.css` を編集してデザインをカスタマイズできます。

```css
/* 背景色の変更 */
#loading {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* スピナーのサイズと色 */
.loader {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
}
```

### タイムアウト時間の変更

`web/scripts/loading.js` の `LoadingController` クラスで変更できます。

```javascript
constructor() {
  this.timeout = 30000; // ミリ秒単位（30秒）
}
```

### フェードアウト時間の調整

`web/styles/loading.css` と `web/scripts/loading.js` の両方を変更する必要があります。

```css
/* CSS */
#loading {
  transition: opacity 0.5s ease-out;
}
```

```javascript
// JavaScript
setTimeout(() => {
  // 要素を削除
}, 500); // CSS の transition 時間と合わせる
```

## 開発環境

- **Flutter**: 3.38.9 (stable)
- **Dart**: 3.10.8
- **バージョン管理**: FVM
- **推奨エディタ**: VS Code + Dart/Flutter 拡張機能

## VS Code デバッグ設定

`.vscode/launch.json` に以下のデバッグ設定が含まれています：

- **Flutter Web (Chrome)**: Chrome でデバッグ実行
- **Flutter Web (Edge)**: Edge でデバッグ実行
- **Flutter Web (Profile Mode)**: パフォーマンス測定用
- **Flutter Web (Release Mode)**: リリースビルドの確認用

## GitHub Actions

このプロジェクトには2つの GitHub Actions ワークフローが設定されています。

### Analyze ワークフロー (.github/workflows/analyze.yml)

プルリクエストやプッシュ時に自動実行され、コード品質をチェックします。

**実行内容:**
- コードフォーマットの検証
- `flutter analyze` によるコード解析
- `flutter test` によるテスト実行

**トリガー:**
- main, develop ブランチへの push
- main, develop ブランチへの pull request

### Deploy ワークフロー (.github/workflows/deploy.yml)

main ブランチにマージされたときに自動的に GitHub Pages にデプロイします。

**実行内容:**
1. Flutter Web アプリをビルド（リリースモード）
2. ビルド成果物を GitHub Pages にデプロイ

**トリガー:**
- main ブランチへの push

### GitHub Pages の設定

初回デプロイ前に、以下の設定が必要です：

1. GitHub リポジトリの **Settings** > **Pages** に移動
2. **Source** を **GitHub Actions** に設定
3. main ブランチにプッシュすると自動的にデプロイが開始されます

デプロイ後、以下の URL でアクセスできます：
```
https://iwakaze81.github.io/flutter_web_loading_sample/
```

## ライセンス

このプロジェクトはサンプルコードです。自由に使用・改変してください。

## 参考リンク

- [Flutter Web 公式ドキュメント](https://docs.flutter.dev/platform-integration/web)
- [FVM (Flutter Version Management)](https://fvm.app/)
- [flutter_bootstrap.js について](https://docs.flutter.dev/platform-integration/web/initialization)
