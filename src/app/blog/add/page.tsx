"use client"

//"next/navigation"となるように気を付ける
import { useRouter } from "next/navigation"
import { FormEvent, useRef } from "react"

const postBlog = async (title: string | undefined, description: string | undefined) => {
  const res = await fetch(`http://localhost:3000/api/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    //title, descriptionという変数の値を持つオブジェクトを送信
    body: JSON.stringify({ title, description })
  })

  return res.json()
}

const PostBlog = () => {
  const router = useRouter();
  //useRefはDOMの属性にアクセスできる
  //この場合、inputタグにアクセス
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    //.currentはuseRefで設定したDOM要素への参照
    //current?.valueは、currentがnullやundefinedではない時にvalueにアクセス
    await postBlog(titleRef.current?.value, descriptionRef.current?.value)

    //ホームに戻る
    router.push('/');
    //ポストデータが表示されないというバグを修正
    router.refresh();
  }

  return (
    <>
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-white bg-slate-600 font-bold p-3 rounded-md">ブログ新規作成</p>
          <form onSubmit={handleSubmit}>
            <input
              // inputへの入力内容を取得するために、refを指定
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
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              投稿
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default PostBlog