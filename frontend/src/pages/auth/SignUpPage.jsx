import { Link } from "react-router-dom";
import { useState } from "react";

// import SynapseSvg from "../../../components/svg/SynapseSvg.jsx";
import SynapseSvg from "../../components/svg/SynapseSvg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullname: "",
		password: ""
	});

	// const {mutate, isError, isPending, error} = useMutation({
	// 	mutationFn: async({email, username, fullname, password})=>{
	// 		try{
	// 			const res = await fetch ("/api/auth/signup", {
	// 				method: "POST",
	// 				headers:{
	// 					"Content-Type": "application/json"
	// 				},
	// 				body: JSON.stringify({email, username, fullname, password})

	// 			});

	// 			if(!res.ok){throw new Error("Something went wrong!")}
	// 			const data =await res.json();

	// 			if(data.error){ throw new Error(data.error)}
	// 			console.log(data.error);	
				
	// 			return data;
	// 		}
	// 		catch(error){
	// 			console.log(error);
	// 			toast.error(error.message)
	// 		}
	// 	}

	// ---------------
	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullname, password }) => {
			
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullname, password }),
				});

				const data = await res.json(); //jo response aya tha after fetching usko json m parse krdo 
				if (!res.ok) throw new Error(data.error || "Failed to create account. See signup mutation");
				// ab us json m se error wali field ko access krskte. us error field m kch hoga if res is not ok (not in 201-299)

				console.log(data); //wrna us res ko jo json m parse kiya tha or 'data' kaha tha. usko print krdena.
				// res m object h ek jo current 'user' (see model) ka pura detail rkha h. even subfields like likes bhi populated h 

				return data;
			} catch (error) {
				
				toast.error(error.message)
				
				console.log(error);
				throw error;
			}
			
		},
		onSuccess: ()=>{
			
				toast.success("Account created successfully!")
		},
		
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		mutate(formData) //mutate ko useMutation se destructure krke nikala h, it simply execute the MutationFn for the data (here in obj form) given to it
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<SynapseSvg className=' fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<div className="block lg:hidden">
					<SynapseSvg className='w-24 hidden fill-white' />
					</div>
					<h1 className='text-4xl font-extrabold text-white'>Connect your Synapse now.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullname'
								onChange={handleInputChange}
								value={formData.fullname}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>{isPending? "Loading": "Sign Up"}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;