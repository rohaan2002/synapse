import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';


const useFollow =()=>{
    const queryClient = useQueryClient();
    const {mutate:follow, isPending, isError, error}= useMutation({
        mutationFn: async(userId)=>{
            try{
                const res = await fetch (`/api/users/follow/${userId}`,{
                    method: "POST"
                })
                const data = await res.json();
                if(!res.ok) throw new Error(data.error|| "something wrong in follow hook")
            }catch(error){
                throw error;
            }
        },
        onSuccess:()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey:['suggestedUsers']}), //if user is folowed to fir wo suggested users m ni dikhna chiye, so stale and refetch suggestedUsers query
                queryClient.invalidateQueries({queryKey:['authUser']}) // taaki current user ki follower list update hojaye jisse ui m bhi follow/unfollow toggle krpaye
            ])
        },
        onError: ()=>{
            toast.error(error.message)
        }
        
    })
    return {follow, isPending}
}

export default useFollow;