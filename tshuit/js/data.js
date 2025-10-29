/**
 * ----------------------------------------------------------------
 * データ定義
 * ----------------------------------------------------------------
 */

// 価格表
const prices = {
  longT: { white: 2200, color: 2700 },
  shortT: { white: 2000, color: 2500 },
  flatPouch: { natural: 1500, color: 1700 },
  dailyPouch: { natural: 1800, color: 2000 },
  sacoche: { natural: 2500, color: 2700 },
  towel: { white: 1200 },
};

// アイテム一覧 (prices を参照するため、prices の後に定義)
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

// デザイン一覧
const designs = [
  { file: 'none', text: 'デザインなし' }, // 0番目
  { file: 'photo01', text: '写真部01' },
  { file: 'photo02', text: '写真部02' },
  { file: 'photo03', text: '写真部03' },
];

// Google Form 設定
const GOOGLE_FORM_BASE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfAhM068p3GgVOS9hGZKPcHGHhHArVV7aMNavgl-AVG-fABPQ/viewform?usp=header';

const FORM_FIELD_MAPPING = {
  item: 'entry.60526283',
  color: 'entry.1390317263',
  design: 'entry.1444093927',
  price: 'entry.59921916',
};
