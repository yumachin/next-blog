
//[id]とすることで、エンドポイントが可変に

import { NextResponse } from "next/server";
import { main } from "../route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//blog詳細記事取得API
export const GET = async (req: Request, res: NextResponse) => {
  try {
    //req.url = "http://localhost:3000/api/blog/1"などなど
    //これをparseIntで数値型に変換
    const id: number = parseInt(req.url.split("blog/")[1]); 
    await main();

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
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const { title, description } = await req.json()
    const id: number = parseInt(req.url.split("blog/")[1]); 
    await main();

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
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    const id: number = parseInt(req.url.split("blog/")[1]); 
    await main();

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