const appPackage: Record<string, string> = require('./package.json')

export function getProductName() {
  const productName = appPackage.productName
  return process.env.NODE_ENV === 'development'
    ? `${productName}-dev`
    : productName
}