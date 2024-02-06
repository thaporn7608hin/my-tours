import axios from "axios"
import swal from 'sweetalert2'
export const login = async (email,password) => {

    try {
        
        const res = await axios({
            method:"POST",
            url:"/api/v1/users/login",
            data:{
                email,
                password
            }
        })
        
        if (res.data.status === 'success'){
            swal.fire({
                title: "<h1 style='font-size: 24px;'>Correct</h1>",
                html: "<div style='font-size: 18px;'>Login success fully</div>",
                icon: "success",
                showConfirmButton:false,
                showCancelButton:false,
                
            });
           
            window.location.assign("/")
            
        }
    } catch (error) {
        swal.fire({
            title: "<h1 style='font-size: 24px;'>Error</h1>",
            html: `<div style='font-size: 18px;'>${error.response.data.message}</div>`,
            icon: "error",
            showCancelButton:false,
            showConfirmButton:true,
            dangerMode: true,
            customClass: {
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button'
            }
        });
    }
}

export const logout = async () => {
   try {
    const res = await axios({
        method:"GET",
        url:`/api/v1/users/logout`,
    })

    if (res.data.status === 'success'){
        swal.fire({
            html: "<div style='font-size: 18px;'>Logout success fully</div>",
            icon: "success",
            showConfirmButton:false,
            showCancelButton:false,
            
        });
        window.location.assign("/")
    }
   } catch (error) {
    swal.fire({
        title: "<h1 style='font-size: 24px;'>Error</h1>",
        html: `<div style='font-size: 18px;'>${error.response.data.message}</div>`,
        icon: "error",
        showCancelButton:false,
        showConfirmButton:true,
        dangerMode: true,
        customClass: {
            confirmButton: 'custom-confirm-button',
            cancelButton: 'custom-cancel-button'
        }
    });
   }
}