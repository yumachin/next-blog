"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef } from "react"

//編集をする関数
const editBlog = async (title: string | undefined, description: string | undefined, id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    // method: "PUT"のため、api/blog/id/route.tsのPUTのAPIだけが実行される
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    //title, description, idという変数の値を持つオブジェクトを送信
    body: JSON.stringify({ title, description, id })
  })
  return res.json()
}

//編集ボタンを押した後に、初期値が入っているようにする関数
//詳細ページのデータを取得する
const getBlogById = async ( id: number ) => {
  //api/blog/id/route.tsのGETのAPIだけが実行される
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  const data = await res.json();
  console.log(data)
  //api/blog/id/route.tsの20、41、58行目のpostを指す
  return data.post
}

//削除をする関数
const deleteBlog = async ( id: number ) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    // method: "DELETE"のため、api/blog/id/route.tsのDELETEのAPIだけが実行される
    method: "DELETE"
  })
  return res.json()
}

//どのBlogを編集するかを特定するIdを取得するために、paramsという変数を定義(URL情報を含んでいる)
//まず{ params: { id: number } }の部分の params は変数のため、どんな名前でも可
//そして、この部分はオブジェクトの型定義をしている。このオブジェクトのプロパティ名である params を ({ params }: で分割代入で取得している
const EditPost = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  
  //編集ボタンを押した時の挙動
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    await editBlog(titleRef.current?.value, descriptionRef.current?.value, params.id);
    router.push('/');
    router.refresh();
  };

  //削除ボタンを押した時の挙動
  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    await deleteBlog(params.id);
    router.push('/');
    router.refresh();
  };

  //編集コンポーネントがレンダリングされたときに、初期値を入れ込む
  useEffect(() => {
    getBlogById(params.id)
      //getBlogByIdでデータが正常に取得できたとき、then以下が実行
      // dataは25行目のdataのこと
      .then((data) => {
        //(titleRef.currentとdescriptionRef.currentがnullまたはundefinedでないことを確認)
        if (titleRef.current && descriptionRef.current) {
          titleRef.current.value = data.title;
          descriptionRef.current.value = data.description;
        }
      })
      //getBlogByIdの実行中にエラーが発生したとき、catch以下が実行
      .catch((err) => {
        console.error("エラーが発生しました:", err);
      });
  }, [ params.id ])

  return (
    <>
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-white bg-slate-600 font-bold p-3 rounded-md">ブログの編集</p>
          <form>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <button onClick={handleEdit} className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button onClick={handleDelete} className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100">
              削除
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditPost