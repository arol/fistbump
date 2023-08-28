import SignInForm from '@/components/form/SignInForm'
import '@/app/global.css'

export default function Login() {
  return (
    <div className="mt-32 flex flex-col h-screen">
      <div className="w-[550px] mx-auto p-20 border-slate-200 border-2 rounded-xl shadow-lg">
        <h1 className="text-center text-pink-500 font-semibold text-3xl">
          Welcome to
        </h1>
        <h1 className="text-center text-pink-500 font-semibold text-3xl mb-10">
          🤜💥🤛 Fistbump
        </h1>

        <SignInForm></SignInForm>
      </div>
    </div>
  )
}
