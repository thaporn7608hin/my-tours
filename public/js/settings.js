import axios from "axios"
import Swal from "sweetalert2"

export const settingUser = async (data) => {
   try {
    const res = await axios({
        method:"PATCH",
        url:"/api/v1/users/updateUser",
        data:data
    })
    Swal.fire({
        title: "<h1 style='font-size: 24px;'>Update success</h1>",
        html: "<div style='font-size: 18px;'>Login success fully</div>",
        icon: "success",
        showConfirmButton:false,
        showCancelButton:false,
    })
    setTimeout(() => {
        window.location.reload()
    }, 800);
   } catch (error) {
    Swal.fire({
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

export const updatePassword = async(passwordCurrent,password,passwordConfirm) => {
    try {
        const res = await axios({
            method:"PATCH",
            url:"/api/v1/users/updatePassword",
            data:{
                passwordCurrent,
                password,
                passwordConfirm
            }
        })
        Swal.fire({
            title: "<h1 style='font-size: 24px;'>Update success</h1>",
            html: "<div style='font-size: 18px;'>Login success fully</div>",
            icon: "success",
            showConfirmButton:false,
            showCancelButton:false,
        })

        window.location.assign("/")
    } catch (error) {
        Swal.fire({
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