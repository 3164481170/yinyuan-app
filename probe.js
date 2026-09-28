// 探针：验证 lunar.js 与 iztro.min.js 在纯 JS 环境的可用性与 API 形态
const fs = require('fs'), vm = require('vm');
const sb = vm.createContext({ window: {}, console });
vm.runInContext(fs.readFileSync('lib/lunar.js', 'utf8'), sb);
console.log('lunar globals:', vm.runInContext('typeof Solar, typeof Lunar, typeof EightChar', sb));
const out = vm.runInContext(`
  const solar = Solar.fromYmdHms(1995, 8, 15, 14, 30, 0, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  JSON.stringify({
    gzYear: ec.getYear(), gzMonth: ec.getMonth(), gzDay: ec.getDay(), gzHour: ec.getTime(),
    naYinYear: ec.getYearNaYin(), naYinDay: ec.getDayNaYin(), naYinHour: ec.getTimeNaYin(),
    zodiac: lunar.getYearShengXiao(),
    dayGan: ec.getDayGan(), dayZhi: ec.getDayZhi()
  });
`, sb);
console.log('bazi 1995-08-15 14:30:', out);

const sb2 = vm.createContext({ window: {}, self: {}, console });
vm.runInContext(fs.readFileSync('lib/iztro.min.js', 'utf8'), sb2);
console.log('iztro type:', vm.runInContext('typeof self.iztro', sb2));
const ziwei = vm.runInContext(`
  const { astro } = self.iztro;
  const r = astro.bySolar('1995-8-15', 6, '女', true, 'zh-CN');
  const spouse = r.palaces.find(p => p.name === '夫妻宫');
  JSON.stringify({soul: r.soul, spousePalace: {name: spouse.name, majorStars: spouse.majorStars.map(s=>s.name), minorStars: spouse.minorStars.map(s=>s.name), brightness: spouse.majorStars.map(s=>s.brightness)}});
`, sb2);
console.log('ziwei:', ziwei);
