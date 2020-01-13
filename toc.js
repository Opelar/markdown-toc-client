
class MarkdownToc {
  headings = null
  sectionNumbers = [0, 0, 0, 0, 0, 0]

  constructor(container) {
    this.container = container
    this.toc = document.getElementById('TOC')
    if (!this.toc) {
      this.toc = document.createElement('div')
      this.toc.id = 'TOC';
    }
    this.setHeadings()
  }

  setHeadings() {
    if (document.querySelectorAll) {
      this.headings = this.container
        ? document.querySelectorAll(`${this.container} h1,h2,h3,h4,h5,h6`)
        : document.querySelectorAll('h1,h2,h3,h4,h5,h6')
    } else {
      this.headings = findHeadings(document.body, [])
    }
  }

  findHeadings(root, selectors) {
    for (let c = root.firstChild; c !== null; c = c.nextSibling) {
      if (c.nodeType !== 1) {
        continue
      }
      if (c.tagName.length === 2 && c.tagName.charAt(0) === 'H') {
        selectors.push(c)
      } else {
        findHeadings(c, selectors)
      }
      return selectors
    }
  }

  genToc() {
    for (let h = 0; h < this.headings.length; h += 1) {
      const heading = this.headings[h]
      const level = parseInt(heading.tagName.charAt(1))

      if (Number.isNaN(level) || level < 1 || level > 6) {
        continue
      }

      this.sectionNumbers[level - 1] += 1

      for (let i = level; i < 6; i += 1) {
        this.sectionNumbers[i] = 0
      }

      const sectionNumber = this.sectionNumbers.slice(0, level).join('.')

      const span = document.createElement('span')
      span.className = 'TOCSectorNumber'
      span.innerHTML = sectionNumber;
      heading.insertBefore(span, heading.firstChild)

      const anchor = document.createElement('a')
      anchor.name = `TOC${sectionNumber}`
      heading.parentNode.insertBefore(anchor, heading)
      anchor.appendChild(heading)

      const link = document.createElement('a')
      link.href = `#TOC${sectionNumber}`
      link.innerHTML = heading.innerHTML

      const entry = document.createElement('div')
      entry.className = `TOCEntry TOCLevel${level}`
      entry.appendChild(link)

      this.toc.appendChild(entry)

      document.body.insertBefore(this.toc, document.body.firstChild)
    }
  }
}

module.exports = MarkdownToc
module.exports.default = MarkdownToc

