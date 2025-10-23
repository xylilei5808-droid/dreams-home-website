import { Client } from '@notionhq/client'

type RichTextValue = {
  rich_text?: Array<{
    plain_text?: string
    text?: { content?: string }
  }>
}

type TitleValue = {
  title?: Array<{
    plain_text?: string
    text?: { content?: string }
  }>
}

type SelectValue = {
  select?: { name?: string }
  multi_select?: Array<{ name?: string }>
}

type NumberValue = {
  number?: number
}

type FilesValue = {
  files?: Array<{
    type?: 'external' | 'file'
    name?: string
    external?: { url?: string }
    file?: { url?: string }
  }>
}

type RelationValue = {
  relation?: Array<{ id: string }>
}

type CheckboxValue = {
  checkbox?: boolean
}

type DateValue = {
  date?: { start?: string | null }
}

type PageProperties = Record<
  string,
  RichTextValue & TitleValue & SelectValue & NumberValue & FilesValue & RelationValue & CheckboxValue & DateValue
>

type PageObject = {
  id: string
  properties: PageProperties
}

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const getText = (value?: RichTextValue | TitleValue) =>
  value?.rich_text?.[0]?.text?.content ??
  value?.rich_text?.[0]?.plain_text ??
  value?.title?.[0]?.text?.content ??
  value?.title?.[0]?.plain_text ??
  ''

const getSelect = (value?: SelectValue) => value?.select?.name ?? ''
const getMultiSelect = (value?: SelectValue) => value?.multi_select?.map((item) => item.name ?? '').filter(Boolean) ?? []
const getNumber = (value?: NumberValue) => value?.number ?? 0
const getFiles = (value?: FilesValue) => value?.files ?? []
const getRelationIds = (value?: RelationValue) => value?.relation?.map((item) => item.id) ?? []
const getCheckbox = (value?: CheckboxValue) => value?.checkbox ?? false
const getDateStart = (value?: DateValue) => value?.date?.start ?? ''

export async function getRooms() {
  if (!process.env.NOTION_ROOMS_DB_ID) return []
  const response = await notion.databases.query({ database_id: process.env.NOTION_ROOMS_DB_ID })
  return response.results.map((page) => mapRoom(page as PageObject))
}

function mapRoom(page: PageObject) {
  const props = page.properties
  return {
    id: page.id,
    name: getText(props.Name),
    slug: getText(props.Slug),
    subtitle: getText(props.Subtitle),
    description: getText(props.Description),
    price: getNumber(props.Price),
    capacity: getNumber(props.Capacity),
    size: getNumber(props.Size),
    amenities: getMultiSelect(props.Amenities),
    gallery: getFiles(props.Gallery),
    status: getSelect(props.Status),
    featured: getCheckbox(props.Featured)
  }
}

export async function getPlans() {
  if (!process.env.NOTION_PLANS_DB_ID) return []
  const response = await notion.databases.query({ database_id: process.env.NOTION_PLANS_DB_ID })
  return response.results.map((page) => {
    const props = (page as PageObject).properties
    return {
      id: page.id,
      name: getText(props.Name),
      description: getText(props.Description),
      includes: getText(props.Includes),
      price: getNumber(props.Price),
      duration: getNumber(props.Duration),
      images: getFiles(props.Images),
      popular: getCheckbox(props.Popular)
    }
  })
}

export async function getJournalPosts() {
  if (!process.env.NOTION_JOURNAL_DB_ID) return []
  const response = await notion.databases.query({
    database_id: process.env.NOTION_JOURNAL_DB_ID,
    sorts: [{ property: 'Publish_Date', direction: 'descending' }]
  })
  return response.results.map((page) => {
    const props = (page as PageObject).properties
    return {
      id: page.id,
      title: getText(props.Title),
      content: getText(props.Content),
      coverImage: getFiles(props.Cover_Image)[0] ?? null,
      publishDate: getDateStart(props.Publish_Date),
      tags: getMultiSelect(props.Tags),
      featured: getCheckbox(props.Featured),
      status: getSelect(props.Status)
    }
  })
}

export async function getStories() {
  if (!process.env.NOTION_STORIES_DB_ID) return []
  const response = await notion.databases.query({ database_id: process.env.NOTION_STORIES_DB_ID })
  return response.results.map((page) => {
    const props = (page as PageObject).properties
    return {
      id: page.id,
      title: getText(props.Title),
      content: getText(props.Content),
      quote: getText(props.Quote),
      beforeImage: getFiles(props.Before_Image)[0] ?? null,
      afterImage: getFiles(props.After_Image)[0] ?? null,
      chapter: getSelect(props.Chapter),
      status: getSelect(props.Status)
    }
  })
}

