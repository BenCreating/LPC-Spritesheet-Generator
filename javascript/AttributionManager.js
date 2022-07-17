export default class AttributionManager {
  constructor(characterGenerator) {
    this.characterGenerator = characterGenerator
  }

  get optionManager() { return this.characterGenerator.optionManager }
  get sheetDefinitions() { return this.characterGenerator.sheetDefinitions }

  update() {
    const attributionContainer = document.querySelector('.attribution-content')

    const authorsHTML = this.authorsHTML()
    const sourcesHTML = this.sourcesHTML()

    attributionContainer.replaceChildren(authorsHTML, sourcesHTML)
  }

  selectedOptionsData() {
    return this.optionManager.optionCategories().map(category => {
      const selectedOption = this.optionManager.getSelectedOption(category)
      if (selectedOption === 'none') return

      const optionData = this.sheetDefinitions[category][selectedOption]
      optionData['category'] = category
      optionData['name'] = selectedOption

      return optionData
    }).filter(option => option)
  }

  authors() {
    const authors = this.selectedOptionsData().flatMap(optionData => optionData['authors'])
    const uniqueAuthors = new Set(authors)

    return [...uniqueAuthors]
  }

  authorsPlainText() {
    return this.authors().join(', ')
  }

  authorsHTML() {
    const authorsPlainText = this.authorsPlainText()

    const authorsHTML = document.createElement('span')
    authorsHTML.textContent = authorsPlainText

    return authorsHTML
  }

  sources() {
    return this.selectedOptionsData().map(optionData => {
      const category = optionData['category']
      const optionName = optionData['name']
      const authors = optionData['authors'].join(', ')
      const licenses = optionData['licenses'].join(', ')
      const links = optionData['links']

      const attribution = `${category}: ${optionName} by ${authors}. Licenses: ${licenses}.`
      return { attribution: attribution, links: links}
    })
  }

  sourcesPlainText() {
    const sourceItems = this.sources().map(source => {
      const attribution = source.attribution
      const links = this.linkListPlainText(source.links)

      return `${attribution}\n${links}`
    })

    return sourceItems.join('\n\n')
  }

  sourcesHTML() {
    const sourcesHTML = document.createElement('ul')

    this.sources().forEach(source => {
      const attributionHTML = document.createElement('span')
      attributionHTML.textContent = source.attribution

      const linkListHTML = this.linkListHTML(source.links)

      const sourceItem = document.createElement('li')
      sourceItem.appendChild(attributionHTML)
      sourceItem.appendChild(linkListHTML)

      sourcesHTML.appendChild(sourceItem)
    })

    return sourcesHTML
  }

  linkListPlainText(urlArray) {
    const listBullet = ' - '
    return listBullet + urlArray.join(`\n${listBullet}`)
  }

  linkListHTML(urlArray) {
    const linkList = document.createElement('ul')

    urlArray.forEach(url => {
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.textContent = url

      const listItem = document.createElement('li')
      listItem.appendChild(link)

      linkList.appendChild(listItem)
    })

    return linkList
  }

  copy() {
    const authors = this.authorsPlainText()
    const sources = this.sourcesPlainText()
    const attribution = `${authors}\n\n${sources}`

    navigator.clipboard.writeText(attribution)
  }
}
