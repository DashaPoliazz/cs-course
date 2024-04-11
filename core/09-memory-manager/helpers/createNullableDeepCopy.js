const createNullableDeepCopy = (entity) => {
  // Creates null as value for each key in object
  if (entity === null || typeof entity !== "object") return null;
  const clone = Array.isArray(entity) ? [] : {};
  for (let key in entity) clone[key] = createNullableDeepCopy(entity[key]);
  return clone;
};

module.exports = createNullableDeepCopy;
