import { Client } from '@notionhq/client';
import { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

// 1. 初始化 Notion 客户端
// 它会自动读取我们在 .env.local 中设置的 NOTION_TOKEN
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// 2. 定义 Room 数据的结构 (Schema)
// 这样在代码中使用时，我们就能知道 Room 对象里有哪些属性
export interface Room {
  id: string;
  title: string;
  slug: string;
  price: number;
  capacity: number;
  amenities: string[];
  onsenType: string;
  heroImage: string;
  published: boolean;
  seoTitle: string;
}

// 3. 辅助函数：提取属性值
// Notion API 返回的数据结构非常复杂，我们需要一个函数来简化它
function extractPropertyValue(property: any) {
    // 提取 Title (标题)
    if (property.type === 'title' && property.title.length > 0) {
        return property.title[0].plain_text;
    }
    // 提取 Text (文本) / Slug
    if (property.type === 'rich_text' && property.rich_text.length > 0) {
        return property.rich_text[0].plain_text;
    }
    // 提取 Number (数字) / Price, Capacity
    if (property.type === 'number') {
        return property.number;
    }
    // 提取 Multi-select (多选) / Amenities
    if (property.type === 'multi_select') {
        return property.multi_select.map((item: { name: string }) => item.name);
    }
    // 提取 Select (单选) / Onsen Type
    if (property.type === 'select' && property.select) {
        return property.select.name;
    }
    // 提取 URL (网址) / Hero Image
    if (property.type === 'url') {
        return property.url;
    }
    // 提取 Checkbox (复选框) / Published
    if (property.type === 'checkbox') {
        return property.checkbox;
    }
    return null; // 否则返回空
}


// 4. 核心转换函数：将 Notion Page 转换为我们定义的 Room 结构
function transformToRoom(page: PageObjectResponse): Room {
    const properties = page.properties;
    
    // 注意：这里的属性名必须和你 Notion 数据库里设置的属性名保持一致！
    return {
        id: page.id,
        title: extractPropertyValue(properties['Name (名称)']) || '无标题',
        slug: extractPropertyValue(properties['Slug (网址路径)']) || page.id,
        price: extractPropertyValue(properties['Price (价格)']) || 0,
        capacity: extractPropertyValue(properties['Capacity (人数)']) || 0,
        amenities: extractPropertyValue(properties['Amenities (设施)']) || [],
        onsenType: extractPropertyValue(properties['Onsen Type (温泉类型)']) || '未知',
        heroImage: extractPropertyValue(properties['Hero Image (主图链接)']) || '',
        published: extractPropertyValue(properties['Published (发布)']) || false,
        seoTitle: extractPropertyValue(properties['SEO Title (SEO标题)']) || '',
    };
}


// 5. 核心查询函数：获取所有已发布的房型
export async function getRooms(): Promise<Room[]> {
    if (!process.env.NOTION_ROOMS_DB_ID) {
        console.error("NOTION_ROOMS_DB_ID 未设置");
        return [];
    }
    
    try {
        // 在 v5.x 版本中，使用 dataSources.query 替代 databases.query
        const response = await notion.dataSources.query({
            data_source_id: process.env.NOTION_ROOMS_DB_ID,
            // 过滤条件：只获取 Published (发布) 属性为 true 的页面
            filter: {
                property: 'Published (发布)',
                checkbox: {
                    equals: true,
                },
            },
            // 排序条件：按照 Order (排序) 属性升序排列
            sorts: [{
                property: 'Order (排序)',
                direction: 'ascending',
            }]
        });

        // 调试：打印完整的 API 响应
        console.log('=== Notion API 响应 ===');
        console.log('总结果数:', response.results.length);
        console.log('完整响应:', JSON.stringify(response, null, 2));

        // 过滤掉非 PageObjectResponse 的结果，并进行转换
        const pages = response.results.filter(
            (page): page is PageObjectResponse => 'properties' in page
        );
        
        console.log('过滤后的页面数:', pages.length);
        
        return pages.map(transformToRoom);
        
    } catch (error) {
        console.error("获取 Notion 房型数据失败:", error);
        return [];
    }
}

// 6. 辅助查询函数：根据 Slug 获取单个房型详情 (用于详情页)
export async function getRoomBySlug(slug: string): Promise<Room | null> {
    if (!process.env.NOTION_ROOMS_DB_ID) return null;

    try {
        // 在 v5.x 版本中，使用 dataSources.query 替代 databases.query
        const response = await notion.dataSources.query({
            data_source_id: process.env.NOTION_ROOMS_DB_ID,
            filter: {
                property: 'Slug (网址路径)', // 筛选 Slug 属性
                rich_text: {
                    equals: slug, // 值为传入的 slug
                },
            },
        });

        const page = response.results.find(
            (page): page is PageObjectResponse => 'properties' in page
        );

        if (!page) return null;

        return transformToRoom(page);
    } catch (error) {
        console.error(`根据 Slug 获取房型 ${slug} 失败:`, error);
        return null;
    }
}

// 修复方法类型错误，将 "POST" 改为 "post"
export async function testNotionAPI() {
    try {
        const response = await notion.request({
            path: `databases/${process.env.NOTION_ROOMS_DB_ID}/query`,
            method: 'post',
            body: {
                filter: {
                    property: 'Published (发布)',
                    checkbox: {
                        equals: true,
                    },
                },
            },
        });
        console.log('测试 API 响应:', response);
    } catch (error) {
        console.error('测试 API 调用失败:', error);
    }
}
