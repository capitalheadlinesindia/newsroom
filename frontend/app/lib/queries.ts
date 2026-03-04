export const heroQuery = `
*[_type == "article" && hero == true]
| order(publishedAt desc)[0]{
  ...,
  categories[]->,
  author->
}
`

export const featuredQuery = `
*[_type == "article" && featured == true && hero != true]
| order(publishedAt desc)[0...3]{
  ...,
  categories[]->
}
`

export const sidebarQuery = `
*[_type == "article"]
| order(publishedAt desc)[0...6]{
  title,
  slug,
  excerpt,
  publishedAt,
  categories[]->
}
`

export const articleBySlug = `
*[_type == "article" && slug.current == $slug][0]{
  ...,
  titleHindi,
  excerptHindi,
  body,
  bodyHindi,
  categories[]->,
  author->
}
`

export const relatedArticlesQuery = `
*[_type == "article" && $category in categories[]->slug.current && slug.current != $slug]
| order(publishedAt desc)[0...4]{
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  categories[]->
}
`

export const categoryArticlesQuery = `
*[_type == "article" && $slug in categories[]->slug.current]
| order(publishedAt desc){
  ...,
  categories[]->
}
`

export const allCategoryArticlesQuery = `
*[_type == "category"] | order(title asc) {
  "slug": slug.current,
  "title": title,
  "articles": *[_type == "article" && ^._id in categories[]._ref] | order(publishedAt desc)[0...4] {
    title,
    titleHindi,
    slug,
    excerpt,
    excerptHindi,
    mainImage,
    publishedAt,
    "categories": categories[]->
  }
}
`

export const articlesByCategoryQuery = `
*[_type == "article" && $categorySlug in categories[]->slug.current]
| order(publishedAt desc)[0...$limit]{
  title,
  titleHindi,
  slug,
  excerpt,
  excerptHindi,
  mainImage,
  publishedAt,
  categories[]->
}
`

export const categoriesQuery = `
*[_type == "category"] | order(title asc){
  title,
  slug
}
`
