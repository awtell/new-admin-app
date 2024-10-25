import instance from "../axios";


const getTestimonials = () => {
    return instance.get(`/Admin/Testimonials/GetTestimonials?Offset=0`)
}

const insertTestimonial = (testimonial: any) => {
    return instance.post(`/Admin/Testimonials/InsertTestimonial`, testimonial)
}

const deleteTestimonial = (testimonialId: number) => {
    return instance.delete(`/Admin/Testimonials/DeleteTestimonial`, { data: { IdTestimonial: testimonialId } })
}

const editTestimonial = (testimonial: any) => {
    return instance.put(`/Admin/Testimonials/UpdateTestimonial`, testimonial)
}

const TestimonialsService = {
    getTestimonials,
    insertTestimonial,
    deleteTestimonial,
    editTestimonial
};

export default TestimonialsService;