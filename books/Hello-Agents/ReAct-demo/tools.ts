import { getJson } from 'serpapi';

export async function search(query: string) {
  // 一个基于SerpApi的实战网页搜索引擎工具
  // 它会智能的解析搜索引擎，优先返回直接答案或知识图谱信息
  console.log(`🔍 正在执行 [SerpApi] 网页搜索: ${query}`);
  try {
    const apiKey = process.env['SERPAPI_API_KEY'];
    if (!apiKey) {
      return '错误：SERPAPI_API_KEY未在.env文件中配置。';
    }

    const params = {
      engine: 'google',
      q: query,
      api_key: apiKey,
      gl: 'cn',
      hl: 'zh-cn',
    };

    const results = await getJson(params);

    if (results?.answer_box_list) {
      return results?.answer_box_list?.join('\n');
    }

    if (results?.answer_box && results?.knowledgae_graph) {
      return results?.knowledge_graph?.description;
    }

    if (results?.knowledge_graph && results?.knowledge_graph?.description) {
      return results?.knowledge_graph?.description;
    }

    if (results?.organic_results && results?.organic_results.length > 0) {
      // 如果没有直接答案，则返回前三个有机结果的摘要
      const snippets = results.organic_results
        .slice(0, 3)
        .map((res: any, i: number) => {
          return `[${i + 1}] ${res.title || ''}\n${res.snippet || ''}`;
        });
      return snippets.join('\n\n');
    }

    return results;
  } catch (error) {
    console.error('搜索出错:', error);
    return `搜索失败: ${error}`;
  }
}
