import React,{useState , useEffect} from 'react'
import { useSelector } from 'react-redux'
import{getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import { useRef } from 'react'
import{Modal , Button , Alert} from 'flowbite-react'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {updateUserStart , updateUserSuccess , updateUserFailure , deleteUserStart , deleteUserSuccess , deleteUserFailure} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'


export default function Profile() {
  const fileRef = useRef(null)
  const{currentUser , loading , error} = useSelector((state)=>state.user)
  const[file , setFile] = useState(undefined)
  const[filePerc , setFilePerc] = useState(0);
  const[fileUploadError , setFileUploadError] = useState(false);
   const[formData , setFormData] = useState({})
   const[updateSuccess , setUpdateSuccess] = useState(false)
   const [showModal , setShowModal] = useState(false)
   const dispatch = useDispatch()
 

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file])
  
  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage , fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed' , (snapshot)=>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
          setFilePerc(Math.round(progress))
    },
    (error) =>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
          setFormData({...formData , avatar:downloadURL})
      })
    }
  );

  }

  const handleChange = (e)=>{
    setFormData({...formData , [e.target.id] : e.target.value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}` , {
        method:'POST',
        headers:{
          'Content-Type' : 'application/json',

        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
        dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async()=>{
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}` , {
        method:'DELETE',
      });
      const data = await res.json()
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar ||  currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 ' />


        <p className='text-sm self-center'>
          {fileUploadError ? (<span className='text-red-700'>There was an error while uploading image (image must be less than 2MB)</span>) : (filePerc > 0 && filePerc<100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>) : (filePerc === 100 ? (
               <span className='text-green-700'>Image uploaded successfully</span> ): ""
            )
          )}
        </p>


        <input type="text" placeholder='username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg' onChange={handleChange}   />
        <input type="email" placeholder='email' defaultValue={currentUser.email} id='email' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type="password" placeholder='password'  id='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={()=> setShowModal(true)} className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 font-bold mt-5 text-center'>{error ? error:""}</p>
      <p className='text-green-700 font-bold mt-5 text-center'>{updateSuccess ? 'User is updated successfully!':""}</p>
      
      <Modal
  show={showModal}
  onClose={() => setShowModal(false)}
  popup
  size="md"
  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
    {/* Close Button */}
    <button
      onClick={() => setShowModal(false)}
      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 focus:outline-none transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    {/* Modal Header */}
    <div className="text-lg text-center font-semibold text-gray-800 border-b px-6 py-4">
      Confirm Action
    </div>

    {/* Modal Body */}
    <div className="p-6 text-center">
      <HiOutlineExclamationCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-6">
        Are you sure you want to delete your account permanently?
      </h3>
      <div className="flex justify-center gap-4">
        <Button
          color="failure"
          onClick={handleDeleteUser}
          className="px-6 py-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Yes, I'm sure
        </Button>
        <Button
          color="gray"
          onClick={() => setShowModal(false)}
          className="px-6 py-2 font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
</Modal>


    </div>
  )
}
