const stars = "✼ ✼ ✼"

module.exports = class Home {

  data() {
    return {
      layout: "base.njk",
      home: true
    }
  }

  getXSummary(post) {
    let retval = 'oops'
    let summary = post.data.excerpt

//      console.log('--gsPost', post)

    let re = /<img\s+class="tepiton"\s+src="([^"]+)"/
    let m = post.templateContent.match(re)

      //  if the summary is empty use stars
      //  if the summary is '::' use the first img we find
      //  otherise treat it as markdown

    if (! summary ) {
      retval = stars
    } else if (m && summary.startsWith('::')) {
      summary = this.markdown2(summary.slice(2))
      retval = `<img src="${m[1]}">${summary}`
    } else {
      retval = this.markdown(summary)
    }

    return retval
  }

  getSummary(post) {
    let retval = post.data.excerpt || 'oops'

    let re = /<img\s+class="tepiton"\s+src="([^"]+)"/
    let m = post.templateContent.match(re)

    if (m)
      retval = `<img src="${m[1]}">`

    return retval
  }

  renderPost(post) {
    let summary = this.getSummary(post)
    summary = this.markdown2(summary)

    if (post.data.newlines) {
      summary = summary.trim().replace(/\n/g, '<br>\n')
    }

    let body = ''
    let header  = post.data.title && `<header><a href="${post.url}">${post.data.title}</a></header>`
    let section = `<section><a href="${post.url}">${summary}</section></a>`
    let footer  = `<footer><a href="${post.data.draft}"># ${post.date.toDateString()}</a></footer>`

    if (post.data.title === stars) {
      header = ``
      footer = ``
    }

    body =
    `     <li>
          <article>
            ${header}
            ${section}
        </article>
       </li>`

    return body
  }

  render(data) {
        //  array.reverse() is destructive
        //  array.slice() is a javascript idiom
        //                     to copy an array
    let posts = data.collections.tepiton.slice()

    let head = `<h1 class="logo">${ data.config.siteName }</h1>`
    let body = `
<ul class="tepiton">
  ${posts.reverse().map(post => this.renderPost(post)).join("\n")}
</ul>`

    return head + body
  }
}

