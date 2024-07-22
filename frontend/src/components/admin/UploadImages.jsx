import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import {  useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../layouts/PageTitle';
import { useDeleteProductImageMutation, useGetProductDetailsQuery, useUploadProductImagesMutation } from '../../redux/api/productsApi';
import toast from 'react-hot-toast';

const UploadImages = () => {

    const fileInputRef = useRef(null);
    const params = useParams();
    const navigate = useNavigate();

    const [images,setImages] = useState([])
    const [imagesPreview,setImagesPreview] = useState([])
    const [uploadedImages, setUploadedImages] = useState([])
    
    const {data} = useGetProductDetailsQuery(params?.id);

    const [uploadProductImages,{isLoading,isSuccess,error}]=useUploadProductImagesMutation();

    const [deleteProductImage,{isLoading:isDeleteLoading,error:deleteError}] = useDeleteProductImageMutation();

    useEffect(()=>{
        if(data?.product){
            setUploadedImages(data?.product?.images);
        }
        if(error){
            toast.error(error?.data?.message);
        }
        if(deleteError){
            toast.error(deleteError?.data?.message);
        }
        if(isSuccess){
            setImagesPreview([]);
            toast.success("Images Uploaded");
            navigate("/admin/products");
        }
        console.log(deleteError);

    },[data,error,isSuccess,deleteError])

    const onChange = (e)=>{

        const files = Array.from(e.target.files);

        files.forEach((file)=>{

            const reader = new FileReader();
            
            reader.onload=()=>{
              if(reader.readyState===2){
                setImagesPreview((oldArray)=>[...oldArray,reader.result]);
                setImages((oldArray)=>[...oldArray,reader.result]);
              }
            }
            reader.readAsDataURL(file);
            
        })
      }

      const handleResetFileInput =()=>{
        if(fileInputRef.current){
            fileInputRef.current.value="";
        }
      }

      const handleDeleteImagePreview = (image)=>{
        const filteredImagePreview = imagesPreview.filter(img=>img!=image)
        setImages(filteredImagePreview);
        setImagesPreview(filteredImagePreview);
      }

      const submitHandler = (e)=>{
        e.preventDefault();
        uploadProductImages({id: params?.id, body: {images}});
      }
      const deleteImage=(imgId)=>{
        deleteProductImage({id:params?.id,body:{imgId}})
      }
  return (
    <AdminLayout>
        <PageTitle title={"Upload Product Images"}/>
      <div className="row wrapper">
      <div className="col-10 col-lg-8 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" enctype="multipart/form-data" onSubmit={submitHandler}>
          <h2 className="mb-4">Upload Product Images</h2>

          <div className="mb-3">
            <label htmlFor="customFile" className="form-label">Choose Images</label>

            <div className="custom-file">
              <input
              ref={fileInputRef}
                type="file"
                name="product_images"
                className="form-control"
                id="customFile"
                multiple
                onChange={onChange}
                onClick={handleResetFileInput}
              />
            </div>
{imagesPreview?.length>0 &&

            <div className="new-images my-4">
              <p className="text-warning">New Images:</p>
              <div className="row mt-4">
                {imagesPreview?.map((img)=>(

                <div className="col-md-3 mt-2">
                  <div className="card">
                    <img
                      src={img}
                      alt="Card"
                      className="card-img-top p-2"
                      style={{width: "100%", height: "80px"}}
                    />
                    <button
                      style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
                      type="button"
                      className="btn btn-block btn-danger cross-button mt-1 py-0"
                      onClick={()=>handleDeleteImagePreview(img)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </div>

                ))}
              </div>
            </div>

}
{uploadedImages?.length>0 && 
            <div className="uploaded-images my-4">
              <p className="text-success">Product Uploaded Images:</p>
              <div className="row mt-1">
                {uploadedImages?.map((img)=>(
                <div className="col-md-3 mt-2">
                  <div className="card">
                    <img
                      src={img?.url}
                      alt="Card"
                      className="card-img-top p-2"
                      style={{width: "100%", height: "80px"}}
                    />
                    <button
                      style={{backgroundColor: "#dc3545", borderColor: "#dc3545",}}
                      className="btn btn-block btn-danger cross-button mt-1 py-0"
                      disabled={isLoading||isDeleteLoading}
                      type="button"
                      onClick={()=> deleteImage(img?.public_id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
                ))}
              </div>
            </div>

}
         
          </div>

          <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading || isDeleteLoading}>
            {isLoading ? "Uploading ..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  )
}

export default UploadImages
