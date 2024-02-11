import axios from "axios"
import Swal from "sweetalert2"

const update = async (review,rating,tour,) => {
    await axios({
        method:"PATCH",
        url:`/api/v1/reviews/${tour}`,
        data:{
            review,
            rating,
            tour,
        }
    })

}

export const reviewTour = async (review,tour,rating) => {
    const res = await axios({
        method:"POST",
        url:`/api/v1/reviews/${tour}`,
        data:{
            review,
            rating,
            tour,
        }
    })

    if (res.data.status === 'success'){
        Swal.fire({
            title: "<h1 style='font-size: 24px;'>Success</h1>",
            html: "<div style='font-size: 18px;'>Login success fully</div>",
            icon: "success",
            showConfirmButton:false,
            showCancelButton:false,
            
        });
       
        window.location.assign("/")
    } else {
        update(review,rating,tour)
        Swal.fire({
            title: "<h1 style='font-size: 24px;'>Update Success</h1>",
            html: "<div style='font-size: 18px;'>Login success fully</div>",
            icon: "success",
            showConfirmButton:false,
            showCancelButton:false,
            
        });
        
        window.location.assign("/") 
    }
}