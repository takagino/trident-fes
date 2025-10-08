<script>
  import p5 from 'p5';
  import { onMount } from 'svelte';
  import { supabase } from './supabaseClient'; // ★Supabaseクライアントをインポート

  // --- Svelteの状態管理 ---
  let canvas;
  let p5Instance;
  let controlsContainer; // ★UIのdiv要素を紐付ける変数

  // UIと連携する現在の描画設定
  let currentColor = '#000000';
  let currentWeight = 4;

  // --- p5.jsのためのデータ管理 ---
  let paths = [];
  let currentPath = {};

  // ★▼▼▼ 描画範囲を計算するヘルパー関数を追加 ▼▼▼★
  function calculateBoundingBox(paths) {
    if (paths.length === 0) return { width: 0, height: 0 };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const path of paths) {
      for (const point of path.points) {
        if (point.x < minX) minX = point.x;
        if (point.x > maxX) maxX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.y > maxY) maxY = point.y;
      }
    }
    return {
      width: Math.round(maxX - minX),
      height: Math.round(maxY - minY)
    };
  }

  // ★▼▼▼ 送信処理の関数を追加 ▼▼▼★
  async function submitDrawing() {
    // 描画データが空の場合は何もしない
    if (paths.length === 0) {
      alert("何か描いてから送信してください！");
      return;
    }

    const { width, height } = calculateBoundingBox(paths);

    try {
      // Supabaseの'drawings'テーブルにデータを挿入
      const { data, error } = await supabase
        .from('drawings')
        .insert([
          { path_data: paths,
            width: width,
            height: height
}
        ]);

      if (error) {
        throw error;
      }

      alert("送信しました！");
      // 送信に成功したらキャンバスをクリア
      clearCanvas();

    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。");
    }
  }

  // --- p5.jsのスケッチ本体 ---
  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(240);
      p.strokeJoin(p.ROUND);
    };

    p.draw = () => {
      p.background(240);
      for (const path of paths) {
        drawPath(path);
      }
      drawPath(currentPath);
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    // ▼▼▼ mousePressedの判定ロジックを全面的に変更 ▼▼▼
    p.mousePressed = () => {
      // UI要素がまだ準備できていなければ何もしない
      if (!controlsContainer) return;

      // UIパネルの画面上の位置とサイズを取得
      const uiRect = controlsContainer.getBoundingClientRect();

      // マウス/タッチ座標がUIパネルの内側にあれば、描画せず処理を終了
      if (
        p.mouseX > uiRect.left &&
        p.mouseX < uiRect.right &&
        p.mouseY > uiRect.top &&
        p.mouseY < uiRect.bottom
      ) {
        return;
      }

      // UIの外側であれば、通常通り描画を開始
      currentPath = {
        points: [],
        color: currentColor,
        weight: currentWeight
      };
      paths.push(currentPath);
    }

    p.mouseDragged = () => {
      if (!currentPath.points) return;
      const point = { x: p.mouseX, y: p.mouseY };
      currentPath.points.push(point);
    }

    p.mouseReleased = () => {
      currentPath = {};
    }

    // --- スマホ対応 ---
    p.touchStarted = p.mousePressed;
    p.touchEnded = p.mouseReleased;
    p.touchMoved = () => {
      p.mouseDragged();
      return false;
    }

    // --- ヘルパー関数 ---
    function drawPath(path) {
      if (!path.points || path.points.length < 1) return;
      p.beginShape();
      p.noFill();
      p.stroke(path.color);
      p.strokeWeight(path.weight);
      for (const point of path.points) {
        p.vertex(point.x, point.y);
      }
      p.endShape();
    }
  };

  function clearCanvas() {
    paths = [];
    currentPath = {};
  }

  onMount(() => {
    p5Instance = new p5(sketch, canvas);
    return () => {
      p5Instance.remove();
    };
  });
</script>

<div class="canvas-container" bind:this={canvas}></div>

<div class="controls" bind:this={controlsContainer}>
  <div class="control-item">
    <input type="color" id="colorPicker" bind:value={currentColor}>
  </div>

  <div class="control-item">
    <label for="weightSlider">{currentWeight}</label>
    <input type="range" id="weightSlider" min="1" max="50" step="1" bind:value={currentWeight}>
  </div>

  <button on:click={clearCanvas}>❌</button>
  <button on:click={submitDrawing}>⇧</button>
</div>

<style>
  :global(body, html) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .canvas-container {
    width: 100vw;
    height: 100vh;
    touch-action: none;
  }

  .controls {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;

    display: flex;
    align-items: center;
    gap: 20px;

    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .control-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  label {
    font-family: sans-serif;
    font-size: 14px;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
</style>
