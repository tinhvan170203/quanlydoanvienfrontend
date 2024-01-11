import axiosConfig from "./axiosConfig";

const khenthuongApi = {
    getKhentapthes(params){
        const url = `/khen-thuong/tap-the/fetch`;
        return axiosConfig.get(url, {params})
    },
    addKhentapthe(data){
        const url = "/khen-thuong/tap-the/add";
        return axiosConfig.post(url, data)
    },
    editKhentapthe(data){
        const url =`/khen-thuong/tap-the/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteKhentapthe(id){
        const url = `/khen-thuong/tap-the/delete/${id}`;
        return axiosConfig.delete(url)
    },
    getKhencanhans(id){
        const url = `/khen-thuong/ca-nhan/${id}/fetch`;
        return axiosConfig.get(url)
    },
    addKhencanhan(data){
        const url = `/khen-thuong/ca-nhan/add`;
        return axiosConfig.post(url, data)
    },
    editKhencanhan(data){
        const url =`/khen-thuong/ca-nhan/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteKhencanhan(id){
        const url = `/khen-thuong/ca-nhan/delete/${id}`;
        return axiosConfig.delete(url)
    },
    searchKhencanhans(id, params){
        const url = `/khen-thuong/ca-nhan/${id}/search`;
        return axiosConfig.get(url, {params})
    },
};

export default khenthuongApi;