import { deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import React from 'react'
import { toast } from 'react-toastify'
import { db, storage } from '../firebase/firebaseConfig'

const DeleteArticle = ({id,imageUrl}) => {
    const handleDelete= async()=>{
        if (window.confirm("Are you sure you want to delete this Article?")){
            try{
                await deleteDoc(doc(db,"Articles",id));
               toast("Article deleted successfully",{type:"success"});
               const storageRef=ref(storage,imageUrl);
               await deleteObject(storageRef)
           }catch(error){
               toast("Error deleting article",{type:"error"})
           }
        }
      

    }
  return (
   <div>
       <i className='fa fa-times' onClick={handleDelete} style={{cursor:"pointer"}}/>
   </div>
  )
}

export default DeleteArticle