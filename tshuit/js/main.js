/**
 * ----------------------------------------------------------------
 * メインスクリプト
 * ----------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM要素のキャッシュ ---
  const itemSelect = document.getElementById('item-select');
  const colorSwatchesContainer = document.getElementById('color-swatches');
  const previewImage = document.getElementById('preview-image');
  const designImage = document.getElementById('design-image');
  const prevDesignButton = document.getElementById('prev-design');
  const nextDesignButton = document.getElementById('next-design');
  const designNameDisplay = document.getElementById('current-design-name');

  // サマリー表示用
  const summaryItem = document.getElementById('summary-item');
  const summaryColor = document.getElementById('summary-color');
  const summaryDesign = document.getElementById('summary-design');
  const summaryPrice = document.getElementById('summary-price');

  // モーダル用
  const openFormButton = document.getElementById('open-form-button');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const formIframe = document.getElementById('form-iframe');
  const iframeLoader = document.getElementById('iframe-loader');

  // --- アプリケーションの状態 ---
  let currentDesignIndex = 0; // 0 = 'デザインなし'

  // --- 初期化関数 ---

  /**
   * アイテム選択 <select> を初期化
   */
  function initializeItemSelect() {
    Object.keys(items).forEach((key) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = items[key].text;
      itemSelect.appendChild(option);
    });
  }

  // --- UI更新関数 ---

  /**
   * 選択されたアイテムに基づき、色見本を再構築する
   */
  function updateColorSwatches() {
    const currentType = itemSelect.value;
    const colors = items[currentType].colors;

    colorSwatchesContainer.innerHTML = ''; // 既存の色見本をクリア

    colors.forEach((color, index) => {
      const label = document.createElement('label');
      label.className = 'color-label';
      label.title = color.text;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'color';
      radio.value = color.file;

      if (index === 0) {
        radio.checked = true; // 最初の色をデフォルト選択
      }

      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = `#${color.color}`;

      label.appendChild(radio);
      label.appendChild(swatch);
      colorSwatchesContainer.appendChild(label);
    });

    // 色見本を更新したら、ベース画像とサマリーも更新
    updateBaseImage();
  }

  /**
   * ベース画像 (Tシャツ等) を更新する
   */
  function updateBaseImage() {
    const currentType = itemSelect.value;
    const selectedRadio = document.querySelector('input[name="color"]:checked');
    if (!selectedRadio) return;

    const currentColorFile = selectedRadio.value;
    const imagePath = `images/${currentType}/${currentColorFile}.png`;
    previewImage.src = imagePath;

    // altテキストも更新
    const colorObj = items[currentType].colors.find(
      (c) => c.file === currentColorFile
    );
    const colorText = colorObj ? colorObj.text : currentColorFile;
    const itemText = items[currentType].text;
    previewImage.alt = `${itemText}（${colorText}）`;

    // 関連するUIも更新
    updateDesignImageVisibility();
    updateSummary();
  }

  /**
   * デザイン画像を更新する
   */
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

  /**
   * デザイン名をテキスト表示
   */
  function updateDesignNameDisplay() {
    designNameDisplay.textContent = designs[currentDesignIndex].text;
  }

  /**
   * デザイン画像の表示/非表示を切り替える
   */
  function updateDesignImageVisibility() {
    const selectedDesign = designs[currentDesignIndex];

    // (タオルでもデザインUIは常に表示)
    const designControlGroup = prevDesignButton.closest('.control-group');
    designControlGroup.style.display = 'block';

    // 「デザインなし」の場合のみ画像を非表示
    if (selectedDesign.file === 'none') {
      designImage.style.opacity = '0';
    } else {
      designImage.style.opacity = '1';
    }
  }

  /**
   * 「現在の選択」サマリーを更新する
   */
  function updateSummary() {
    const currentType = itemSelect.value;
    const selectedRadio = document.querySelector('input[name="color"]:checked');
    const selectedDesign = designs[currentDesignIndex];
    const colorObj = items[currentType].colors.find(
      (c) => c.file === selectedRadio.value
    );

    summaryItem.textContent = items[currentType].text;
    summaryColor.textContent = colorObj ? colorObj.text : '---';
    summaryDesign.textContent = selectedDesign.text;

    const price = colorObj ? colorObj.price : 0;
    summaryPrice.textContent = price.toLocaleString(); // 3桁カンマ区切り
  }

  // --- モーダル関数 ---

  /**
   * Google Form モーダルを開き、選択内容を自動入力する
   */
  function openModal() {
    iframeLoader.style.display = 'block';
    formIframe.style.visibility = 'hidden';

    // URLパラメータを作成
    const params = new URLSearchParams();
    params.append(FORM_FIELD_MAPPING.item, summaryItem.textContent);
    params.append(FORM_FIELD_MAPPING.color, summaryColor.textContent);
    params.append(FORM_FIELD_MAPPING.design, summaryDesign.textContent);
    params.append(FORM_FIELD_MAPPING.price, summaryPrice.textContent);

    // ベースURLに ? が含まれているか判定し、& または ? で連結
    const separator = GOOGLE_FORM_BASE_URL.includes('?') ? '&' : '?';
    const finalUrl = `${GOOGLE_FORM_BASE_URL}${separator}${params.toString()}`;

    formIframe.src = finalUrl;
    modalOverlay.style.display = 'flex';
  }

  /**
   * モーダルを閉じる
   */
  function closeModal() {
    modalOverlay.style.display = 'none';
    formIframe.src = ''; // フォームをリセット
  }

  // iframe読み込み完了時にローダーを非表示
  formIframe.onload = () => {
    iframeLoader.style.display = 'none';
    formIframe.style.visibility = 'visible';
  };

  // --- イベントリスナーの設定 ---

  // アイテム変更
  itemSelect.addEventListener('change', () => {
    updateColorSwatches();
    // (デザインはリセットしない)
  });

  // カラー変更
  colorSwatchesContainer.addEventListener('change', updateBaseImage);

  // デザイン「次へ」
  nextDesignButton.addEventListener('click', () => {
    currentDesignIndex++;
    if (currentDesignIndex >= designs.length) {
      currentDesignIndex = 0; // 末尾 -> 先頭(なし) へ
    }
    updateDesignImage();
    updateDesignNameDisplay();
    updateSummary();
  });

  // デザイン「前へ」
  prevDesignButton.addEventListener('click', () => {
    currentDesignIndex--;
    if (currentDesignIndex < 0) {
      currentDesignIndex = designs.length - 1; // 先頭 -> 末尾 へ
    }
    updateDesignImage();
    updateDesignNameDisplay();
    updateSummary();
  });

  // フォームボタン
  openFormButton.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);

  // モーダル背景クリックで閉じる
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // --- 初期表示の実行 ---
  initializeItemSelect();
  updateColorSwatches();
  updateDesignImage();
  updateDesignNameDisplay();
  updateSummary();
});
