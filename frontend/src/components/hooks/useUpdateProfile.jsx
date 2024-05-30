import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";



const useUpdateProfile=()=>{
    const queryClient = useQueryClient();
    // mutate async is mutate function but async, so aage ka code chlega even tho that fn waits for execution
    const {mutateAsync: updateProfileMutate, isPending: isUpdatingProfile}= useMutation({
        mutationFn: async(formData)=>{
          try{
            const res = await fetch ("/api/users/update", {
              method: "POST",
              headers:{
                "Content-Type": "application/json"
              },
              body: JSON.stringify(formData)
            })
            const data = await res.json();
            if(!res.ok) throw new Error(data.error||"Error in updateProfileMutate")
              return data;
          }catch(error){
            console.log(error.message);
            throw error;
          }
          
        },
    
        onSuccess:()=>{
          Promise.all([
            queryClient.invalidateQueries({queryKey:['authUser']}),
            queryClient.invalidateQueries({queryKey:['userProfileQuery']}),
            queryClient.invalidateQueries({queryKey:['postsQuery']})
          ])
          toast.success("Profile updated successfully!")
        },
        onError:(error)=>{
          toast.error(error.message)
        }
      })

      return {updateProfileMutate, isUpdatingProfile}
    
}

export default useUpdateProfile;