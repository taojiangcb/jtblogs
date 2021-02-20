const instance_of = (L, R) => {
  const baseTypes = ['string', 'number', 'boolean', 'undefine', 'symbol'];
  if (baseTypes.includes(typeof L)) return false;

  const RPrototype = R.prototype;   // 对象的原型
  L = L.__proto__;                  // 示例化的原型 

  while (true) {
    if (L === null) return false;
    if (L === RPrototype) return true;
    L = L.__proto__;
  }
}