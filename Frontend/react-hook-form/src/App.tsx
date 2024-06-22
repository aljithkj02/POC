import { SubmitHandler, useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  name: z.string().min(2, "Name must be minimum 2 letters!"),
  email: z.string().email("Please provide a valid email!"),
  password: z.string().min(8, "Password must be at least 8 characters long!")
})

type Inputs = z.infer<typeof loginSchema>;

function App() {

  const { register, formState: { errors }, handleSubmit} = useForm<Inputs>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
      console.log(data);
  }

  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center">
      <div className="w-[35%] bg-white px-10 py-8 rounded-lg">
        <p className="text-center text-2xl">Login</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5 flex flex-col gap-4">
            <input type="text" 
              { ...register('name') }
              className="px-4 py-2 outline-none border-2 rounded-md"
              placeholder="Name"
            />
            { errors.name && <p className="text-sm text-red-500"> { errors.name?.message} </p>}

            <input type="text" 
              { ...register('email') }
              className="px-4 py-2 outline-none border-2 rounded-md"
              placeholder="Email"
            />
            { errors.email && <p className="text-sm text-red-500"> { errors.email?.message } </p>}

            <input type="text" 
              { ...register('password') }
              className="px-4 py-2 outline-none border-2 rounded-md"
              placeholder="Password"
            />
            { errors.password && <p className="text-sm text-red-500"> { errors.password?.message} </p>}

            <button type="submit" 
              className="bg-blue-500 p-2 rounded-lg text-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
