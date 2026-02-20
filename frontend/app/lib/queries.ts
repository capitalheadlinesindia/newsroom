export const heroQuery = `
*[_type == "article" && hero == true]
| order(publishedAt desc)[0]{
  ...,
  category->,
  author->
}
`

export const featuredQuery = `
*[_type == "article" && featured == true && hero != true]
| order(publishedAt desc)[0...3]{
  ...,
  category->
}
`

export const sidebarQuery = `
*[_type == "article"]
| order(publishedAt desc)[0...6]{
  title,
  slug,
  excerpt,
  publishedAt,
  category->
}
`

export const articleBySlug = `
*[_type == "article" && slug.current == $slug][0]{
  ...,
  category->,
  author->
}
`

export const relatedArticlesQuery = `
*[_type == "article" && category->slug.current == $category && slug.current != $slug]
| order(publishedAt desc)[0...4]{
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  category->
}
`

export const categoryArticlesQuery = `
*[_type == "article" && category->slug.current == $slug]
| order(publishedAt desc){
  ...,
  category->
}
`