export async function getExperiences() {
  if (!process.env.NOTION_EXPERIENCES_DB_ID) return []
  const response = await notion.databases.query({
    database_id: process.env.NOTION_EXPERIENCES_DB_ID,
    sorts: [{ property: 'Name', direction: 'ascending' }]
  })
  return response.results.map((page) => {
    const props = (page as PageObject).properties
    return {
      id: page.id,
      name: getText(props.Name),
      icon: getText(props.Icon) || '✨',
      description: getText(props.Description),
      details: getText(props.Details),
      duration: getNumber(props.Duration),
      maxGuests: getNumber(props.Max_Guests),
      season: getMultiSelect(props.Season),
      timeSlots: getText(props.Time_Slots),
      coverImage: getFiles(props.Cover_Image)[0] ?? null,
      category: getSelect(props.Category)
    }
  })
}

export async function getCuisines() {
  if (!process.env.NOTION_CUISINES_DB_ID) return []
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CUISINES_DB_ID,
    sorts: [{ property: 'Name', direction: 'ascending' }]
  })
  return response.results.map((page) => {
    const props = (page as PageObject).properties
    return {
      id: page.id,
      name: getText(props.Name),
      description: getText(props.Description),
      coverImage: getFiles(props.Cover_Image)[0] ?? null,
      style: getSelect(props.Style),
      operatingHours: getText(props.Operating_Hours),
      chef: getRelationIds(props.Chef)[0] ?? null,
      dishes: getRelationIds(props.Dishes)
    }
  })
}

export async function getDishes() {
  if (!process.env.NOTION_DISHES_DB_ID) return []
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DISHES_DB_ID,
    sorts: [{ property: 'Name', direction: 'ascending' }]
  })
  return response.results.map((page) => {
    const props = (page as PageObject).properties
    return {
      id: page.id,
      name: getText(props.Name),
      price: getNumber(props.Price),
      description: getText(props.Description),
      imageGallery: getFiles(props.Image_Gallery),
      status: getSelect(props.Status) || '供应中',
      spicyLevel: getSelect(props.Spicy_Level),
      tags: getMultiSelect(props.Tags),
      cuisine: getRelationIds(props.Cuisine)[0] ?? null
    }
  })
}

export async function getChefs() {
  if (!process.env.NOTION_CHEFS_DB_ID) return []
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CHEFS_DB_ID,
    sorts: [{ property: 'Name', direction: 'ascending' }]
  })
  return response.results.map((page) => {
    const props = (page as PageObject).properties
    return {
      id: page.id,
      name: getText(props.Name),
      bio: getText(props.Bio),
      photo: getFiles(props.Photo)[0] ?? null,
      specialties: getText(props.Specialties),
      experience: getNumber(props.Experience)
    }
  })
}

export async function getHomeBanners() {
  if (!process.env.NOTION_HOME_BANNERS_DB_ID) return []

  const databaseId = process.env.NOTION_HOME_BANNERS_DB_ID
  const mapBanner = (page: PageObject) => {
    const props = page.properties
    return {
      id: page.id,
      title: getText(props.Title),
      subtitle: getText(props.Subtitle),
      buttonText: getText(props.Button_Text),
      buttonLink: getText(props.Button_Link),
      image: getFiles(props.Image)[0] ?? null,
      published: getCheckbox(props.Published)
    }
  }

  const baseQuery = {
    database_id: databaseId,
    sorts: [{ property: 'Order', direction: 'ascending' }] as const
  }

  try {
    const response = await notion.databases.query({
      ...baseQuery,
      filter: {
        property: 'Published',
        checkbox: { equals: true }
      }
    })
    return response.results.map((page) => mapBanner(page as PageObject))
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'validation_error'
    ) {
      const response = await notion.databases.query(baseQuery)
      return response.results.map((page) => mapBanner(page as PageObject))
    }
    console.error('Error fetching home banners:', error)
    return []
  }
}

export async function getRoomBySlug(slug: string) {
  if (!process.env.NOTION_ROOMS_DB_ID || !slug) return null
  const response = await notion.databases.query({
    database_id: process.env.NOTION_ROOMS_DB_ID,
    filter: { property: 'Slug', rich_text: { equals: slug } },
    page_size: 1
  })
  const page = response.results[0] as PageObject | undefined
  return page ? mapRoom(page) : null
}

export async function testNotionConnection() {
  const [rooms, plans, posts, stories, experiences, cuisines, dishes, chefs, banners] = await Promise.all([
    getRooms(),
    getPlans(),
    getJournalPosts(),
    getStories(),
    getExperiences(),
    getCuisines(),
    getDishes(),
    getChefs(),
    getHomeBanners()
  ])
  return {
    success: true,
    data: {
      rooms,
      plans,
      posts,
      stories,
      experiences,
      cuisines,
      dishes,
      chefs,
      banners
    },
    stats: {
      totalRecords:
        rooms.length +
        plans.length +
        posts.length +
        stories.length +
        experiences.length +
        cuisines.length +
        dishes.length +
        chefs.length +
        banners.length,
      databases: 9,
      coreData: { rooms: rooms.length, plans: plans.length, posts: posts.length },
      brandData: { stories: stories.length, experiences: experiences.length },
      diningData: { cuisines: cuisines.length, dishes: dishes.length, chefs: chefs.length },
      homeData: { banners: banners.length }
    }
  }
}
