const links = [
  { name: '🌸 devpost', url: 'https://devpost.com/dangjoey' },
  { name: '🌊  spotify', url: 'https://open.spotify.com/user/ipotatochips' },
  { name: '🐙 github', url: 'https://github.com/dangjoey' },
]

const socialMedia = [
  { icon: 'facebook', url: 'https://www.facebook.com/joeydangg' },
  { icon: 'instagram', url: 'https://www.instagram.com/dangjoeyy/' },
  { icon: 'linkedin', url: 'https://www.linkedin.com/in/dangjoeyy/' },
]
//adding a profile picture
class AvatarTransformer {
  async element(element) {
    element.setAttribute('src', 'https://i.imgur.com/rMQhkDF.jpg')
    element.setAttribute('style', 'object-fit: cover')
  }
}

class BackgroundTransformer {
  async element(element) {
    element.removeAttribute('class')
    element.setAttribute(
      'style',
      `background-color: #8EC5FC; 
      background-image: linear-gradient(152deg, #8EC5FC 0%, #E0C3FC 100%)`,
    )
  }
}

class LinksTransformer {
  consturctor(link) {
    this.links = link
  }

  async element(element) {
    links.map(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, { html: true })
    })
  }
}

class RemoveStyle {
  async element(element) {
    element.removeAttribute('style')
  }
}

class SocialMediaTransformer {
  constuctor(socialMedia) {
    this.socialMedia = socialMedia
  }
  async element(element) {
    socialMedia.map(link => {
      element.append(
        `<a href="${link.url}">
          <img style="filter: brightness(0) invert(1)" src="https://simpleicons.org/icons/${link.icon}.svg">
          </img>
        </a>`,
        { html: true },
      )
    })
  }
}

class TitleTransformer {
  async element(element) {
    element.setInnerContent('Joey Dang')
  }
}
class UsernameTransformer {
  async element(element) {
    element.setInnerContent('@dangjoey')
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    const rewriter = new HTMLRewriter()
      .on('body', new BackgroundTransformer())
      .on('div#profile', new RemoveStyle())
      .on('div#links', new LinksTransformer(links))
      .on('title', new TitleTransformer())
      .on('img#avatar', new AvatarTransformer())
      .on('div#social', new RemoveStyle())
      .on('div#social', new SocialMediaTransformer(socialMedia))
      .on('h1#name', new UsernameTransformer())
    const fetchRequest = await fetch(
      'https://static-links-page.signalnerve.workers.dev',
    )

    const contentPage = await rewriter.transform(fetchRequest).arrayBuffer()

    const url = new URL(request.url)
    const pathUrl = url.pathname

    //handling path response for /links
    if (pathUrl == '/links') {
      return new Response(JSON.stringify(links), {
        headers: { 'content-type': 'application/json' },
      })
    }

    return new Response(contentPage, {
      headers: { 'content-type': 'text/html' },
    })
  } catch (err) {
    console.log(err.message)

    return new Response('error', {
      headers: { 'content-type': 'text/html' },
    })
  }
}
