const forbidden = [
  "daxu",
  "daixu",
  "admin",
  "root",
  "test",
  "superuser",
  "administrator",
  "null",
  "undefined",
  "管理",
  "超管",
  "系统",
  "测试",
  "客服",
  "所有者",
  "支持",
  "服务",
  "技术",
  "站长",
  "站点",
  "网站"
];

function normalize(word: string) {
  return word.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, "").toLocaleLowerCase();
}

export default function test(word: string) {
  const reg =
    /^[a-zA-Z0-9\u4e00-\u9fa5\u2000-\u206F\u2200-\u22FF\u20A0-\u20CF\u0020-\u007F\u00A0-\u00FF\u2E80-\u2EFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF]+$/;

  if (reg.test(word)) {
    return !forbidden.some(ban => {
      return normalize(word).includes(ban);
    });
  }

  return false;
}
