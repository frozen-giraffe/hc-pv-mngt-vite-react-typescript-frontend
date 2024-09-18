// declare module 'chinese-to-pinyin' {
//     function pinyin(text: string, options?: { tone?: boolean, splitter?: string, keepRest?: boolean }): string;
//     export = pinyin;
//   }
declare module 'chinese-to-pinyin' {
  interface PinyinOptions {
    tone?: boolean;
    splitter?: string;
    keepRest?: boolean;
    firstCharacter?: boolean,
    removeTone?: boolean,
  }

  function pinyin(text: string, options?: PinyinOptions): string;

  export = pinyin;
}