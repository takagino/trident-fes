// ▼▼▼ [差し替え] ユーザー提供のデータ ▼▼▼
const prices = {
  longT: {
    white: 2200,
    color: 2700,
  },
  shortT: {
    white: 2000,
    color: 2500,
  },
  flatPouch: {
    natural: 1500,
    color: 1700,
  },
  dailyPouch: {
    natural: 1800,
    color: 2000,
  },
  sacoche: {
    natural: 2500,
    color: 2700,
  },
  towel: {
    white: 1200,
  },
};

const items = {
  longT: {
    text: 'ロングTシャツ',
    colors: [
      {
        color: 'ffffff',
        text: 'ホワイト',
        file: 'white',
        price: prices.longT.white,
      },
      {
        color: '000000',
        text: 'ブラック',
        file: 'black',
        price: prices.longT.color,
      },
      {
        color: 'c7c7c7',
        text: 'グレー',
        file: 'gray',
        price: prices.longT.color,
      },
      {
        color: '363928',
        text: 'アーミーグリーン',
        file: 'army_green',
        price: prices.longT.color,
      },
      {
        color: '111739',
        text: 'ネイビー',
        file: 'navy',
        price: prices.longT.color,
      },
      {
        color: '3f60c5',
        text: 'ブルー',
        file: 'blue',
        price: prices.longT.color,
      },
      {
        color: '0096bd',
        text: 'ターコイズ',
        file: 'turquoise',
        price: prices.longT.color,
      },
      {
        color: '2e1c72',
        text: 'パープル',
        file: 'purple',
        price: prices.longT.color,
      },
      {
        color: 'f9cc01',
        text: 'デイジー',
        file: 'daisy',
        price: prices.longT.color,
      },
      {
        color: 'efd657',
        text: 'イエロー',
        file: 'yellow',
        price: prices.longT.color,
      },
      {
        color: 'ef4f12',
        text: 'オレンジ',
        file: 'orange',
        price: prices.longT.color,
      },
      {
        color: 'de1e1b',
        text: 'レッド',
        file: 'red',
        price: prices.longT.color,
      },
      {
        color: '6e1d23',
        text: 'バーガンディ',
        file: 'burgundy',
        price: prices.longT.color,
      },
      {
        color: 'e068a3',
        text: 'ピンク',
        file: 'pink',
        price: prices.longT.color,
      },
      {
        color: 'eecfd5',
        text: 'ライトピンク',
        file: 'light_pink',
        price: prices.longT.color,
      },
    ],
  },
  shortT: {
    text: '半袖Tシャツ',
    colors: [
      {
        color: 'ffffff',
        text: 'ホワイト',
        file: 'white',
        price: prices.shortT.white,
      },
      {
        color: '000000',
        text: 'ブラック',
        file: 'black',
        price: prices.shortT.color,
      },
      {
        color: 'c7c7c7',
        text: 'グレー',
        file: 'gray',
        price: prices.shortT.color,
      },
      {
        color: '363928',
        text: 'アーミーグリーン',
        file: 'army_green',
        price: prices.shortT.color,
      },
      {
        color: '111739',
        text: 'ネイビー',
        file: 'navy',
        price: prices.shortT.color,
      },
      {
        color: '3f60c5',
        text: 'ブルー',
        file: 'blue',
        price: prices.shortT.color,
      },
      {
        color: '0096bd',
        text: 'ターコイズ',
        file: 'turquoise',
        price: prices.shortT.color,
      },
      {
        color: '2e1c72',
        text: 'パープル',
        file: 'purple',
        price: prices.shortT.color,
      },
      {
        color: 'f9cc01',
        text: 'デイジー',
        file: 'daisy',
        price: prices.shortT.color,
      },
      {
        color: 'efd657',
        text: 'イエロー',
        file: 'yellow',
        price: prices.shortT.color,
      },
      {
        color: 'ef4f12',
        text: 'オレンジ',
        file: 'orange',
        price: prices.shortT.color,
      },
      {
        color: 'de1e1b',
        text: 'レッド',
        file: 'red',
        price: prices.shortT.color,
      },
      {
        color: '6e1d23',
        text: 'バーガンディ',
        file: 'burgundy',
        price: prices.shortT.color,
      },
      {
        color: 'e068a3',
        text: 'ピンク',
        file: 'pink',
        price: prices.shortT.color,
      },
      {
        color: 'eecfd5',
        text: 'ライトピンク',
        file: 'light_pink',
        price: prices.shortT.color,
      },
    ],
  },
  flatPouch: {
    text: 'フラットポーチ',
    colors: [
      {
        color: 'e8e2d2',
        text: 'ナチュラル',
        file: 'natural',
        price: prices.flatPouch.natural,
      },
      {
        color: '000000',
        text: 'ブラック',
        file: 'black',
        price: prices.flatPouch.color,
      },
      {
        color: '111739',
        text: 'ネイビー',
        file: 'navy',
        price: prices.flatPouch.color,
      },
    ],
  },
  dailyPouch: {
    text: 'デイリーポーチ',
    colors: [
      {
        color: 'e8e2d2',
        text: 'ナチュラル',
        file: 'natural',
        price: prices.dailyPouch.natural,
      },
      {
        color: '000000',
        text: 'ブラック',
        file: 'black',
        price: prices.dailyPouch.color,
      },
      {
        color: '111739',
        text: 'ネイビー',
        file: 'navy',
        price: prices.dailyPouch.color,
      },
    ],
  },
  sacoche: {
    text: 'サコッシュ',
    colors: [
      {
        color: 'e8e2d2',
        text: 'ナチュラル',
        file: 'natural',
        price: prices.sacoche.natural,
      },
      {
        color: '000000',
        text: 'ブラック',
        file: 'black',
        price: prices.sacoche.color,
      },
      {
        color: '111739',
        text: 'ネイビー',
        file: 'navy',
        price: prices.sacoche.color,
      },
    ],
  },
  towel: {
    text: 'タオル',
    colors: [
      {
        color: 'ffffff',
        text: 'ホワイト',
        file: 'white',
        price: prices.towel.white,
      },
    ],
  },
};
// ▲▲▲ [差し替え] ユーザー提供のデータ ▲▲▲

