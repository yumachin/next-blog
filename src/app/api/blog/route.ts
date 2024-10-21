//"@prisma/client/extension"ではなく、"@prisma/client"に変更する。
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

//PrismaClient = DBとやりとりするための特別な道具
const prisma  = new PrismaClient();

//DBに接続するための関数を定義
export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("DB接続に失敗しました。");
  }
}

//blogの全記事取得API
//RequestとNextResponseは型定義であるが、NextResponseは機能を持つオブジェクトでもある。
//reqはクライアントからサーバーに送信されたHTTPリクエストの情報を含むオブジェクトで、resはサーバーがクライアントに返すHTTPレスポンスの情報を含むオブジェクト
export const GET = async (req: Request, res: NextResponse) => {
  try {
  //まずはDBと接続
    await main();
  //その後、DB内のデータを取得
    //postとは、schema.prismaファイルで定義したmodelの名前、findMany()はDBから複数のレコード(行)を取得し。それを配列で返すメソッド
    const posts = await prisma.post.findMany();
    //NextResponseを使うことで、サーバーから送るメッセージ内容や、どんな種類のデータを送るかを指定できる
    //.jsonを使うことで、クライアントにデータをJSON形式で送信、また2つの引数をとる
    //1つ目の引数は、送信データ本体。2つ目の引数は、送信データに追加の設定を行うためのオプション(200:成功、404:見つからない、500:サーバーエラー)
    //{ messege: 'Success', posts }はオブジェクト。messegeというキーに'Success'という値が対応している
    return NextResponse.json({ messege: 'Success', posts }, {status: 200});
  } catch (err) {
    return NextResponse.json({messege: "Error", err}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
}

//blog投稿API
export const POST = async (req: Request, res: NextResponse) => {
  try {
    //req.json()が返すオブジェクトの中から、titleとdescriptionという2つのプロパティを取り出し、それぞれ代入
    const {title, description} = await req.json()
    await main();
    //create()は、DBに新しいレコード（行）を追加するためのメソッド、引数には作成するデータの内容を挿入
    //また、create()はdataプロパティを指定する必要あり
    const post = await prisma.post.create({ data: { title, description } });
    //{status: 201}はリソースが新しく作成されたことを示すステータスコード
    return NextResponse.json({ messege: 'Success', post }, {status: 201});
  } catch (err) {
    return NextResponse.json({messege: "Error", err}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
}