import axiosCommon from "./axiosCommon";
import axiosConfig from "./axiosConfig";

const authApi = {
    login(data){
        const url = '/auth/login';
        return axiosConfig.post(url, data)
    }, 
    logout(){
        const url = `/auth/logout`;
        return axiosConfig.get(url)
    },
    getUsers(params){
        const url = `/auth/user/fetch`;
        return axiosConfig.get(url, {params})
    },
    addUser(data){
        const url = "/auth/user/add";
        return axiosConfig.post(url, data)
    },
    editUser(data){
        const url =`/auth/user/edit/${data.id_edit}`;
        return axiosConfig.put(url, data)
    },
    deleteUser(id, params){
        const url = `/auth/user/delete/${id}`;
        return axiosConfig.delete(url,{params})
    },
    changePass(data){
        const url = '/auth/change-pass';
        return axiosConfig.post(url, data)
    }
};

export default authApi;