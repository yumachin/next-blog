import { PostType } from "@/types";
import Link from "next/link";

const fetchAllBlog = async () => {
  //apiファイルにアクセス
  const res = await fetch(`http://localhost:3000/api/blog`, {
    cache: "no-store"
  })
  const data = await res.json()
  //api/blog/route.tsの26行目のpostsを指す
  return data.posts
}

export default async function Home() {
  const posts = await fetchAllBlog();

  return (
    <main className="w-full h-full">
      <div className="md:w-2/4 sm:w-3/4 m-auto p-4 my-5 rounded-lg bg-blue-900 drop-shadow-xl">
        <h1 className="text-slate-200 text-center text-2xl font-extrabold">
          Full Stack Blog 📝
        </h1>
      </div>
      
      <div className="flex my-5">
        <Link
          href={"/blog/add"}
          className=" md:w-1/6 sm:w-2/4 text-center rounded-md p-2 m-auto bg-slate-300 font-semibold"
        >
          ブログ新規作成
        </Link>
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        {posts.map((post: PostType) => (
          <div key={post.id} className="w-3/4 p-4 rounded-md mx-3 my-2 bg-slate-300 flex flex-col justify-center">
            <div className="flex items-center my-3">
              <div className="mr-auto">
                <h2 className="mr-auto font-semibold">{post.title}</h2>
              </div>
              <Link
                href={`/blog/edit/${post.id}`}
                className="px-4 py-1 text-center text-xl bg-slate-900 rounded-md font-semibold text-slate-200"
              >
                編集
              </Link>
            </div>

            <div className="mr-auto my-1">
              {/* 
                  post.dateは"2023-10-21T12:34:56Z" のような日付文字列 
                  Date()の引数にpost.dateを渡すことで、その日付を基に新しいDateオブジェクトを作成(Dateオブジェクトに直すことで、いろいろな操作が可能に)
                  toDateString()は、日付部分だけを人間に読みやすい形式で返す
              */}
              <blockquote className="font-bold text-slate-700">{new Date(post.date).toDateString()}</blockquote>
            </div>

            <div className="mr-auto my-1">
              <h2>{post.description}</h2>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
