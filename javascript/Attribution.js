export default class Attribution {
  constructor(asset, assetData) {
    this.assetName = asset.name
    this.categoryName = asset.category.name
    this.authors = assetData['authors'] ?? []
    this.licenses = assetData['licenses'] ?? []
    this.links = assetData['links'] ?? []
  }

  html() {
    const attribution = document.createElement('li')
    const authorAndLicense = document.createElement('span')

    authorAndLicense.textContent = this.authorAndLicense()
    const linkList = this.linkListHTML()

    attribution.appendChild(authorAndLicense)
    attribution.appendChild(linkList)

    return attribution
  }

  plainText() {
    return `${this.authorAndLicense()}\n${this.linkListPlainText()}`
  }

  authorAndLicense() {
    const authorList = this.authors.join(', ')
    const licenseList = this.licenses.join(', ')

    return `${this.categoryName}: ${this.assetName} by ${authorList}. Licenses: ${licenseList}.`
  }

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

  linkListPlainText() {
    const listBullet = ' - '
    return listBullet + this.links.join(`\n${listBullet}`)
  }
}
