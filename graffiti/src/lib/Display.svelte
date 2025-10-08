<script>
  import { onMount } from 'svelte';
  import p5 from 'p5';
  import { supabase } from './supabaseClient.js';

  let canvas;
  // Supabaseから受け取った全ての描画データを格納する配列
  // 各要素が { data: {...}, x, y, vx, vy } という形式のオブジェクトになる
  let allDrawings = [];

  // --- p5.jsのスケッチ ---
  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(240);
      p.strokeJoin(p.ROUND);
    };

    p.draw = () => {
      p.background(240);

      // allDrawings配列に入っている全ての絵を動かし、描画する
      for (const drawing of allDrawings) {
        // 1. 座標を更新
        drawing.x += drawing.vx;
        drawing.y += drawing.vy;

        const w = drawing.data.width || 0;
        const h = drawing.data.height || 0;

        // 2. 画面の端で跳ね返る処理
        if (drawing.x < 0 || drawing.x > p.width) {
          drawing.vx *= -1;
        }
        if (drawing.y < 0 || drawing.y > p.height) {
          drawing.vy *= -1;
        }

        // 3. 描画
        p.push(); // 現在の描画スタイル（座標系など）を一時保存
        p.translate(drawing.x + w / 2, drawing.y + h / 2);
        // p.rotate(drawing.angle); // 将来的に回転させることも可能
        p.translate(-w / 2, -h / 2); // 中心の分だけ座標を戻す
        for (const path of drawing.data.path_data) {
          drawPath(p, path);
        }
        p.pop(); // 描画スタイルを元に戻す
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };

  // --- 描画用のヘルパー関数（変更なし） ---
  function drawPath(p, path) {
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

  // --- 新しい描画データにアニメーションプロパティを追加する関数 ---
  function addAnimationProperties(drawingData) {
    return {
      data: drawingData,
      x: Math.random() * window.innerWidth, // ランダムな初期位置X
      y: Math.random() * window.innerHeight, // ランダムな初期位置Y
      vx: (Math.random() - 0.5) * 2, // ランダムな速度X (-1 ~ 1)
      vy: (Math.random() - 0.5) * 2  // ランダムな速度Y (-1 ~ 1)
    };
  }

  // --- Supabaseとの通信ロジック ---
  onMount(() => {
    new p5(sketch, canvas);

    async function fetchInitialDrawings() {
      const { data, error } = await supabase.from('drawings').select('path_data, width, height');
      if (data) {
        // 取得した各データにアニメーションプロパティを追加
        allDrawings = data.map(addAnimationProperties);
      }
    }
    fetchInitialDrawings();

    const channel = supabase
      .channel('drawings_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'drawings' },
        (payload) => {
          // 新しいデータにもアニメーションプロパティを追加
          const newDrawing = addAnimationProperties(payload.new);
          allDrawings = [...allDrawings, newDrawing];
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  });
</script>

<div class="display-container" bind:this={canvas}></div>

<style>
  :global(body, html) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .display-container {
    width: 100vw;
    height: 100vh;
  }
</style>
