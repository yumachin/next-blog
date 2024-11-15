
//[id]とすることで、エンドポイントが可変に

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DBに接続するための関数を定義
// route.tsにはHTTPリクエストのみを書く(デプロイ時エラー)
// export async function main() {
//   try {
//     await prisma.$connect();
//   } catch (err) {
//     console.error("DB接続エラー:", err);
//     return Error("DB接続に失敗しました。");
//   }
// }

//blog詳細記事取得API
export const GET = async (req: Request) => {
  try {
    //req.url = "http://localhost:3000/api/blog/1"などなど
    //これをparseIntで数値型に変換
    const id: number = parseInt(req.url.split("blog/")[1]); 
    await prisma.$connect();

    //findFirst()は、指定した条件に一致する最初のレコード(行)をDBから取得するメソッド
    const post = await prisma.post.findFirst({ where: { id } }); 
    return NextResponse.json({ messege: 'Success', post }, {status: 200});
  } catch (err) {
    return NextResponse.json({messege: "Error", err}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
}

//blog記事編集API
export const PUT = async (req: Request) => {
  try {
    const { title, description } = await req.json()
    const id: number = parseInt(req.url.split("blog/")[1]); 
    await prisma.$connect();

    //update()は、指定された条件に基づいてDB内の投稿を更新
    //dataという名前である必要あり
    const post = await prisma.post.update({
      data: { title, description },
      where: { id }
    });
    return NextResponse.json({ messege: 'Success', post }, {status: 200});
  } catch (err) {
    return NextResponse.json({messege: "Error", err}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
}

//blog記事削除API
export const DELETE = async (req: Request) => {
  try {
    const id: number = parseInt(req.url.split("blog/")[1]); 
    await prisma.$connect();

    const post = await prisma.post.delete({
      where: { id }
    });
    return NextResponse.json({ messege: 'Success', post }, {status: 200});
  } catch (err) {
    return NextResponse.json({messege: "Error", err}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
}