const designs = [
  { file: 'none', text: 'デザインなし' }, // 0番目
  { file: 'photo01', text: '写真部01' },
  { file: 'photo02', text: '写真部02' },
  { file: 'photo03', text: '写真部03' },
];

document.addEventListener('DOMContentLoaded', () => {
  // 1. HTML要素を取得
  const itemSelect = document.getElementById('item-select');
  const colorSwatchesContainer = document.getElementById('color-swatches');
  const previewImage = document.getElementById('preview-image');

  const designImage = document.getElementById('design-image');
  const prevDesignButton = document.getElementById('prev-design');
  const nextDesignButton = document.getElementById('next-design');
  const designNameDisplay = document.getElementById('current-design-name');

  // ▼▼▼ [追加] サマリー表示用の要素を取得 ▼▼▼
  const summaryItem = document.getElementById('summary-item');
  const summaryColor = document.getElementById('summary-color');
  const summaryDesign = document.getElementById('summary-design');
  const summaryPrice = document.getElementById('summary-price');
  // ▲▲▲ [追加] ▲▲▲

  let currentDesignIndex = 0; // 0 は 'デザインなし'

  // --- 2. <select> ボックスにアイテムをセットする ---
  Object.keys(items).forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = items[key].text;
    itemSelect.appendChild(option);
  });

  // --- 3. アイテムに応じて色見本を更新する関数 ---
  function updateColorSwatches() {
    const currentType = itemSelect.value;
    const colors = items[currentType].colors;

    colorSwatchesContainer.innerHTML = '';

    colors.forEach((color, index) => {
      const label = document.createElement('label');
      label.className = 'color-label';
      label.title = color.text;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'color';
      radio.value = color.file; // 'file' プロパティを使用

      if (index === 0) {
        radio.checked = true;
      }

      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = `#${color.color}`;

      label.appendChild(radio);
      label.appendChild(swatch);
      colorSwatchesContainer.appendChild(label);
    });

    updateBaseImage();
  }

  // --- 4. プレビュー画像 (ベース) を更新する関数 ---
  function updateBaseImage() {
    const currentType = itemSelect.value;
    const selectedRadio = document.querySelector('input[name="color"]:checked');
    if (!selectedRadio) return;

    const currentColorFile = selectedRadio.value;
    const imagePath = `images/${currentType}/${currentColorFile}.png`;
    previewImage.src = imagePath;

    const colorObj = items[currentType].colors.find(
      (c) => c.file === currentColorFile
    );
    const colorText = colorObj ? colorObj.text : currentColorFile;
    const itemText = items[currentType].text;
    previewImage.alt = `${itemText}（${colorText}）`;

    updateDesignImageVisibility();
    updateSummary(); // [追加] 色変更時もサマリー更新
  }

  // --- 5. デザイン画像を更新する関数 ---
  function updateDesignImage() {
    const selectedDesign = designs[currentDesignIndex];

    if (selectedDesign.file === 'none') {
      designImage.src = '';
      designImage.alt = '';
    } else {
      const imagePath = `images/design/${selectedDesign.file}.png`;
      designImage.src = imagePath;
      designImage.alt = selectedDesign.text;
    }
    updateDesignImageVisibility();
  }

  // --- 6. デザイン名を表示する関数 ---
  function updateDesignNameDisplay() {
    designNameDisplay.textContent = designs[currentDesignIndex].text;
  }

  // --- 7. アイテムによってデザインの表示/非表示を切り替える関数 ---
  // (タオル分岐を削除したバージョン)
  function updateDesignImageVisibility() {
    const selectedDesign = designs[currentDesignIndex];
    const designControlGroup = prevDesignButton.closest('.control-group');

    designControlGroup.style.display = 'block';

    if (selectedDesign.file === 'none') {
      designImage.style.opacity = '0';
    } else {
      designImage.style.opacity = '1';
    }
  }

  // --- ▼▼▼ [追加] 8. 選択サマリーを更新する関数 ▼▼▼ ---
  function updateSummary() {
    const currentType = itemSelect.value;
    const selectedRadio = document.querySelector('input[name="color"]:checked');
    const selectedDesign = designs[currentDesignIndex];

    // 選択されたカラーオブジェクトを取得
    const colorObj = items[currentType].colors.find(
      (c) => c.file === selectedRadio.value
    );

    // 1. アイテム名
    summaryItem.textContent = items[currentType].text;

    // 2. カラー名
    summaryColor.textContent = colorObj ? colorObj.text : '---';

    // 3. デザイン名
    summaryDesign.textContent = selectedDesign.text;

    // 4. 価格 (カンマ区切り)
    const price = colorObj ? colorObj.price : 0;
    summaryPrice.textContent = price.toLocaleString(); // 3桁カンマ区切り
  }
  // ▲▲▲ [追加] ▲▲▲

  // --- 9. イベントリスナーを設定 --- (旧 8)
  itemSelect.addEventListener('change', () => {
    updateColorSwatches();
    // updateBaseImage() が呼ばれ、その中で updateSummary() も呼ばれる
    // (アイテム変更時にデザインをリセットしない)
  });

  colorSwatchesContainer.addEventListener('change', updateBaseImage);

  // 「次へ」ボタン
  nextDesignButton.addEventListener('click', () => {
    currentDesignIndex++;
    if (currentDesignIndex >= designs.length) {
      currentDesignIndex = 0;
    }
    updateDesignImage();
    updateDesignNameDisplay();
    updateSummary(); // [追加] デザイン変更時もサマリー更新
  });

  // 「前へ」ボタン
  prevDesignButton.addEventListener('click', () => {
    currentDesignIndex--;
    if (currentDesignIndex < 0) {
      currentDesignIndex = designs.length - 1;
    }
    updateDesignImage();
    updateDesignNameDisplay();
    updateSummary(); // [追加] デザイン変更時もサマリー更新
  });

  // --- 10. 初期表示 --- (旧 9)
  updateColorSwatches();
  updateDesignImage();
  updateDesignNameDisplay();
  updateSummary(); // [追加] 初期サマリー表示
});
