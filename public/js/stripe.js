import axios from "axios"
import Swal from "sweetalert2"
export const bookTour = async (tourId) => {
    try {
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)
        console.log(session.data.session.url)
        window.location.assign(session.data.session.url)
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
 