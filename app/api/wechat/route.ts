// 微信公众号 API 集成
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

const WECHAT_APPID = process.env.WECHAT_APPID || '';
const WECHAT_SECRET = process.env.WECHAT_SECRET || '';

// 获取 Access Token
async function getAccessToken() {
  if (!WECHAT_APPID || !WECHAT_SECRET) {
    throw new Error('微信公众号配置未设置');
  }

  const response = await fetch(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}`
  );
  
  const data = await response.json();
  
  if (data.errcode) {
    throw new Error(`获取 Token 失败：${data.errmsg}`);
  }
  
  return data.access_token;
}

// GET - 获取草稿列表
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0');
    const count = parseInt(searchParams.get('count') || '20');

    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/draft/batchget?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offset,
          count,
          no_content: 0, // 返回内容
        }),
      }
    );

    const data = await response.json();

    if (data.errcode && data.errcode !== 0) {
      return NextResponse.json(
        { success: false, error: data.errmsg },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        item_count: data.item_count,
        drafts: data.item || [],
      },
    });
  } catch (error) {
    console.error('获取草稿列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取草稿列表失败' },
      { status: 500 }
    );
  }
}

// POST - 创建草稿
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author = '虾大师', thumbMediaId = '' } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articles: [
            {
              title,
              author,
              content,
              content_source_url: 'https://xiamaster.ai',
              thumb_media_id: thumbMediaId,
              show_cover_pic: 0,
              need_open_comment: 1,
              only_fans_can_comment: 0,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.errcode && data.errcode !== 0) {
      return NextResponse.json(
        { success: false, error: data.errmsg },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        mediaId: data.media_id,
        title,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('创建草稿失败:', error);
    return NextResponse.json(
      { success: false, error: '创建草稿失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新草稿
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaId, index, articles } = body;

    if (!mediaId || !articles) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/draft/update?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_id: mediaId,
          index, // 要更新的文章位置（从 0 开始）
          articles,
        }),
      }
    );

    const data = await response.json();

    if (data.errcode && data.errcode !== 0) {
      return NextResponse.json(
        { success: false, error: data.errmsg },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '草稿更新成功',
    });
  } catch (error) {
    console.error('更新草稿失败:', error);
    return NextResponse.json(
      { success: false, error: '更新草稿失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除草稿
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: '缺少 mediaId 参数' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.weixin.qq.com/cgi-bin/draft/delete?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_id: mediaId }),
      }
    );

    const data = await response.json();

    if (data.errcode && data.errcode !== 0) {
      return NextResponse.json(
        { success: false, error: data.errmsg },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '草稿删除成功',
    });
  } catch (error) {
    console.error('删除草稿失败:', error);
    return NextResponse.json(
      { success: false, error: '删除草稿失败' },
      { status: 500 }
    );
  }
}
