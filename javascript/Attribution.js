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
    this.categoryName = asset.category.name
    this.authors = assetData.authors ?? []
    this.licenses = assetData.licenses ?? []
    this.links = assetData.links ?? []
  }

  /**
   * Return the attribution as HTML
   *
   * @returns {HTMLElement}
   */
  html() {
    const attribution = document.createElement('li')
    const authorAndLicense = document.createElement('span')

    authorAndLicense.textContent = this.authorAndLicense()
    const linkList = this.linkListHTML()

    attribution.appendChild(authorAndLicense)
    attribution.appendChild(linkList)

    return attribution
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

    return `${this.categoryName}: ${this.assetName} by ${authorList}. Licenses: ${licenseList}.`
  }

  /**
   * Returns the list of links as HTML
   *
   * @returns {HTMLElement}
   */
  linkListHTML() {
    const linkList = document.createElement('ul')

    this.links.forEach(url => {
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.textContent = url

      const listItem = document.createElement('li')
      listItem.appendChild(link)
      linkList.appendChild(listItem)
    })

    return linkList
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
