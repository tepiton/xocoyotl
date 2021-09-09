const stars = "✼ ✼ ✼"

module.exports = class Home {

  data() {
    return {
      layout: "base.njk",
      home: true
    }
  }

  getSummary(post) {
    let retval = 'oops'
    let summary = post.data.summary

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


  renderPost(post) {
    let body = ''
    let summary = post.data.summary
    let header = `<header><a href="${post.url}">${post.data.title}</a></header>`
    let footer = `<footer><a href="${post.data.draft}"># ${post.date.toDateString()}</a></footer>`
    let section = `<a href="${post.url}">${this.getSummary(post)}</a>`

//     if (post.data.title === stars) {
//       header = ``
//       footer = ``
//       section = `<blockquote>${section}</blockquote>`
//     }

    body =
  `     <li>
          <article>
            ${header}
            <section>${section}</section>
            ${footer}
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

