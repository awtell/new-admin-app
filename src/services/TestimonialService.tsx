import axiosInstance from "../axios";


const getTestimonials = () => {
    return axiosInstance.get(`/Admin/Testimonials/GetTestimonials?Offset=0`)
}

const insertTestimonial = (testimonial: any) => {
    return axiosInstance.post(`/Admin/Testimonials/InsertTestimonial`, testimonial)
}

const deleteTestimonial = (testimonialId: number) => {
    return axiosInstance.delete(`/Admin/Testimonials/DeleteTestimonial`, { data: { IdTestimonial: testimonialId } })
}

const editTestimonial = (testimonial: any) => {
    return axiosInstance.put(`/Admin/Testimonials/UpdateTestimonial`, testimonial)
}

const TestimonialsService = {
    getTestimonials,
    insertTestimonial,
    deleteTestimonial,
    editTestimonial
};

export default TestimonialsService;