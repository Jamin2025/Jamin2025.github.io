

const factorial = (n) => {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

function poisson(lambda, k) {
  const e = Math.E;
  return (e ** (-lambda) * (lambda ** k)) / factorial(k);
}
  
  // 示例使用
const lambda0 = 10 ** -6; // 平均发生率
const d = 3

const lambda = lambda0 * 10 ** d;

const k = 0; // 发生次数


// T 为time length of the task
function calProbability(T) {
  const probability = 1 - poisson(lambda * T, k);
  // console.log(probability)
  return probability;
}

function hitProbability(P) {
  const hit = Math.random() < P
  return hit
}

module.exports = {
  hitProbability,
  calProbability
}
