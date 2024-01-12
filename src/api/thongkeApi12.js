import axiosConfig from "./axiosConfig";

const thongkeApi = {
    getKhenkhenthuongs(params){
        const url = `/thong-ke/khen-thuong/fetch`;
        return axiosConfig.get(url, {params})
    },
    getKiluats(params){
        const url = `/thong-ke/ki-luat/fetch`;
        return axiosConfig.get(url, {params})
    },
    getThiduathangs(params){
        const url = `/thong-ke/thi-dua-thang/fetch`;
        return axiosConfig.get(url, {params})
    },
    getBangThiduathangs(params){
        const url = `/thong-ke/bang-thi-dua-thang/fetch`;
        return axiosConfig.get(url, {params})
    },
    getThiduanams(params){
        const url = `/thong-ke/thi-dua-nam/fetch`;
        return axiosConfig.get(url, {params})
    },
    getBangThiduanams(params){
        const url = `/thong-ke/bang-thi-dua-nam/fetch`;
        return axiosConfig.get(url, {params})
    },
    getTruongthanhdoans(params){
        const url = `/thong-ke/truong-thanh-doan/fetch`;
        return axiosConfig.get(url, {params})
    },
    changeStatusTruongthanhdoan(id){
        const url = `/thong-ke/truong-thanh-doan/change/${id}`;
        return axiosConfig.get(url)
    }
};

export default thongkeApi;