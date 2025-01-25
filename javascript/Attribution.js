/**
 * Stores the attribution information for an AssetOption
 */
export default class Attribution {
  /**
   *
   * @param {AssetOption} asset the asset this attribution is for
   * @param {Object} assetData the sheet definition data for this asset
   */
  constructor(asset, assetData) {
    this.assetName = asset.name
    this.assetLabel = asset.label
    this.categoryName = asset.category.name
    this.authors = assetData.authors ?? []
    this.licenses = assetData.licenses ?? []
    this.links = assetData.links ?? []
  }

  /**
   * Returns the attribution as plain text
   *
   * @returns {string}
   */
  plainText() {
    return `${this.authorAndLicense()}\n${this.linkListPlainText()}`
  }

  /**
   * Returns the authors and licenses as plain text
   *
   * @returns {string}
   */
  authorAndLicense() {
    const authorList = this.authors.join(', ')
    const licenseList = this.licenses.join(', ')

    const labelAndName = this.assetLabel === this.assetName ? this.assetLabel : `${this.assetLabel} (${this.assetName})`

    return `${this.categoryName}: ${labelAndName} by ${authorList}. Licenses: ${licenseList}.`
  }

  /**
   * Returns the list of links as plain text
   *
   * @returns {string}
   */
  linkListPlainText() {
    const listBullet = ' - '
    return listBullet + this.links.join(`\n${listBullet}`)
  }
}
