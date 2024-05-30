import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType, username, userId}) => {
	

	const getPostEndpoint = ()=>{
		switch(feedType){
			case "forYou":
				return "/api/posts/all"
			case "following":
				return "/api/posts/following"
			case "posts":
				return `/api/posts/user/${username}`
			case "likes":
				return `/api/posts/likedPosts/${userId}`
			default:
				return "/api/posts/all"
		}

	}

	const POST_ENDPOINT = getPostEndpoint();
	
	console.log(POST_ENDPOINT);
	const {data:posts, isLoading, refetch, isRefetching}= useQuery({
		queryKey:['postsQuery'],
		retry:1,
		queryFn: async()=>{
			try{
				const res = await fetch (POST_ENDPOINT);
				const data = await res.json();
				console.log(data);
				if(!res.ok) throw new Error(data.error||"Something wrong while fetching posts")
					console.log(data);
					return data;
			}catch(error){
				throw error;
			}
		}
	})

	const showPosts =(posts)=>{
		{posts?.map((post) => (
			<Post key={post._id} post={post} />
		))}
	}
	useEffect(()=>{
		refetch();
	},[feedType, refetch, username])

	return (
		<>
			{(isLoading|| isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading  && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					
				{posts?.map((post) => (
						<Post key={post._id} post={post} />
					))}
					
					
				</div>
			)}
		</>
	);
};
export default Posts;